/* ═══════════════════════════════════════════════════════════════
   PURCHASE PLAN — pure logic (no React)

   Model, in days from today:
   • Demand starts at today's rate and moves to the 7d/30d trend over 30 days
     (trend factor clamped to 0.5–1.5), then holds.
   • Stock is simulated day by day with a floor at zero: demand that happens
     while the shelf is empty is lost, it never "eats" a later delivery.
   • "Current stock" is the starting layer. Its last `safetyDays` of demand is
     the safety stretch.
   • Placed POs (Include PO on) arrive on their sheet ETA. A PO with no ETA is
     assumed to arrive when stock (plus ETA'd POs) enters its safety stretch.
     POs sharing an ETA form one candle; different ETAs are separate candles.
   • New orders chain: each lands when the layer before it enters safety.
   • Air bridges any unmet demand between the air lead time and the first sea
     delivery (a gap before a PO's ETA, or a sea order that cannot arrive in time).
   • Candles can be moved (what-if). A new order pulled earlier than the sea
     lead time keeps its early part as air.
═══════════════════════════════════════════════════════════════ */

export const PP_MAXH = 900;

export type PlacedPo = { id: string; label: string; units: number; etaDay: number | null; overdue?: boolean };

export type PlanInput = {
  stock0: number;      // enabled planning stock (see getStartStock)
  d0: number;          // units / day today
  r: number;           // trend factor (7d avg ÷ 30d avg), clamped
  LT: number;          // sea lead time, days
  airLT: number;       // air lead time, days (0 = none)
  hasAir: boolean;
  S: number;           // safety stock, days
  placedPos?: PlacedPo[]; // POs already ordered (only when Include PO is on)
  poUnits?: number;       // legacy: total placed units with no ETA
};

export type PlanBar = {
  k: number; units: number; // k < 0 for placed layers
  order: number; arrival: number; tSafe: number; tZero: number;
  late: number;
  id?: string;                 // layer id used for moves ("p:<etaDay>", "p:rule", "n:<k>")
  label?: string;
  etaDay?: number | null;      // sheet ETA (placed layers)
  plannedDay?: number;         // arrival before any move
  moved?: boolean;
  airUntil?: number;           // new order pulled before the sea lead time: [arrival, airUntil) is air
  count?: number;              // how many POs share this candle
};

export type Plan = {
  stockRow: { tSafe: number; tZero: number; gapStart: number; gapEnd: number };
  air: { u: number; arrive: number; until: number; tEnd: number; reason: "gap" | "late" | "manual" } | null;
  placed: PlanBar[];        // already-ordered layers, in arrival order
  bars: PlanBar[];          // new orders
  late: number;
  cum: Float64Array;
  firstDelivery: number;    // earliest arrival of anything (air, placed, new)
};

/** Trend factor from the 7d / 30d averages, clamped so a spike can't blow up the plan. */
export function trendRatio(avg7: number, avg30: number): number {
  if (!(avg30 > 0)) return 1;
  return Math.min(1.5, Math.max(0.5, avg7 / avg30));
}

/** Starting stock = the page's planning stock (FBA + FC Transfer + FC + Inbound, each following its
    toggle, plus manual Add Inbound). PO units are NOT folded in here: with "Include PO" on they are
    drawn as their own already-placed layers (see PlanInput.placedPos). */
export function getStartStock(effectiveStock: number): number {
  return Math.max(0, effectiveStock || 0);
}

/** cum[t] = units demanded before day t starts. */
export function buildCum(d0: number, r: number): Float64Array {
  const cum = new Float64Array(PP_MAXH + 1);
  for (let i = 0; i < PP_MAXH; i++) {
    cum[i + 1] = cum[i] + d0 * Math.max(0, 1 + (r - 1) * Math.min(i / 30, 1));
  }
  return cum;
}

export function splitUnits(total: number, n: number): number[] {
  const base = Math.floor(total / n), rem = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
}

const at = (cum: Float64Array, t: number) => cum[Math.max(0, Math.min(Math.round(t), PP_MAXH))];
const clampDay = (d: number) => Math.max(0, Math.min(PP_MAXH - 1, Math.round(d)));
const EPS = 1e-6;

function placedList(inp: PlanInput): PlacedPo[] {
  const l = inp.placedPos && inp.placedPos.length
    ? inp.placedPos
    : ((inp.poUnits ?? 0) > 0 ? [{ id: "manual", label: "PO", units: inp.poUnits as number, etaDay: null }] : []);
  return l.filter(p => p.units > 0);
}

/** Auto shipment count: about one per 90 days of cover. */
export function autoShipmentCount(cum: Float64Array, total: number): number {
  let days = PP_MAXH;
  for (let i = 0; i <= PP_MAXH; i++) if (cum[i] >= total) { days = i; break; }
  return Math.min(6, Math.max(1, Math.ceil(days / 90)));
}

/** airOverride: null = automatic bridge; a number = user-set air units (0 = none).
    moves: layer id → arrival day the user dragged it to (what-if). */
