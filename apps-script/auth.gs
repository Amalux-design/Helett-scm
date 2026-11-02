/**
 * Inventory Forecast - login backend (Google Apps Script web app).
 *
 * Put this in the PRIVATE auth sheet: Extensions > Apps Script (a script bound to that sheet).
 * First tab layout (row 1 = headers):   email | password
 * Passwords may be typed as plain text; run  Auth > Hash all passwords  to replace them
 * with salted hashes. Deleting a row revokes that user within about a minute.
 *
 * Deploy: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 * Copy the web app URL into AUTH_URL in src/App.tsx.
 */

var TOKEN_DAYS = 30;          // how long a saved login stays valid
var MAX_FAILS = 5;            // wrong passwords per email ...
var LOCK_SECONDS = 15 * 60;   // ... before that email is locked for this long
var USERS_CACHE_SECONDS = 60; // revoked users stop working within this time

/* ---------- web app entry points ---------- */

function doGet() {
  return json_({ ok: true, service: 'inventory-forecast-auth' });
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action === 'login') return json_(login_(body.email, body.password));
    if (body.action === 'verify') return json_(verify_(body.token));
    return json_({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json_({ ok: false, error: 'Bad request' });
  }
}

/* ---------- actions ---------- */

function login_(email, password) {
  email = String(email || '').trim().toLowerCase();
  password = String(password || '');
  if (!email || !password) return { ok: false, error: 'Enter email and password' };

  var cache = CacheService.getScriptCache();
  var failKey = 'fail:' + email;
  var fails = Number(cache.get(failKey) || 0);
  if (fails >= MAX_FAILS) return { ok: false, error: 'Too many attempts. Try again in 15 minutes.' };

  var stored = readUsers_()[email];
  if (stored && checkPassword_(password, stored)) {
    cache.remove(failKey);
    var exp = Date.now() + TOKEN_DAYS * 24 * 3600 * 1000;
    return { ok: true, token: makeToken_(email, exp), exp: exp, email: email };
  }
  cache.put(failKey, String(fails + 1), LOCK_SECONDS);
  Utilities.sleep(700); // slow down guessing
  return { ok: false, error: 'Wrong email or password' };
}

function verify_(token) {
  var p = parseToken_(token);
  if (!p) return { ok: false, error: 'Invalid session' };
  if (p.exp < Date.now()) return { ok: false, error: 'Session expired' };
  if (!readUsers_()[p.e]) return { ok: false, error: 'Access removed' };
  return { ok: true, email: p.e, exp: p.exp };
}

/* ---------- users (private sheet, first tab) ---------- */

function readUsers_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('users');
  if (hit) return JSON.parse(hit);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var rows = sheet.getDataRange().getValues();
  var head = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var ei = head.indexOf('email'), pi = head.indexOf('password');
  var users = {};
  if (ei < 0 || pi < 0) return users;
  for (var i = 1; i < rows.length; i++) {
    var em = String(rows[i][ei]).trim().toLowerCase();
    var pw = String(rows[i][pi]);
    if (em && pw) users[em] = pw;
  }
  cache.put('users', JSON.stringify(users), USERS_CACHE_SECONDS);
  return users;
}

function checkPassword_(password, stored) {
  if (stored.indexOf('h1$') === 0) {
    var parts = stored.split('$'); // h1 $ salt $ hash
    return safeEqual_(hash_(parts[1], password), parts[2]);
  }
  return safeEqual_(password, stored); // plain text until you run "Hash all passwords"
}

function hash_(salt, password) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + password, Utilities.Charset.UTF_8);
  return hex_(bytes);
}

/** Menu: replaces every plain-text password with h1$salt$hash. Safe to run repeatedly. */
function hashAllPasswords() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var range = sheet.getDataRange();
  var rows = range.getValues();
  var head = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
  var pi = head.indexOf('password');
  if (pi < 0) { SpreadsheetApp.getUi().alert('No "password" column in row 1.'); return; }
  var changed = 0;
  for (var i = 1; i < rows.length; i++) {
    var v = String(rows[i][pi]);
    if (v && v.indexOf('h1$') !== 0) {
      var salt = Utilities.getUuid().replace(/-/g, '').slice(0, 16);
      sheet.getRange(i + 1, pi + 1).setValue('h1$' + salt + '$' + hash_(salt, v));
      changed++;
    }
  }
  CacheService.getScriptCache().remove('users');
  SpreadsheetApp.getUi().alert('Hashed ' + changed + ' password(s).');
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Auth').addItem('Hash all passwords', 'hashAllPasswords').addToUi();
}

/* ---------- tokens: base64url(payload).base64url(HMAC) ---------- */

function secret_() {
  var props = PropertiesService.getScriptProperties();
  var s = props.getProperty('TOKEN_SECRET');
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('TOKEN_SECRET', s);
  }
  return s;
}

function sign_(data) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(data, secret_()));
}

function makeToken_(email, exp) {
  var payload = Utilities.base64EncodeWebSafe(JSON.stringify({ e: email, exp: exp }));
  return payload + '.' + sign_(payload);
}

function parseToken_(token) {
  if (!token || typeof token !== 'string' || token.indexOf('.') < 0) return null;
  var parts = token.split('.');
  if (!safeEqual_(sign_(parts[0]), parts[1])) return null;
  try {
    var json = Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString();
    return JSON.parse(json);
  } catch (err) { return null; }
}

/* ---------- helpers ---------- */

function safeEqual_(a, b) {
  a = String(a); b = String(b);
  var diff = a.length ^ b.length;
  for (var i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function hex_(bytes) {
  return bytes.map(function (b) { return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
