/* ═══════════════════════════════════════════════════════════════
   CSS GENERATOR — minimal utilitarian SaaS dashboard
   Flat panels, hairline borders, ink as the primary colour. Green / orange /
   red carry meaning only. Blue is the focus ring and nothing else.
═══════════════════════════════════════════════════════════════ */
export function makeCSS(t){
const SANS="'Instrument Sans',system-ui,sans-serif";
const MONO="'IBM Plex Mono',ui-monospace,Consolas,monospace";
return `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{height:100%;font-size:15px;overflow:hidden}
body{height:100%;overflow:hidden;background:${t.bg};color:${t.text};font-family:${SANS};line-height:1.45;-webkit-font-smoothing:antialiased}
#fba-root{display:flex;height:100vh;width:100%;overflow:hidden;position:fixed;top:0;left:0;right:0;bottom:0;text-align:left}
.content,.topbar,.tb-title,.tb-sub,.ch,.card,.kc,h1,h2,h3,p,div{text-align:left}
:focus-visible{outline:2px solid ${t.focus};outline-offset:2px}
button,input,select,textarea{font-family:${SANS}}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
::view-transition-old(root){z-index:1}
::view-transition-new(root){z-index:2}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}}

/* ── SIDEBAR (laptop: fixed 240px) ── */
.sb{position:fixed;top:0;left:0;bottom:0;z-index:80;width:260px;background:${t.sidebar};border-right:1px solid ${t.sbBorder};display:flex;flex-direction:column;overflow:hidden;transform:translateX(-100%);visibility:hidden;transition:transform .2s ease,visibility 0s .2s;box-shadow:none}
.sb.open{transform:translateX(0);visibility:visible;transition:transform .2s ease;box-shadow:8px 0 24px rgba(0,0,0,.25)}
.sb-bg{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .2s}
.sb-bg.open{opacity:1;pointer-events:auto}
.tb-menu{width:44px;height:44px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid ${t.border2};background:${t.surface};color:${t.text};font-size:18px;cursor:pointer}
.tb-menu:hover{background:${t.surface2}}
.sb-logo{padding:0 20px;height:64px;border-bottom:1px solid ${t.sbBorder};display:flex;align-items:center;gap:10px;flex-shrink:0}
.sb-icon{width:28px;height:28px;background:${t.accent};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${t.onInk}}
.sb-txt{overflow:hidden;min-width:0}
.sb-txt h1{font-size:17px;font-weight:600;color:${t.text};white-space:nowrap;letter-spacing:-.2px}
.sb-nav{flex:1;padding:12px;overflow-y:auto;overflow-x:hidden}
.ni{display:flex;align-items:center;gap:12px;padding:0 14px;border-radius:999px;cursor:pointer;font-size:15px;font-weight:500;color:${t.sbItem};margin-bottom:2px;white-space:nowrap;overflow:hidden;position:relative;min-height:44px;border:0;background:transparent;width:100%;text-align:left}
.ni:hover{background:${t.sbHover};color:${t.sbItemHover}}
.ni.on,.ni.on:hover{background:${t.sbActive};color:${t.sbActiveText};font-weight:600}
.ni.disabled{opacity:.35;cursor:not-allowed;pointer-events:none}
.ni-ic{width:20px;min-width:20px;height:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ni-ic svg{width:18px;height:18px}
.ni-txt{overflow:hidden;text-overflow:ellipsis}
.nb{margin-left:auto;font-size:12px;font-weight:600;min-width:22px;height:22px;padding:0 7px;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;background:${t.surface};color:${t.text};border:1px solid ${t.border2};font-family:${MONO}}
.ni.on .nb{background:transparent;color:${t.sbActiveText};border-color:currentColor}
.nb.r{border-color:${t.red};color:${t.red}}
.ni.on .nb.r{color:${t.sbActiveText};border-color:currentColor}
.sb-user{border-top:1px solid ${t.sbBorder};padding:14px 16px;display:flex;flex-direction:column;gap:10px;flex-shrink:0}
.sb-user-name{font-size:13px;color:${t.text3};overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-user-name b{display:block;font-size:15px;font-weight:600;color:${t.text}}

/* ── MAIN / TOPBAR ── */
.main{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;background:${t.bg}}
.mbar,.tabbar,.msheet-wrap{display:none}
.topbar{min-height:60px;background:${t.surface};border-bottom:1px solid ${t.border};display:flex;align-items:center;padding:8px 32px;gap:12px;flex-shrink:0;min-width:0}
.tb-title{font-size:24px;font-weight:600;color:${t.text};white-space:nowrap;letter-spacing:-.3px;overflow:hidden;text-overflow:ellipsis;max-width:420px;line-height:1.2}
.tb-sub{font-size:13px;color:${t.text3};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tb-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex-shrink:0}
.tb-badge{display:inline-flex;align-items:center;height:24px;padding:0 8px;border-radius:8px;font-size:13px;font-weight:500;white-space:nowrap;background:${t.surface};border:1px solid ${t.border};color:${t.text3}}
.content{flex:1;overflow-y:auto;overflow-x:hidden;padding:24px 32px 40px}


/* ── BUTTONS (44px, 8px radius) ── */
.btn,.tb-btn,.bk{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:44px;padding:0 16px;border-radius:8px;font-size:15px;font-weight:500;line-height:1;cursor:pointer;white-space:nowrap;border:1px solid ${t.border2};background:${t.surface};color:${t.text};transition:background .12s,border-color .12s}
.btn:hover,.tb-btn:hover,.bk:hover{background:${t.surface2};border-color:${t.text3}}
.btn:disabled,.tb-btn:disabled{opacity:.45;cursor:not-allowed;pointer-events:none}
.bp,.tb-btn.pri{background:${t.accent};color:${t.onInk};border-color:${t.accent}}
.bp:hover,.tb-btn.pri:hover{background:${t.accent};border-color:${t.accent};opacity:.88}
.bx{background:${t.text};color:${t.bg};border-color:${t.text}}
.bx:hover{background:${t.text};border-color:${t.text};opacity:.88}
.bn{background:${t.green};color:#fff;border-color:${t.green}}
.bn:hover{background:${t.green};border-color:${t.green};opacity:.9}
.bs{background:${t.surface};color:${t.text};border-color:${t.border2}}
.bc{background:${t.surface};color:${t.text};border-color:${t.orange}}
.bdl{background:${t.surface};color:${t.text};border-color:${t.red}}
.bd,.btn-signout{background:${t.red};color:#fff;border-color:${t.red}}
.bd:hover,.btn-signout:hover{background:${t.red};border-color:${t.red};opacity:.9}
.tb-btn.danger{border-color:${t.red};color:${t.text}}
.tb-btn.danger:hover{background:${t.redBg};border-color:${t.red}}
.bk{height:44px;margin-bottom:12px;font-weight:500}
.tb-btn-accent{display:none}
.tb-r .tb-btn{height:34px;padding:0 12px;font-size:13px;gap:6px}
.tb-r .tb-icon{width:34px;padding:0}
.tb-meta{font-size:13px;color:${t.text3};white-space:nowrap;margin-right:6px}

/* ── BADGES (24px, 8px radius, no dots, outline only) ── */
.badge{display:inline-flex;align-items:center;gap:5px;height:24px;padding:0 8px;border-radius:8px;font-size:13px;font-weight:500;white-space:nowrap;border:1px solid ${t.text}!important;background:${t.surface}!important;color:${t.text}!important}
.badge *{color:inherit!important;background:transparent!important}
.badge .dot{display:none}
.badge.bg{border-color:${t.green}!important;color:${t.green}!important}
.badge.br{border-color:${t.red}!important;color:${t.red}!important}
.badge.by,.badge.bpr{border-color:${t.orange}!important;color:${t.orange}!important}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block;flex-shrink:0}
.dot.r{background:${t.red}}.dot.y{background:${t.yellow}}.dot.g{background:${t.green}}.dot.b{background:${t.accent}}.dot.gr{background:${t.text3}}.dot.p{background:${t.orange}}
.br,.by,.bg,.bb,.bgr,.bpr{font-weight:500}

/* ── PANELS ── */
.card,.wsec,.fc-card,.sbar,.kc{background:${t.surface};border:1px solid ${t.border};border-radius:12px;min-width:0}
.card{padding:20px;overflow:hidden;width:100%}
.ch,.wh{font-size:16px;font-weight:600;color:${t.text};margin:-4px -4px 16px;padding:0 4px 12px;border-bottom:1px solid ${t.border}}
.kg{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px;margin-bottom:16px;width:100%}
.kc{padding:16px 18px;position:relative;overflow:hidden}
.kc.r{border-color:${t.red}}
.kl{font-size:14px;color:${t.text3};font-weight:500;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;justify-content:space-between}
.kv{font-size:30px;font-weight:600;color:${t.text};line-height:1.1;font-family:${MONO};letter-spacing:-.5px;font-variant-numeric:tabular-nums}
.ks{font-size:13px;color:${t.text3};margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wsec{padding:18px;margin-bottom:12px}
.fc-card{overflow:hidden;margin-bottom:12px}
.fc-card-hdr{padding:12px 16px;min-height:48px;background:${t.surface};border-bottom:1px solid ${t.border};display:flex;align-items:center;gap:12px}
.fc-no-data{padding:14px;text-align:center;font-size:13px;color:${t.text3}}
.fc-rec-list{padding:10px 14px;display:flex;flex-direction:column;gap:6px}
.fc-rec-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:${t.surface};border-radius:8px;border:1px solid ${t.border};font-size:14px}
.sbar{padding:16px 20px;margin-bottom:16px;overflow:hidden;width:100%;position:sticky;top:0;z-index:10}
.sg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;min-width:0;width:100%}
.slg{min-width:0;padding:0 24px;border-right:1px solid ${t.border}}
.slg:first-child{padding-left:0}
.slg:last-child{border-right:none;padding-right:0}
.slg label{font-size:14px;color:${t.text2};font-weight:500;display:flex;justify-content:space-between;margin-bottom:12px;user-select:none}
.slg label span{color:${t.text};font-family:${MONO};font-weight:500;font-size:14px}
.sbar-info{margin-top:14px;padding-top:12px;border-top:1px solid ${t.border};font-size:13px;color:${t.text3};line-height:1.6}
.sbar-info strong{color:${t.text2}}
input[type=range]{width:100%;max-width:100%;appearance:none;height:4px;background:${t.border2};border-radius:2px;outline-offset:6px;cursor:pointer;display:block}
input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:${t.accent};cursor:pointer;border:2px solid ${t.surface};box-shadow:0 0 0 1px ${t.accent}}
input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${t.accent};cursor:pointer;border:2px solid ${t.surface}}
input[type=checkbox]{appearance:none;-webkit-appearance:none;flex-shrink:0;position:relative;width:36px;height:22px;border-radius:999px;background:#0b0d10;border:1px solid ${t.border2};cursor:pointer;vertical-align:middle;transition:background .18s,border-color .18s;outline-offset:2px}
input[type=checkbox]::before{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .18s,background .18s}
input[type=checkbox]:checked{background:#fff;border-color:${t.border2}}
input[type=checkbox]:checked::before{transform:translateX(14px);background:#12161c}
input[type=checkbox]:disabled{opacity:.45;cursor:not-allowed}
td input[type=checkbox],th input[type=checkbox]{appearance:auto;-webkit-appearance:checkbox;width:16px;height:16px;border-radius:0;background:none;accent-color:${t.accent}}
td input[type=checkbox]::before,th input[type=checkbox]::before{display:none}
td input[type=checkbox]:checked,th input[type=checkbox]:checked{background:none}

/* ── TABLES ── */
.tw{overflow-x:auto;width:100%;max-width:100%;-webkit-overflow-scrolling:touch}
.ts{overflow-y:auto;max-height:calc(100vh - 300px)}
table{width:100%;border-collapse:collapse;table-layout:auto}
th{padding:0 12px;height:44px;text-align:right;font-size:13px;font-weight:600;color:${t.text3};border-bottom:1px solid ${t.border2};white-space:nowrap;background:${t.surface};position:sticky;top:0;z-index:2}
th:first-child,td:first-child{text-align:left}
td{padding:0 12px;height:56px;border-bottom:1px solid ${t.border};color:${t.text};font-size:14px;white-space:nowrap;font-variant-numeric:tabular-nums;text-align:right}
td:not(:first-child){font-family:${MONO};font-size:13px}
tr:last-child td{border-bottom:none}
tr:hover td{background:${t.rowHover}}
tr.cr{cursor:pointer}
.tn{font-family:${SANS};font-size:15px;font-weight:600;color:${t.text};overflow:hidden;text-overflow:ellipsis;max-width:240px;text-align:left}
.ta{font-size:12px;color:${t.text3};margin-top:1px;text-align:left;font-family:${MONO}}

/* ── INPUTS + CUSTOM DROPDOWN ── */
.ti,.sbox,.sel{height:44px;background:${t.surface};border:1px solid ${t.border2};border-radius:8px;color:${t.text};font-size:15px;outline:none}
.ti{padding:0 12px;width:100%}
.ti:focus,.sbox:focus-within,.sel:focus-visible{border-color:${t.text};outline:2px solid ${t.focus};outline-offset:1px}
.ti:disabled,.ti[disabled]{background:${t.surface2};color:${t.text3};cursor:not-allowed}
.ti::placeholder,.sbox input::placeholder{color:${t.text3}}
.sbox{display:flex;align-items:center;gap:8px;padding:0 12px}
.sbox input{background:none;border:none;outline:none;color:${t.text};font-size:15px;width:200px}
.sbox input:focus-visible{outline:none}
.sel{display:inline-flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px;min-width:150px;cursor:pointer;text-align:left}
.sel-sm{height:32px;min-width:110px;padding:0 8px;font-size:13px;border-radius:6px}
.sel-menu{position:fixed;z-index:200;background:${t.surface};border:1px solid ${t.border2};border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.14);padding:4px;max-height:280px;overflow-y:auto}
.sel-search{width:100%;height:36px;margin-bottom:4px;padding:0 10px;background:${t.surface2};border:1px solid ${t.border};border-radius:6px;color:${t.text};font-size:14px;outline:none}
.sel-opt{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:40px;padding:0 10px;border-radius:6px;font-size:15px;color:${t.text};cursor:pointer}
.sel-opt.hl{background:${t.surface2}}
.sel-opt.on{font-weight:700}
.fdrop{border:1px dashed ${t.border2};border-radius:12px;padding:16px;text-align:center;cursor:pointer;font-size:14px;color:${t.text3}}
.fdrop:hover,.fdrop.drag{border-color:${t.text};color:${t.text};background:${t.accentBg}}
.floaded{background:${t.surface};border:1px solid ${t.green};border-radius:8px;padding:10px 12px;font-size:14px;color:${t.green};display:flex;align-items:center;gap:8px}
.igrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:12px}
.ic{background:${t.surface};border:1px solid ${t.border};border-radius:12px;padding:14px}
.icl{font-size:15px;font-weight:600;color:${t.text};margin-bottom:2px}
.ics{font-size:13px;color:${t.text3};margin-bottom:10px}
.srow{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;min-width:0;width:100%}
.sr{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid ${t.border}}
.sr:last-child{border-bottom:none}
.sk{font-size:14px;color:${t.text3}}
.sv{font-size:14px;font-weight:500;color:${t.text};font-family:${MONO}}

/* ── ALERTS ── */
.alert{display:flex;align-items:flex-start;gap:8px;padding:10px 12px;border-radius:8px;margin-bottom:8px;font-size:14px;line-height:1.5;background:${t.surface};border:1px solid ${t.border2};color:${t.text}}
.ar{border-color:${t.red};color:${t.red}}
.ay{border-color:${t.orange};color:${t.orange}}
.ab{border-color:${t.border2};color:${t.text}}
.ag{border-color:${t.green};color:${t.green}}

/* ── MISC ── */
.ld{display:flex;align-items:center;justify-content:center;height:120px;flex-direction:column;gap:10px;color:${t.text3}}
.sp{width:22px;height:22px;border:2px solid ${t.border2};border-top-color:${t.text};border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:56px 20px;color:${t.text3}}
.empty-ic{display:none}
.empty h3{font-size:16px;font-weight:600;color:${t.text};margin-bottom:6px}
.empty p{font-size:14px;line-height:1.6;color:${t.text3};text-align:center}
.d2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.d4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}
.ac{padding:12px;background:${t.surface2};border-radius:8px;border:1px solid ${t.border}}
.acl{font-size:13px;color:${t.text3};margin-bottom:4px;font-weight:500}
.acv{font-size:22px;font-weight:600;font-family:${MONO};letter-spacing:-.3px}
.acs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.hm-grid{display:grid;gap:8px}
.hm-region{border-radius:8px;padding:10px 14px;position:relative;overflow:hidden}
.hm-name{font-size:13px;font-weight:600;margin-bottom:5px}
.hm-vals{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.hm-units{font-size:22px;font-weight:600;font-family:${MONO};line-height:1}
.hm-pct{font-size:12px;color:${t.text3};align-self:flex-end;margin-bottom:2px}
.hm-stock{font-size:12px;margin-left:auto;padding:2px 8px;border-radius:8px}
.hm-bar{position:absolute;bottom:0;left:0;height:3px;border-radius:0 2px 0 8px}
.adj-card{background:${t.surface2};border:1px solid ${t.border};border-radius:12px;padding:12px 14px;margin-bottom:12px}
.adj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.adj-sub{font-size:12px;color:${t.text3};margin-top:3px}
::-webkit-scrollbar{width:8px;height:8px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${t.border2};border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:${t.text3}}

/* ── PHONE / TABLET (<1024px): top bar + bottom tab bar ── */
@media(max-width:1023px){
  .sb,.sb-bg,.tb-menu{display:none}
  .mbar{display:flex;align-items:center;justify-content:space-between;height:56px;padding:0 16px;background:${t.surface};border-bottom:1px solid ${t.border};flex-shrink:0}
  .mbar-brand{display:flex;align-items:center;gap:10px;font-size:17px;font-weight:600;color:${t.text}}
  .mbar-r{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:500;color:${t.text2}}
  .mbar-btn{width:44px;height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid ${t.border2};background:${t.surface};color:${t.text};cursor:pointer}
  .topbar{padding:12px 16px;flex-wrap:wrap}
  .tb-title{font-size:22px;max-width:100%}
  .tb-r{margin-left:0;flex-wrap:wrap;width:100%}
  .tb-badge,.tb-meta{display:none}
  .content{padding:16px 16px 96px}
  .tabbar{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:40;height:68px;background:${t.surface};border-top:1px solid ${t.border};padding:6px 4px}
  .tab{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:0;background:transparent;color:${t.text3};font-size:12px;font-weight:500;cursor:pointer}
  .tab-ic{width:48px;height:30px;border-radius:999px;display:flex;align-items:center;justify-content:center}
  .tab.on{color:${t.text};font-weight:600}
  .tab.on .tab-ic{background:${t.sbActive};color:${t.sbActiveText}}
  .tab.disabled{opacity:.35;pointer-events:none}
  .msheet-wrap{display:block;position:fixed;inset:0;z-index:70;pointer-events:none}
  .msheet-wrap.open{pointer-events:auto}
  .msheet-bg{position:absolute;inset:0;background:rgba(0,0,0,.4);opacity:0}
  .msheet-wrap.open .msheet-bg{opacity:1}
  .msheet{position:absolute;left:0;right:0;bottom:0;max-height:85vh;overflow-y:auto;background:${t.surface};border-radius:12px 12px 0 0;border:1px solid ${t.border};padding:16px;transform:translateY(100%);transition:transform .18s ease}
  .msheet-wrap.open .msheet{transform:translateY(0)}
  .msheet-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .sg{grid-template-columns:1fr}
  .slg{padding:12px 0;border-right:none;border-bottom:1px solid ${t.border}}
  .slg:last-child{border-bottom:none}
  .igrid{grid-template-columns:1fr}
  .d4{grid-template-columns:repeat(2,1fr)}
  .kg{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:600px){.d2{grid-template-columns:1fr}.acs{grid-template-columns:1fr}.adj-grid{grid-template-columns:1fr}.sbox input{width:100%}.sbox{flex:1 1 100%}}
`;}