export function planShipments(
  inp: PlanInput, units: number[], cumIn?: Float64Array,
  airOverride: number | null = null, moves: Record<string, number> = {},
): Plan {
  const { stock0, LT, S, airLT, hasAir } = inp;
  const H = PP_MAXH;
  const cum = cumIn ?? buildCum(inp.d0, inp.r);
  const dem = (t: number) => at(cum, t + 1) - at(cum, t);
  const safe = (t: number) => at(cum, t + S) - at(cum, t);

  // stock at the START of each day (after that day's arrivals), floored at zero
  const sim = (arrs: { t: number; u: number }[]) => {
    const add = new Float64Array(H + 1);
    arrs.forEach(a => { if (a.t >= 0 && a.t <= H) add[a.t] += a.u; });
    const st = new Float64Array(H + 1);
    st[0] = stock0 + add[0];
    for (let t = 1; t <= H; t++) st[t] = Math.max(0, st[t - 1] - dem(t - 1)) + add[t];
    return st;
  };
  const firstIn = (st: Float64Array, from: number, pred: (s: number, t: number) => boolean) => {
    for (let t = Math.max(0, from); t <= H; t++) if (pred(st[t], t)) return t;
    return H;
  };

  // ── layer 0: current stock on its own ──
  const st0 = sim([]);
  const tSafe0 = firstIn(st0, 0, (s, t) => s <= safe(t) + EPS);
  const tZero0 = firstIn(st0, 0, s => s <= EPS);

  // ── placed POs: group by ETA, assumed arrival for the no-ETA group ──
  type G = { id: string; label: string; units: number; etaDay: number | null; count: number; arrival: number; planned: number };
  const gm = new Map<string, G>();
  placedList(inp).forEach(p => {
    const eta = p.etaDay === null || p.etaDay === undefined ? null : clampDay(p.etaDay);
    const id = "p:" + (eta === null ? "rule" : eta);
    const g = gm.get(id) || { id, label: "", units: 0, etaDay: eta, count: 0, arrival: 0, planned: 0 };
    g.units += p.units; g.count += 1; g.label = g.label ? g.label + ", " + p.label : p.label;
    gm.set(id, g);
  });
  const groups = [...gm.values()];
  const arrAll: { t: number; u: number }[] = [];
  groups.filter(g => g.etaDay !== null).forEach(g => {
    g.planned = g.etaDay as number;
    g.arrival = clampDay(moves[g.id] ?? g.planned);
    arrAll.push({ t: g.arrival, u: g.units });
  });
  const ruleG = groups.find(g => g.etaDay === null);
  if (ruleG) {
    const stE = sim(arrAll);
    ruleG.planned = firstIn(stE, 0, (s, t) => s <= safe(t) + EPS);   // assumed: when stock + ETA'd POs enter safety
    ruleG.arrival = clampDay(moves[ruleG.id] ?? ruleG.planned);
    arrAll.push({ t: ruleG.arrival, u: ruleG.units });
  }
  const sorted = [...groups].sort((a, b) => a.arrival - b.arrival);
  const placed: PlanBar[] = [];
  const arrSoFar: { t: number; u: number }[] = [];
  sorted.forEach((g, i) => {
    arrSoFar.push({ t: g.arrival, u: g.units });
    const st = sim(arrSoFar);
    placed.push({
      k: -1 - i, units: g.units, id: g.id, label: g.label, etaDay: g.etaDay, count: g.count,
      arrival: g.arrival, order: g.arrival, plannedDay: g.planned, moved: g.arrival !== g.planned, late: 0,
      tSafe: firstIn(st, g.arrival, (s, t) => s <= safe(t) + EPS),
      tZero: firstIn(st, g.arrival, s => s <= EPS),
    });
  });

  // ── where the stock + placed POs leave off ──
  const lastPlacedArr = placed.length ? Math.max(...placed.map(p => p.arrival)) : 0;
  const stAll = sim(arrAll);
  const baseSafe = placed.length ? firstIn(stAll, lastPlacedArr, (s, t) => s <= safe(t) + EPS) : tSafe0;
  const late = Math.max(0, LT - baseSafe);

  // earliest a new order can arrive: sea lead time, or the air lead time when air exists
  const floorArr = hasAir && airLT > 0 && airLT < LT ? airLT : LT;
  const newArrival = (k: number, prevSafe: number) => {
    const rule = k === 0 ? Math.max(baseSafe, LT) : prevSafe;
    const v = moves["n:" + k];
    return v === undefined ? rule : Math.max(floorArr, clampDay(v));
  };
  const hasNew = units.length > 0;
  const a1 = hasNew ? newArrival(0, 0) : LT;

  // ── air: unmet demand from the air lead time until the first new sea delivery ──
  const airEligible = hasAir && airLT > 0 && airLT < LT;
  let air: Plan["air"] = null;
  if (airEligible) {
    const T = Math.max(airLT + 1, a1);
    const add = new Float64Array(H + 1);
    arrAll.forEach(a => { if (a.t <= H) add[a.t] += a.u; });
    let s = stock0 + add[0], unmet = 0;
    for (let t = 0; t < T; t++) {
      if (t > 0) s += add[t];
      const d = dem(t);
      if (t >= airLT) { if (s >= d) s -= d; else { unmet += d - s; s = 0; } }
      else s = Math.max(0, s - d);
    }
    const auto = Math.ceil(unmet - EPS);
    const u = airOverride !== null ? Math.max(0, Math.round(airOverride)) : auto;
    if (u > 0) {
      const stA = sim([...arrAll, { t: airLT, u }]);
      air = {
        u, arrive: airLT, until: LT,
        tEnd: firstIn(stA, airLT, s => s <= EPS),
        reason: airOverride !== null ? "manual" : (tZero0 < Math.min(a1, ...placed.map(p => p.arrival)) ? "gap" : "late"),
      };
    }
  }
  const arrBase = air ? [...arrAll, { t: air.arrive, u: air.u }] : [...arrAll];

  // ── new orders, chained ──
  const bars: PlanBar[] = [];
  const arrNew = [...arrBase];
  let prevSafe = 0;
  for (let k = 0; k < units.length; k++) {
    if (k > 0 && prevSafe >= PP_MAXH - 1) break;
    const a = clampDay(newArrival(k, prevSafe));
    const airPart = a < LT && hasAir && airLT > 0;     // pulled before the sea lead time: the early part is air
    arrNew.push({ t: a, u: units[k] });
    const st = sim(arrNew);
    // A 0-unit order has no cover of its own: collapse it to its arrival day (handle only)
    const tSafe = units[k] > 0 ? firstIn(st, a, (s, t) => s <= safe(t) + EPS) : a;
    const tZero = units[k] > 0 ? firstIn(st, a, s => s <= EPS) : a;
    bars.push({
      k, units: units[k], id: "n:" + k, arrival: a, tSafe, tZero,
      plannedDay: clampDay(k === 0 ? Math.max(baseSafe, LT) : prevSafe),
      order: airPart ? 0 : Math.max(0, a - LT),
      late: k === 0 && moves["n:0"] === undefined ? late : 0,
      moved: moves["n:" + k] !== undefined, airUntil: airPart ? LT : undefined,
    });
    prevSafe = tSafe;
  }

  // ── gap before the first delivery of any kind ──
  const arrivals = [...placed.map(p => p.arrival), ...(air ? [air.arrive] : []), ...(bars[0] ? [bars[0].arrival] : [])];
  const firstDelivery = arrivals.length ? Math.min(...arrivals) : PP_MAXH;
  const gapStart = tZero0, gapEnd = Math.max(tZero0, firstDelivery);

  return { stockRow: { tSafe: tSafe0, tZero: tZero0, gapStart, gapEnd }, air, placed, bars, late, cum, firstDelivery };
}

