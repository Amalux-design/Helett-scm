/* ═══════════════════════════════════════════════════════════════
   PURCHASE PLAN — pure logic (no React)

   Model, in days from today:
   • Demand starts at today's rate and moves to the 7d/30d trend over 30 days
     (trend factor clamped to 0.5–1.5), then holds.
   • "Current stock" is the starting layer: it lasts until cumulative demand eats it.
     Its last `safetyDays` of demand is the safety stretch (tSafe → tZero).
   • Each purchase order (PO) lands the day the previous layer enters its safety
     stretch, so stock never dips into safety without a shipment already arriving.
   • If sea can't land in time (lead time > days until safety), the order is late;
     an air bridge covers the gap until sea lands, when air is available.
═══════════════════════════════════════════════════════════════ */

export const PP_MAXH = 900;

export type PlanInput = {
  stock0: number;      // enabled planning stock (see getStartStock)
  d0: number;          // units / day today
  r: number;           // trend factor (7d avg ÷ 30d avg), clamped
  LT: number;          // sea lead time, days
  airLT: number;       // air lead time, days (0 = none)
  hasAir: boolean;
  S: number;           // safety stock, days
  poUnits?: number;    // units already ordered (manual Purchased Units + open POs) when Include PO is on
};

export type PlanBar = {
  k: number; units: number; // k = -1 for the already-placed PO layer
  order: number; arrival: number; tSafe: number; tZero: number;
  late: number;
};

export type Plan = {
  stockRow: { tSafe: number; tZero: number; gapStart: number; gapEnd: number };
  air: { u: number; arrive: number; until: number; tEnd: number } | null; // tEnd = day the air units run out
  placed: PlanBar | null;   // already-ordered PO layer, lands where current stock enters safety
  bars: PlanBar[];
  late: number;
  cum: Float64Array;
};

/** Trend factor from the 7d / 30d averages, clamped so a spike can't blow up the plan. */
export function trendRatio(avg7: number, avg30: number): number {
  if (!(avg30 > 0)) return 1;
  return Math.min(1.5, Math.max(0.5, avg7 / avg30));
}

/** Starting stock = the page's planning stock (FBA + FC Transfer + FC + Inbound, each following its
    toggle, plus manual Add Inbound). PO units are NOT folded in here: with "Include PO" on they are
    drawn as their own already-placed layer after the stock (see PlanInput.poUnits). */
export function getStartStock(effectiveStock: number): number {
  return Math.max(0, effectiveStock || 0);
}

