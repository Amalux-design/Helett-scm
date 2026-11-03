import { useMemo, useRef, useState } from "react";
import {
  PP_MAXH, buildCum, splitUnits, planShipments, recommendTotal, autoShipmentCount,
  unitsForEndDay, unitsForAirEndDay, dayLabel, type PlanInput,
} from "./planLogic";

/* Purchase Plan — horizontal candle chart.
   Row 1 is the current (enabled) stock stretched over the days it lasts; every purchase
   order below it lands where the layer above enters its safety stretch (hatched).
   Click a bar to type its units, drag a PO's end handle to resize it.
   Inputs come from SKU Detail; all maths lives in planLogic.ts. */

const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
const AXIS_CAP = 720; // widest the time axis can grow (days)

export default function PurchasePlanChart({ stock0, poUnits = 0, d0, r, LT, airLT, hasAir, S, anchor, t }: any) {
  const dark = t.mode === "dark";
  const P = dark
    ? { stock: "#a78bfa", stockTx: "#1e1b4b", po: "#8b5cf6", poTx: "#ffffff", tail: "#c4b5fd", air: "#ddd6fe", airTx: "#2e1065", wick: "#a78bfa" }
    : { stock: "#8b5cf6", stockTx: "#ffffff", po: "#6d28d9", poTx: "#ffffff", tail: "#8b5cf6", air: "#c4b5fd", airTx: "#2e1065", wick: "#5b21b6" };

  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [nOv, setNOv] = useState<number | null>(null);
  const [totOv, setTotOv] = useState<number | null>(null);
  const [man, setMan] = useState<number[]>([]);
  const [airOv, setAirOv] = useState<number | null>(null);
  const [follow, setFollow] = useState(true);
  const [tip, setTip] = useState<{ x: number; y: number; head: string; lines: string[] } | null>(null);
  const [edit, setEdit] = useState<{ kind: "po" | "air"; k: number; x: number; y: number; val: string } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<any>(null);
  const planRef = useRef<any>(null);
  const inpRef = useRef<any>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [boost, setBoost] = useState(0); // axis width while dragging past the right edge
  const [dragInfo, setDragInfo] = useState<{ day: number; cover: number; label: string } | null>(null);

  const rEff = follow ? r : 1;
  const inp: PlanInput = useMemo(() => ({ stock0, d0, r: rEff, LT, airLT, hasAir, S, poUnits }), [stock0, d0, rEff, LT, airLT, hasAir, S, poUnits]);
  const cum = useMemo(() => buildCum(d0, rEff), [d0, rEff]);
  const sys = useMemo(() => recommendTotal(inp, cum), [inp, cum]);

  const total = mode === "manual" ? man.reduce((a, b) => a + b, 0) : (totOv ?? sys);
  const nAuto = useMemo(() => autoShipmentCount(cum, total), [cum, total]);
  const n = mode === "manual" ? man.length : (nOv ?? nAuto);
  const units = mode === "manual" ? man : splitUnits(total, Math.max(1, n));
  const unitsKey = units.join(",");
  const plan = useMemo(() => planShipments(inp, units, cum, airOv), [inp, cum, unitsKey, airOv]);

  planRef.current = plan; inpRef.current = inp; // latest values for the drag timer
  const lastEnd = Math.max(plan.stockRow.tZero, plan.placed?.tZero ?? 0, ...plan.bars.map(b => b.tZero));
  const maxDay = Math.min(AXIS_CAP, Math.max(200, boost, Math.ceil(Math.min(lastEnd, PP_MAXH) + 10)));
  const W = 1000, padL = 78, padR = 64, plotW = W - padL - padR;
  const x = (d: number) => padL + Math.max(0, Math.min(d, maxDay)) / maxDay * plotW;
  const axisH = 30, rowH = 40;
  const pl = plan.placed;
  const rows = 1 + (pl ? 1 : 0) + (plan.air ? 1 : 0) + plan.bars.length;
  const H = axisH + rows * rowH + 10;
  const tickStep = maxDay > 400 ? 60 : 30;
  const ticks: number[] = []; for (let d = 0; d <= maxDay; d += tickStep) ticks.push(d);
  const trendPct = Math.round((r - 1) * 100);
  const dirty = mode === "manual" || totOv !== null || nOv !== null || airOv !== null;
  const sr = plan.stockRow;
  const flatDays = d0 > 0 ? Math.floor(stock0 / d0) : 0;

  function resetAll() { setMode("auto"); setTotOv(null); setNOv(null); setAirOv(null); setEdit(null); }
  function toManual() { setMan(units.slice()); setMode("manual"); }
  function toAuto() { setTotOv(total); setNOv(null); setMode("auto"); }
  function onTotal(raw: string) {
    const v = Math.max(0, Math.round(parseFloat(raw) || 0));
    if (mode === "manual") {
      const cur = man.reduce((a, b) => a + b, 0);
      if (cur > 0) {
        const sc = v / cur;
        const m = man.map(u => Math.round(u * sc));
        m[m.length - 1] = Math.max(0, m[m.length - 1] + (v - m.reduce((a, b) => a + b, 0)));
        setMan(m);
      } else setMan(splitUnits(v, Math.max(1, man.length)));
    } else setTotOv(v);
  }
  function onN(raw: string) {
    const v = Math.max(1, Math.min(8, Math.round(parseFloat(raw) || 1)));
    if (mode === "manual") setMan(splitUnits(total, v)); else setNOv(v);
  }
  function onAir(raw: string) {
    if (raw === "") { setAirOv(null); return; }
    setAirOv(Math.max(0, Math.round(parseFloat(raw) || 0)));
  }

  // ── drag a PO's end handle ──
  // k >= 0 → purchase order k, k = -2 → air bridge. Like trimming a clip: drag the white edge.
  function onDown(e: any, k: number, startDay: number, startOf: number, label: string) {
    e.preventDefault();
    setTip(null); setEdit(null);
    drag.current = { k, maxDay, units: units.slice(), startOf, label, vx: 0, edge: false, timer: null };
    // dragging into the right edge keeps widening the axis, like auto-scroll in a video editor
    drag.current.timer = window.setInterval(() => {
      const dg = drag.current; if (!dg || !dg.edge || dg.maxDay >= AXIS_CAP) return;
      dg.maxDay = Math.min(AXIS_CAP, dg.maxDay + 12);
      setBoost(dg.maxDay);
      applyDrag(dg.vx);
    }, 80);
    setDragInfo({ day: startDay, cover: Math.max(0, startDay - startOf), label });
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId); } catch (_) {}
  }
  function applyDrag(vx: number) {
    const dg = drag.current; if (!dg) return;
    const day = Math.max(0, Math.min(dg.maxDay, (vx - padL) / plotW * dg.maxDay));
    const dayR = Math.round(day);
    setDragInfo({ day: dayR, cover: Math.max(0, dayR - dg.startOf), label: dg.label });
    if (dg.k === -2) { setAirOv(unitsForAirEndDay(planRef.current, inpRef.current, day)); return; }
    const next = dg.units.slice();
    next[dg.k] = unitsForEndDay(planRef.current, inpRef.current, dg.units, dg.k, day);
    dg.units = next;
    setMan(next); setMode("manual");
  }
  function onMove(e: any) {
    const dg = drag.current; if (!dg || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const vx = (e.clientX - rect.left) / rect.width * W;
    dg.vx = vx;
    dg.edge = (vx - padL) / plotW > 0.93;
    applyDrag(vx);
  }
  function onUp() {
    if (drag.current?.timer) window.clearInterval(drag.current.timer);
    drag.current = null; setDragInfo(null); setBoost(0);
  }

  // ── themed tooltip + click-to-edit ──
  const rel = (e: any) => {
    const b = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };
  const tipOn = (head: string, lines: string[]) => ({
    onMouseMove: (e: any) => { if (!drag.current && !edit) setTip({ ...rel(e), head, lines }); },
    onMouseLeave: () => setTip(null),
  });
  function openEdit(e: any, kind: "po" | "air", k: number, cur: number) {
    if (drag.current) return;
    setTip(null);
    setEdit({ kind, k, ...rel(e), val: String(Math.round(cur)) });
  }
  function applyEdit() {
    if (!edit) return;
    const v = Math.max(0, Math.round(parseFloat(edit.val) || 0));
    if (edit.kind === "air") setAirOv(v);
    else { const next = units.slice(); next[edit.k] = v; setMan(next); setMode("manual"); }
    setEdit(null);
  }

  const seg = (on: boolean) => ({ height: 32, padding: "0 14px", border: `1px solid ${on ? P.po : t.border2}`, background: on ? P.po : "transparent", color: on ? "#fff" : t.text2, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" } as any);
  // purple outline = a value you set; plain = automatic
  const fld = (set: boolean, w = 88) => ({ width: w, background: t.bg, border: `1px solid ${set ? P.po : t.border2}`, borderRadius: 8, color: t.text, padding: "0 10px", fontSize: 14, fontWeight: 700, textAlign: "right", outline: "none", fontFamily: "inherit", height: 32 } as any);
  const fld0 = fld(false);
  const lbl = { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: t.text } as any;
  const rowLabel = { fontSize: 13, fontWeight: 600, fill: t.text, fontFamily: "inherit" } as any;
  const clickable = { cursor: "pointer" } as any;

  const stockDays = Math.max(0, sr.tZero);
  const gap = Math.max(0, sr.gapEnd - sr.gapStart);
  const wrapW = wrapRef.current?.clientWidth ?? 800;
  const wrapH = wrapRef.current?.clientHeight ?? 300;

  // Quick-decision facts, read straight off the plan
  const nextPo = plan.bars.find(b => b.units > 0) ?? plan.bars[0];
  const coveredTo = Math.max(sr.tZero, pl?.tZero ?? 0, ...plan.bars.filter(b => b.units > 0).map(b => b.tZero), plan.air?.tEnd ?? 0);
  const facts: { k: string; v: string; bad?: boolean }[] = [
    { k: "Stock lasts", v: `${stockDays}d · ${dayLabel(anchor, sr.tZero)}` },
    ...(pl ? [{ k: "Placed PO", v: `lands ${dayLabel(anchor, pl.arrival)} · lasts to ${dayLabel(anchor, pl.tZero)}` }] : []),
    ...(plan.air ? [{ k: "Air", v: `${fmt(plan.air.u)} u · lands ${dayLabel(anchor, plan.air.arrive)} · covers ${Math.max(0, plan.air.tEnd - plan.air.arrive)}d` }] : []),
    ...(nextPo && nextPo.units > 0 ? [{ k: "Next order", v: nextPo.late > 0 ? `today (${nextPo.late}d late) · lands ${dayLabel(anchor, nextPo.arrival)}` : `by ${dayLabel(anchor, nextPo.order)} · lands ${dayLabel(anchor, nextPo.arrival)}`, bad: nextPo.late > 0 }]
      : nextPo ? [{ k: "Next order", v: `by ${dayLabel(anchor, nextPo.order)} (lands ${dayLabel(anchor, nextPo.arrival)})` }] : []),
    { k: "Covered to", v: `${dayLabel(anchor, coveredTo)} (${coveredTo}d)` },
    ...(gap > 0 ? [{ k: "No stock", v: `${gap}d before the first landing`, bad: true }] : []),
  ];

  // Tips shown under the ⓘ button, grouped
  const infoSections: { h: string; items: string[] }[] = [
    { h: "This plan", items: [
      `Stock ${fmt(stock0)} u lasts ${stockDays} days${follow && trendPct !== 0 ? `, with the ${trendPct >= 0 ? "+" : ""}${trendPct}% trend (${flatDays}d at flat demand, the Days of Inventory basis)` : ""}.`,
      `Demand ${d0.toFixed(1)}/day · Sea ${LT}d${hasAir ? ` · Air ${airLT}d` : ""} · Safety ${S}d.`,
      ...(pl ? [`${fmt(pl.units)} u PO already placed, counted right after the stock.`] : []),
      ...(gap > 0 ? [`${gap} days with no stock before the first landing.`] : []),
    ] },
    { h: "Reading the bars", items: [
      `Solid part is cover you can sell. The hatched end is the last ${S} days, kept as safety.`,
      "The bold number after each bar is its total days of cover, safety included.",
      "Each order lands where the bar above it enters safety. The thin line before it is transit, with the order date above.",
      "The Air bar bridges the gap until sea lands.",
    ] },
    { h: "Editing", items: [
      "Click a bar to type its units.",
      "Drag a bar's white edge to extend or shorten it. Hold at the right edge to widen the timeline (up to 720 days).",
      "Stock and the placed PO are fixed here.",
      "Fields outlined in purple are values you set. The rest are automatic.",
    ] },
  ];

  // "62d" tag at the end of a bar: the bar's total cover in days, safety included
  const endTag = (xe: number, cy: number, days: number, extra: number) => (
    <text x={xe + extra} y={cy + 4} fontSize="12" fontWeight="700" fill={t.text} fontFamily="inherit" pointerEvents="none">{Math.max(0, Math.round(days))}d</text>
  );

  // White "trim" edge, like a clip handle in a video editor (hit area is wider than the pill)
  const trim = (cx: number, cy: number, down: (e: any) => void, hint: string) => (
    <g className="pp-trim" style={{ cursor: "ew-resize" }} onPointerDown={down} {...tipOn("Resize", [hint])}>
      <rect x={cx - 9} y={cy - 12} width="18" height="24" fill="transparent" />
      <rect x={cx - 3.5} y={cy - 9} width="7" height="18" rx="3.5" fill="#ffffff" stroke={P.po} strokeWidth="1.5" />
      <line x1={cx} x2={cx} y1={cy - 4} y2={cy + 4} stroke={P.po} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );

  // One rounded bar per layer: the safety stretch is the hatched end of the SAME bar (clipped inside it)
  const candle = (id: string, x0: number, xs: number, x1: number, cy: number, fill: string, o: any = {}) => {
    const w = Math.max(2, x1 - x0), hatchW = Math.max(0, x1 - xs), cid = `pp-c-${id}`;
    return (
      <g className={o.onClick ? "pp-bar" : undefined} style={o.onClick ? clickable : undefined} onClick={o.onClick} {...(o.tp || {})}>
        <clipPath id={cid}><rect x={x0} y={cy - 10} width={w} height="20" rx="5" /></clipPath>
        <g clipPath={`url(#${cid})`}>
          <rect x={x0} y={cy - 10} width={w} height="20" fill={fill} />
          {hatchW > 0.5 && <rect x={xs} y={cy - 10} width={hatchW} height="20" fill="url(#pp-hatch)" />}
          {hatchW > 0.5 && xs - x0 > 0.5 && <line x1={xs} x2={xs} y1={cy - 10} y2={cy + 10} stroke={P.tail} strokeWidth="1" opacity=".7" />}
        </g>
        <rect x={x0} y={cy - 10} width={w} height="20" rx="5" fill="none" stroke={o.stroke || P.tail} strokeWidth={o.dashed ? 1.5 : 1} strokeDasharray={o.dashed ? "4 3" : undefined} />
        {hatchW > 84 && (() => {
          const lab = `${S}d safety`, w2 = lab.length * 6.3 + 14;
          return (
            <g pointerEvents="none">
              {!o.safetyTx && <rect x={xs + 6} y={cy - 8} width={w2} height="16" rx="8" fill="rgba(18,12,48,.42)" />}
              <text x={xs + 13} y={cy + 4} fontSize="11" fontWeight="600" fill={o.safetyTx || P.poTx} fontFamily="inherit">{lab}</text>
            </g>
          );
        })()}
      </g>
    );
  };

  return (
    <div className="card" id="sec-purchase-plan" style={{ marginBottom: 10, overflow: "visible" }}>
      <div className="ch" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        Purchase Plan — shipment split
        <span style={{ position: "relative", display: "inline-flex" }}
          onMouseEnter={() => setInfoOpen(true)} onMouseLeave={() => setInfoOpen(false)}>
          <button type="button" aria-label="How to read this chart" aria-expanded={infoOpen}
            onClick={() => setInfoOpen(v => !v)} onFocus={() => setInfoOpen(true)} onBlur={() => setInfoOpen(false)}
            style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${t.border2}`, background: "transparent", color: t.text2, fontSize: 12, fontWeight: 700, fontStyle: "italic", fontFamily: "Georgia, serif", cursor: "help", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}>i</button>
          {infoOpen && (
            <div role="tooltip" style={{ position: "absolute", left: 0, top: 30, zIndex: 40, width: 400, maxWidth: "80vw", padding: "12px 14px", borderRadius: 10, background: t.tooltipBg, border: `1px solid ${t.border2}`, boxShadow: "0 10px 28px rgba(0,0,0,.32)", color: t.text, fontSize: 13, fontWeight: 400, lineHeight: 1.45, textAlign: "left" }}>
              {infoSections.map(sec => (
                <div key={sec.h} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: t.text }}>{sec.h}</div>
                  <ul style={{ margin: 0, paddingLeft: 16, color: t.text2 }}>
                    {sec.items.map((it, i) => <li key={i} style={{ marginBottom: 3 }}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </span>
      </div>
      {d0 <= 0 ? <div style={{ fontSize: 13, color: t.text3 }}>No demand data for this SKU, nothing to plan.</div> : <>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px", padding: "10px 14px", marginBottom: 12, background: t.surface2, border: `1px solid ${t.border}`, borderRadius: 10 }}>
          <label style={lbl} title="Units to buy by sea. Starts at the system recommendation; type a number to plan a different total.">
            Total to buy
            <input type="number" min={0} value={total} onChange={e => onTotal(e.target.value)} style={fld(mode === "manual" || totOv !== null)} />
          </label>
          <label style={lbl} title="Number of purchase orders. Auto picks about one per 90 days of cover.">
            Shipments
            <input type="number" min={1} max={8} value={n} onChange={e => onN(e.target.value)} style={fld(mode === "manual" || nOv !== null, 60)} />
          </label>
          {hasAir && (
            <label style={lbl} title="Units flown in to bridge the gap until sea lands. Type 0 for no air.">
              Air units
              <input type="number" min={0} value={airOv === null ? (plan.air?.u ?? 0) : airOv} onChange={e => onAir(e.target.value)} style={fld(airOv !== null)} />
            </label>
          )}
          <span style={{ width: 1, height: 22, background: t.border2 }} aria-hidden="true" />
          <div style={{ display: "inline-flex" }} role="group" aria-label="Split mode">
            <button type="button" onClick={mode === "manual" ? toAuto : undefined} style={{ ...seg(mode === "auto"), borderRadius: "999px 0 0 999px" }}>Auto</button>
            <button type="button" onClick={mode === "auto" ? toManual : undefined} style={{ ...seg(mode === "manual"), borderRadius: "0 999px 999px 0", borderLeftWidth: 0 }}>Manual</button>
          </div>
          <label style={{ ...lbl, cursor: "pointer" }} title="On: demand moves to the 7d/30d trend over 30 days. Off: flat demand, the same basis as Days of Inventory.">
            <input type="checkbox" checked={follow} onChange={e => setFollow(e.target.checked)} />
            Follow trend
          </label>
          {dirty && <button type="button" onClick={resetAll} title="Back to the system recommendation and auto split" style={{ marginLeft: "auto", height: 32, padding: "0 16px", fontSize: 13, fontWeight: 600, background: t.surface, border: `1px solid ${t.border2}`, borderRadius: 999, color: t.text, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit" }}>↺ Reset to system ({fmt(sys)})</button>}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {facts.map(f => (
            <span key={f.k} style={{ display: "inline-flex", gap: 8, alignItems: "baseline", padding: "5px 12px", borderRadius: 999, fontSize: 13, border: `1px solid ${f.bad ? t.redBdr : t.border2}`, background: f.bad ? t.redBg : t.surface, color: f.bad ? t.red : t.text }}>
              <span style={{ color: f.bad ? t.red : t.text3, fontWeight: 500 }}>{f.k}</span><strong style={{ fontWeight: 700 }}>{f.v}</strong>
            </span>
          ))}
        </div>
        <div ref={wrapRef} style={{ position: "relative" }}>
          <div style={{ overflowX: "auto" }}>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 640, display: "block", touchAction: "none" }} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} role="img" aria-label="Purchase plan: current stock and purchase orders over time">
              <defs>
                <pattern id="pp-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="6" height="6" fill={P.tail} opacity=".28" />
                  <line x1="0" y1="0" x2="0" y2="6" stroke={P.tail} strokeWidth="2.2" />
                </pattern>
              </defs>
              {ticks.map(d => (
                <g key={d}>
                  <line x1={x(d)} x2={x(d)} y1={axisH - 4} y2={axisH + rows * rowH} stroke={t.border} strokeWidth="1" opacity={d === 0 ? 1 : .6} />
                  <text x={x(d)} y={11} fontSize="11" fill={t.text3} textAnchor={d === 0 ? "start" : "middle"} fontFamily="inherit">{d === 0 ? "Today" : `${d}d`}</text>
                  <text x={x(d)} y={24} fontSize="10" fill={t.text3} opacity=".8" textAnchor={d === 0 ? "start" : "middle"} fontFamily="inherit">{dayLabel(anchor, d)}</text>
                </g>
              ))}

              {/* Row 1 — current stock */}
              {(() => {
                const cy = axisH + rowH / 2;
                const bodyW = x(sr.tSafe) - x(0), tailW = x(sr.tZero) - x(sr.tSafe);
                const tp = tipOn("Current stock", [
                  `${fmt(stock0)} units`,
                  `Lasts ${stockDays} days${follow && trendPct !== 0 ? ` (${flatDays}d at flat demand)` : ""}`,
                  `Runs out ${dayLabel(anchor, sr.tZero)}`,
                  `Safety stretch from ${dayLabel(anchor, sr.tSafe)}`,
                ]);
                return (
                  <g>
                    <text x={6} y={cy + 4} {...rowLabel}>Stock</text>
                    {sr.tZero > 0 && candle("stock", x(0), x(sr.tSafe), x(sr.tZero), cy, P.stock, { tp, safetyTx: P.stockTx })}
                    {bodyW > 70 && <text x={x(0) + 8} y={cy + 4} fontSize="11" fontWeight="600" fill={P.stockTx} fontFamily="inherit" pointerEvents="none">{fmt(stock0)} u</text>}
                    {sr.tZero > 0 && endTag(x(sr.tZero), cy, sr.tZero, 8)}
                    {gap > 0 && <>
                      <line x1={x(sr.gapStart)} x2={x(sr.gapEnd)} y1={cy} y2={cy} stroke={t.red} strokeWidth="2" strokeDasharray="4 3" />
                      <rect x={x(sr.gapStart)} y={cy - 10} width={Math.max(2, x(sr.gapEnd) - x(sr.gapStart))} height="20" fill="transparent" {...tipOn("No stock", [`${gap} days with nothing on the shelf`, `${dayLabel(anchor, sr.gapStart)} → ${dayLabel(anchor, sr.gapEnd)}`])} />
                      <text x={x(sr.gapStart) + 6} y={cy - 8} fontSize="10.5" fontWeight="600" fill={t.red} fontFamily="inherit" pointerEvents="none">no stock for {gap}d</text>
                    </>}
                  </g>
                );
              })()}

              {/* Already-placed PO (Include PO on) — first layer after current stock */}
              {pl && (() => {
                const cy = axisH + rowH + rowH / 2;
                const bodyW = x(pl.tSafe) - x(pl.arrival), tailW = x(pl.tZero) - x(pl.tSafe);
                const tp = tipOn(`PO placed · ${fmt(pl.units)} units`, [
                  "Already ordered (Purchased Units + open POs, Include PO is on)",
                  `Counted from ${dayLabel(anchor, pl.arrival)} — where current stock enters safety`,
                  `${Math.max(0, pl.tZero - pl.arrival)}d of cover, safety stretch from ${dayLabel(anchor, pl.tSafe)}`,
                ]);
                return (
                  <g>
                    <text x={6} y={cy + 4} {...rowLabel}>Placed</text>
                    {candle("placed", x(pl.arrival), x(pl.tSafe), x(pl.tZero), cy, P.po, { tp, dashed: true })}
                    {bodyW > 70 && <text x={x(pl.arrival) + 8} y={cy + 4} fontSize="11" fontWeight="600" fill={P.poTx} fontFamily="inherit" pointerEvents="none">{fmt(pl.units)} u placed</text>}
                    {endTag(x(pl.tZero), cy, pl.tZero - pl.arrival, 8)}
                  </g>
                );
              })()}

              {/* Air bridge */}
              {plan.air && (() => {
                const cy = axisH + (1 + (pl ? 1 : 0)) * rowH + rowH / 2, a = plan.air;
                const tp = tipOn("Air bridge", [
                  `${fmt(a.u)} units${airOv !== null ? " (set by you)" : ""}`,
                  `Order today, lands ${dayLabel(anchor, a.arrive)} (day ${a.arrive})`,
                  `Covers ${Math.max(0, a.tEnd - a.arrive)}d, runs out ${dayLabel(anchor, a.tEnd)} (sea lands ${dayLabel(anchor, a.until)})`,
                  "Click to edit units · drag the white edge to extend",
                ]);
                return (
                  <g>
                    <text x={6} y={cy + 4} {...rowLabel}>Air</text>
                    <line x1={x(0)} x2={x(a.arrive)} y1={cy} y2={cy} stroke={P.wick} strokeWidth="2" opacity=".6" />
                    <circle cx={x(0)} cy={cy} r="3.5" fill={P.wick} />
                    <text x={x(0) + 8} y={cy - 9} fontSize="10" fill={t.text3} fontFamily="inherit">order today</text>
                    <rect x={x(a.arrive)} y={cy - 10} width={Math.max(2, x(a.tEnd) - x(a.arrive))} height="20" rx="5" fill={P.air} stroke={P.po} strokeWidth="1" className="pp-bar" style={clickable} onClick={e => openEdit(e, "air", 0, a.u)} {...tp} />
                    <text x={x(a.arrive) + 6} y={cy + 4} fontSize="11" fontWeight="600" fill={P.airTx} fontFamily="inherit" pointerEvents="none">{fmt(a.u)} u</text>
                    {endTag(x(a.tEnd), cy, a.tEnd - a.arrive, 16)}
                    {trim(x(a.tEnd), cy, e => onDown(e, -2, a.tEnd, a.arrive, `Air · ${fmt(a.u)} u`), "Drag to extend the air bridge")}
                  </g>
                );
              })()}

              {/* Purchase orders */}
              {plan.bars.map((b, i) => {
                const ri = 1 + (pl ? 1 : 0) + (plan.air ? 1 : 0) + i, cy = axisH + ri * rowH + rowH / 2;
                const bodyW = x(b.tSafe) - x(b.arrival), tailW = x(b.tZero) - x(b.tSafe);
                const cover = Math.max(0, b.tZero - b.arrival);
                const tp = tipOn(`PO ${b.k + 1} · ${fmt(b.units)} units`, [
                  `Order ${dayLabel(anchor, b.order)} (day ${b.order})${b.late > 0 ? ` — ${b.late}d late` : ""}`,
                  `Lands ${dayLabel(anchor, b.arrival)} (day ${b.arrival})`,
                  `${cover}d of cover, safety stretch from ${dayLabel(anchor, b.tSafe)}`,
                  "Click to edit units · drag the handle to resize",
                ]);
                return (
                  <g key={b.k}>
                    <text x={6} y={cy + 4} {...rowLabel}>{`PO ${b.k + 1}`}</text>
                    <line x1={x(b.order)} x2={x(b.arrival)} y1={cy} y2={cy} stroke={P.wick} strokeWidth="2" opacity=".6" />
                    <circle cx={x(b.order)} cy={cy} r="3.5" fill={b.late > 0 ? t.red : P.wick} />
                    <text x={x(b.order) + 8} y={cy - 9} fontSize="10.5" fontWeight={b.late > 0 ? 600 : 400} fill={b.late > 0 ? t.red : t.text3} fontFamily="inherit">
                      {b.late > 0 ? `order ${b.late}d late${plan.air ? " — air bridges" : ""}` : `order ${dayLabel(anchor, b.order)}`}
                    </text>
                    {b.units > 0 && candle(`po${b.k}`, x(b.arrival), x(b.tSafe), x(b.tZero), cy, P.po, { tp, onClick: (e: any) => openEdit(e, "po", b.k, b.units) })}
                    {bodyW > 52 && <text x={x(b.arrival) + 8} y={cy + 4} fontSize="11" fontWeight="600" fill={P.poTx} fontFamily="inherit" pointerEvents="none">{fmt(b.units)} u</text>}
                    {b.units > 0 && endTag(x(b.tZero), cy, cover, 16)}
                    {trim(x(b.tZero), cy, e => onDown(e, b.k, b.tZero, b.arrival, `PO ${b.k + 1} · ${fmt(b.units)} u`), "Drag to extend or shorten this order")}
                  </g>
                );
              })}

              {dragInfo && (() => {
                const lx = x(dragInfo.day), txt = `${dayLabel(anchor, dragInfo.day)} · covers ${dragInfo.cover}d`;
                const pw = Math.max(110, txt.length * 6.4 + 18);
                const px = Math.max(padL, Math.min(lx - pw / 2, W - padR - pw));
                return (
                  <g pointerEvents="none">
                    <line x1={lx} x2={lx} y1={axisH - 4} y2={axisH + rows * rowH} stroke={t.text} strokeWidth="1.5" opacity=".85" />
                    <rect x={px} y={0} width={pw} height="20" rx="10" fill={t.text} />
                    <text x={px + pw / 2} y={14} fontSize="11" fontWeight="700" fill={t.bg} textAnchor="middle" fontFamily="inherit">{txt}</text>
                  </g>
                );
              })()}

            </svg>
          </div>

          {tip && !edit && (
            <div role="tooltip" style={{
              position: "absolute", left: Math.max(4, Math.min(tip.x + 14, wrapW - 270)), zIndex: 20, pointerEvents: "none",
              ...(tip.y > wrapH * 0.5 ? { top: tip.y - 14, transform: "translateY(-100%)" } : { top: tip.y + 16 }),
              maxWidth: 260, padding: "8px 10px", borderRadius: 8, background: t.tooltipBg, border: `1px solid ${t.border2}`,
              boxShadow: "0 6px 20px rgba(0,0,0,.28)", color: t.text, fontSize: 12, lineHeight: 1.4,
            }}>
              <div style={{ fontWeight: 700, marginBottom: 3 }}>{tip.head}</div>
              {tip.lines.map((l, i) => <div key={i} style={{ color: i === tip.lines.length - 1 && /^Click|^Drag/.test(l) ? t.text3 : t.text2 }}>{l}</div>)}
            </div>
          )}

          {edit && (
            <div style={{
              position: "absolute", left: Math.max(4, Math.min(edit.x - 20, wrapW - 330)),
              ...(edit.y > wrapH * 0.5 ? { top: edit.y - 12, transform: "translateY(-100%)" } : { top: edit.y + 12 }), zIndex: 30,
              padding: "10px 12px", borderRadius: 10, background: t.tooltipBg, border: `1px solid ${t.border2}`,
              boxShadow: "0 8px 24px rgba(0,0,0,.32)", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.text2 }}>{edit.kind === "air" ? "Air units" : `PO ${edit.k + 1} units`}</span>
              <input autoFocus type="number" min={0} value={edit.val}
                onChange={e => setEdit({ ...edit, val: e.target.value })}
                onKeyDown={e => { if (e.key === "Enter") applyEdit(); if (e.key === "Escape") setEdit(null); }}
                style={fld(true)} />
              <button type="button" onClick={applyEdit} style={{ height: 30, padding: "0 12px", borderRadius: 999, border: "none", background: P.po, color: "#fff", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Apply</button>
              <button type="button" onClick={() => setEdit(null)} aria-label="Cancel" style={{ background: "transparent", border: "none", color: t.text3, cursor: "pointer", fontSize: 14 }}>✕</button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: 10, fontSize: 12.5, color: t.text2 }}>
          {[
            ["current stock", { background: P.stock }],
            ["purchase order", { background: P.po }],
            ...(pl ? [["PO already placed", { background: P.po, border: `1.5px dashed ${P.tail}` }]] : []),
            ["safety stretch", { background: `repeating-linear-gradient(135deg, ${P.tail} 0 2px, transparent 2px 5px), ${P.po}`, opacity: .85 }],
            ...(hasAir ? [["air bridge", { background: P.air, border: `1px solid ${P.po}` }]] : []),
          ].map(([label, sw]: any) => (
            <span key={label} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 16, height: 10, borderRadius: 3, display: "inline-block", ...sw }} />{label}
            </span>
          ))}
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 7, height: 14, borderRadius: 4, background: "#fff", border: `1.5px solid ${P.po}`, display: "inline-block" }} />drag edge to extend
          </span>
        </div>
      </>}
    </div>
  );
}