/** System recommendation for sea units: cover lead time + safety, following the trend and the
    real arrival days of placed POs, after current stock and the air bridge. */
export function recommendTotal(inp: PlanInput, cum?: Float64Array): number {
  const c = cum ?? buildCum(inp.d0, inp.r);
  const p = planShipments(inp, [], c, null, {});
  const horizon = inp.LT + inp.S;
  const placedBy = p.placed.reduce((s, b) => s + (b.arrival <= horizon ? b.units : 0), 0);
  return Math.max(0, Math.round(at(c, horizon) - inp.stock0 - placedBy - (p.air?.u ?? 0)));
}

/** Units for new order k so its cover runs out on `day` (end-handle drag). Smallest u that reaches it. */
export function unitsForEndDay(
  inp: PlanInput, units: number[], k: number, day: number, cum: Float64Array,
  airOverride: number | null, moves: Record<string, number>,
): number {
  const d = Math.max(0, Math.min(PP_MAXH, Math.round(day)));
  const reach = (u: number) => {
    const us = units.slice(); us[k] = u;
    return planShipments(inp, us, cum, airOverride, moves).bars[k]?.tZero ?? 0;
  };
  if (reach(0) >= d) return 0;
  let lo = 0, hi = Math.max(1000, Math.ceil(cum[PP_MAXH]));
  if (reach(hi) < d) return hi;
  for (let i = 0; i < 40 && hi - lo > 1; i++) { const mid = (lo + hi) >> 1; if (reach(mid) >= d) hi = mid; else lo = mid; }
  return hi;
}

/** Air units so stock + placed + air run out on `day` (air end-handle drag). Smallest u that reaches it. */
export function unitsForAirEndDay(
  inp: PlanInput, units: number[], day: number, cum: Float64Array, moves: Record<string, number>,
): number {
  const d = Math.max(0, Math.min(PP_MAXH, Math.round(day)));
  if (d <= inp.airLT) return 0;                       // before the air can even arrive: no air
  const reach = (u: number) => planShipments(inp, units, cum, u, moves).air?.tEnd ?? 0;
  let lo = 0, hi = Math.max(1000, Math.ceil(cum[PP_MAXH]));
  if (reach(hi) < d) return hi;
  for (let i = 0; i < 40 && hi - lo > 1; i++) { const mid = (lo + hi) >> 1; if (reach(mid) >= d) hi = mid; else lo = mid; }
  return hi;
}

/** "03 Nov"-style label for a day offset from the anchor date. */
export function dayLabel(anchor: Date, day: number): string {
  return new Date(anchor.getTime() + day * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