/** Units already ordered, counted only when "Include PO" is on. */
export function getPlacedPoUnits(manualPurchased: number, openPoUnits: number, inclPO: boolean): number {
  return inclPO ? Math.max(0, (manualPurchased || 0) + (openPoUnits || 0)) : 0;
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

/** Units needed in the air bridge so stock lasts until sea lands (0 if none needed / no air). */
function airBridge(cum: Float64Array, inp: PlanInput, extra = 0): { u: number; arrive: number; until: number; tEnd: number } | null {
  const { stock0, LT, airLT, hasAir } = inp;
  if (!hasAir || !(airLT > 0) || !(airLT < LT)) return null;
  const u = Math.max(0, Math.ceil(at(cum, LT) - stock0 - extra));
  return u > 0 ? { u, arrive: airLT, until: LT, tEnd: LT } : null;
}

/** System recommendation for sea units: cover lead time + safety, following the trend,
    after current stock and the air bridge (same idea as the Shipment Plan card, trend-aware). */
export function recommendTotal(inp: PlanInput, cum?: Float64Array): number {
  const c = cum ?? buildCum(inp.d0, inp.r);
  const po = Math.max(0, inp.poUnits ?? 0);
  const base = inp.stock0 + po; // placed PO counts as stock for the recommendation
  const t0 = firstDay(c, inp, 0, t => base - at(c, t) <= safeAt(c, inp.S, t));
  const late = t0 < inp.LT;
  const air = late ? airBridge(c, inp, po) : null;
  return Math.max(0, Math.round(at(c, inp.LT + inp.S) - base - (air?.u ?? 0)));
}

/** Auto shipment count: about one per 90 days of cover. */
export function autoShipmentCount(cum: Float64Array, total: number): number {
  let days = PP_MAXH;
  for (let i = 0; i <= PP_MAXH; i++) if (cum[i] >= total) { days = i; break; }
  return Math.min(6, Math.max(1, Math.ceil(days / 90)));
}

const safeAt = (cum: Float64Array, S: number, t: number) => at(cum, t + S) - at(cum, t);
function firstDay(_cum: Float64Array, _inp: PlanInput, from: number, pred: (t: number) => boolean): number {
  for (let t = Math.max(0, from); t <= PP_MAXH; t++) if (pred(t)) return t;
  return PP_MAXH;
}

/** airOverride: null = automatic bridge; a number = user-set air units (0 = none). */
export function planShipments(inp: PlanInput, units: number[], cumIn?: Float64Array, airOverride: number | null = null): Plan {
  const { stock0, LT, S } = inp;
  const cum = cumIn ?? buildCum(inp.d0, inp.r);
  const safe = (t: number) => safeAt(cum, S, t);
  const arr: { t: number; u: number }[] = [];
  const stockAt = (t: number) => {
    let s = stock0 - at(cum, t);
    for (const a of arr) if (a.t <= t) s += a.u;
    return s;
  };
  const first = (from: number, pred: (t: number) => boolean) => firstDay(cum, inp, from, pred);

  // Layer 1: current stock on its own
  const tSafe0 = first(0, t => stock0 - at(cum, t) <= safe(t));
  const tZero0 = first(0, t => stock0 - at(cum, t) <= 0);

  // Already-placed PO (Include PO on): lands where current stock enters safety, as the first layer after it
  const po = Math.max(0, Math.round(inp.poUnits ?? 0));
  let placed: PlanBar | null = null;
  if (po > 0) {
    arr.push({ t: tSafe0, u: po });
    const ts = first(tSafe0, t => stockAt(t) <= safe(t));
    const tz = first(tSafe0, t => stockAt(t) <= 0);
    placed = { k: -1, units: po, arrival: tSafe0, order: tSafe0, tSafe: ts, tZero: tz, late: 0 };
  }
  const baseSafe = placed ? placed.tSafe : tSafe0;

  const late = Math.max(0, LT - baseSafe);
  let air = late > 0 ? airBridge(cum, inp, placed && placed.arrival < LT ? po : 0) : null;
  if (airOverride !== null && inp.hasAir && inp.airLT > 0 && inp.airLT < inp.LT) {
    air = airOverride > 0 ? { u: Math.round(airOverride), arrive: inp.airLT, until: inp.LT, tEnd: inp.LT } : null;
  }
  if (air) {
    // where the air units run out (current stock + placed PO + air only, before any sea order lands)
    const au = air.u, aa = air.arrive;
    air = { ...air, tEnd: first(aa, t => stock0 - at(cum, t) + (placed && placed.arrival <= t ? po : 0) + au <= 0) };
  }
  if (air) arr.push({ t: air.arrive, u: air.u });

  const bars: PlanBar[] = [];
  let a = Math.max(baseSafe, LT);
  for (let k = 0; k < units.length; k++) {
    if (k > 0) { a = bars[k - 1].tSafe; if (a >= PP_MAXH - 1) break; }
    arr.push({ t: a, u: units[k] });
    // A 0-unit order has no cover of its own: collapse it to its landing day (handle only)
    const tSafe = units[k] > 0 ? first(a, t => stockAt(t) <= safe(t)) : a;
    const tZero = units[k] > 0 ? first(a, t => stockAt(t) <= 0) : a;
    bars.push({ k, units: units[k], arrival: a, order: Math.max(0, a - LT), tSafe, tZero, late: k === 0 ? late : 0 });
  }

  // Days with nothing on the shelf before the first replenishment lands
  const firstLanding = Math.min(air ? air.arrive : PP_MAXH, placed ? placed.arrival : PP_MAXH, bars[0]?.arrival ?? PP_MAXH);
  const gapStart = tZero0, gapEnd = Math.max(tZero0, firstLanding);

  return { stockRow: { tSafe: tSafe0, tZero: tZero0, gapStart, gapEnd }, air, placed, bars, late, cum };
}

/** Units for shipment k so its cover runs out on `day` (used when dragging its end handle). */
export function unitsForEndDay(plan: Plan, inp: PlanInput, units: number[], k: number, day: number): number {
  const prev = units.slice(0, k).reduce((s, v) => s + v, 0);
  const d = Math.max(0, Math.min(PP_MAXH, Math.round(day)));
  return Math.max(0, Math.round(plan.cum[d] - inp.stock0 - (plan.placed?.units ?? 0) - (plan.air?.u ?? 0) - prev));
}

/** "03 Nov"-style label for a day offset from the anchor date. */
export function dayLabel(anchor: Date, day: number): string {
  return new Date(anchor.getTime() + day * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/** Air units so the air layer runs out on `day` (used when dragging the Air bar's end handle). */
export function unitsForAirEndDay(plan: Plan, inp: PlanInput, day: number): number {
  const d = Math.max(0, Math.min(PP_MAXH, Math.round(day)));
  const placedBy = plan.placed && plan.placed.arrival <= d ? plan.placed.units : 0;
  return Math.max(0, Math.round(plan.cum[d] - inp.stock0 - placedBy));
}
