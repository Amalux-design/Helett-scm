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
html{height:100%;font-size:15px;overflow:hidden;background:${t.bg};color-scheme:${t.mode}}
body{height:100%;overflow:hidden;background:${t.bg};color:${t.text};font-family:${SANS};line-height:1.45;-webkit-font-smoothing:antialiased}
#fba-root{display:flex;height:100vh;width:100%;overflow:hidden;position:fixed;top:0;left:0;right:0;bottom:0;text-align:left}
.content,.topbar,.tb-title,.tb-sub,.ch,.card,.kc,h1,h2,h3,p,div{text-align:left}
:focus-visible{outline:2px solid ${t.focus};outline-offset:2px}
button,input,select,textarea{font-family:${SANS}}
::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}
::view-transition-old(root){z-index:1}
::view-transition-new(root){z-index:2}
.chart-skel{border-radius:8px;background:${t.surface2};opacity:.6}
.chart-reveal{animation:chartIn .7s cubic-bezier(.22,.8,.3,1) both;will-change:opacity,clip-path}
@keyframes chartIn{from{opacity:0;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 0 0 0)}}
@media(prefers-reduced-motion:reduce){.chart-reveal{animation:none}*,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}}

/* ── SIDEBAR (laptop: fixed 240px) ── */
.sb{position:fixed;top:0;left:0;bottom:0;z-index:80;width:260px;background:${t.sidebar};border-right:1px solid ${t.sbBorder};display:flex;flex-direction:column;overflow:hidden;transform:translateX(-100%);visibility:hidden;transition:transform .2s ease,visibility 0s .2s;box-shadow:none}
.sb.open{transform:translateX(0);visibility:visible;transition:transform .2s ease;box-shadow:8px 0 24px rgba(0,0,0,.25)}
.sb-bg{position:fixed;inset:0;z-index:70;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .2s}
.sb-bg.open{opacity:1;pointer-events:auto}
.tb-menu{width:44px;height:44px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:8px;border:1px solid ${t.border2};background:${t.surface};color:${t.text};font-size:18px;cursor:pointer}
.tb-menu:hover{background:${t.surface2}}
.sb-logo{padding:0 20px;height:64px;border-bottom:1px solid ${t.sbBorder};display:flex;align-items:center;gap:10px;flex-shrink:0}
.sb-icon{width:34px;height:34px;background:${t.accent};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${t.onInk}}
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
.tb-r .tb-btn{height:36px;padding:0 12px;font-size:13px;gap:6px}
.tb-r .tb-icon{width:36px;padding:0}
.srow .sbox,.srow .sel{height:36px;font-size:13px}
.srow .btn{height:36px;font-size:13px;border-radius:8px}
.srow .btn{padding:0 12px;gap:6px}
.srow .sbox input{font-size:13px}
.srow .sel{min-width:130px}
.tb-meta{font-size:13px;color:${t.text3};white-space:nowrap;margin-right:6px}

/* ── BADGES (24px, 8px radius, no dots, outline only) ── */
.badge{--bc:${t.text3};font-family:${SANS};display:inline-flex;align-items:center;gap:8px;height:26px;padding:0 12px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;border:0!important;background:color-mix(in srgb,var(--bc) 15%,${t.surface2})!important;color:${t.text}!important}
.badge::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--bc);flex-shrink:0}
.badge *{color:inherit!important;background:transparent!important}
.badge .dot{display:none}
.badge.nodot::before{display:none}
.badge .tg{color:var(--bc)!important;font-weight:700;letter-spacing:-1px}
.badge.bg{--bc:${t.green}}
.badge.br{--bc:${t.red}}
.badge.by,.badge.bpr{--bc:${t.orange}}
.badge.bgr{--bc:${t.text3}}
.badge.bb{--bc:${t.text2}}
.badge.solid{background:color-mix(in srgb,var(--bc) 22%,${t.surface2})!important}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block;flex-shrink:0}
.dot.r{background:${t.red}}.dot.y{background:${t.yellow}}.dot.g{background:${t.green}}.dot.b{background:${t.accent}}.dot.gr{background:${t.text3}}.dot.p{background:${t.orange}}
.br,.by,.bg,.bb,.bgr,.bpr{font-weight:500}

/* ── PANELS ── */
.card,.wsec,.fc-card,.sbar,.kc{background:${t.surface};border:1px solid ${t.border};border-radius:12px;min-width:0}
.card{padding:20px;overflow:hidden;width:100%}
.ch,.wh{font-size:16px;font-weight:600;color:${t.text};margin:-4px -4px 16px;padding:0 4px 12px;border-bottom:1px solid ${t.border}}
.kg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:16px;width:100%}
.kc{padding:16px 18px;position:relative;overflow:hidden}
.kg.kg5{grid-template-columns:repeat(5,minmax(0,1fr))}
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
.sbar-info{gap:8px}
.sbar-info label{gap:10px;min-height:36px;padding:0 14px 0 6px;border:0;background:${t.surface2};border-radius:999px;color:${t.text3};font-size:13px;font-weight:500;transition:background .12s,color .12s}
.sbar-info label:hover{background:color-mix(in srgb,${t.text} 8%,${t.surface2})}
.sbar-info label:has(input:checked){color:${t.text}}
.sbar-toggle{display:none}
input[type=range]{width:100%;max-width:100%;appearance:none;height:4px;background:${t.border2};border-radius:2px;outline-offset:6px;cursor:pointer;display:block}
input[type=range]::-webkit-slider-thumb{appearance:none;width:18px;height:18px;border-radius:50%;background:${t.accent};cursor:pointer;border:2px solid ${t.surface};box-shadow:0 0 0 1px ${t.accent}}
input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:${t.accent};cursor:pointer;border:2px solid ${t.surface}}
input[type=checkbox]{appearance:none;-webkit-appearance:none;flex-shrink:0;position:relative;width:36px;height:22px;border-radius:999px;background:${t.bg};border:1px solid ${t.border2};cursor:pointer;vertical-align:middle;transition:background .18s,border-color .18s;outline-offset:2px}
input[type=checkbox]::before{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:${t.text};transition:transform .18s,background .18s}
input[type=checkbox]:checked{background:${t.text};border-color:${t.text}}
input[type=checkbox]:checked::before{transform:translateX(14px);background:${t.bg}}
input[type=checkbox]:disabled{opacity:.45;cursor:not-allowed}
td input[type=checkbox],th input[type=checkbox]{appearance:none;-webkit-appearance:none;width:16px;height:16px;border-radius:4px;background:transparent;border:1.5px solid ${t.border2};box-shadow:none;transition:background .12s,border-color .12s}
td input[type=checkbox]::before,th input[type=checkbox]::before{display:none}
td input[type=checkbox]:hover,th input[type=checkbox]:hover{border-color:${t.text3}}
td input[type=checkbox]:checked,th input[type=checkbox]:checked{background:${t.accent} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M3.5 8.5l3 3 6-6.5' fill='none' stroke='${t.onInk.replace('#','%23')}' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/12px no-repeat;border-color:${t.accent}}

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
.cfm-wrap{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;padding:16px}
.cfm{width:100%;max-width:400px;background:${t.surface};color:${t.text};border:1px solid ${t.border2};border-radius:12px;padding:20px;box-shadow:0 12px 32px rgba(0,0,0,.28)}
.cfm-t{font-size:18px;font-weight:600;margin-bottom:8px}
.cfm-m{font-size:15px;line-height:1.5;color:${t.text2};margin-bottom:20px}
.cfm-b{display:flex;gap:8px;justify-content:flex-end}
@media(max-width:600px){
  th{font-size:11.5px!important;padding:0 8px!important;height:38px!important}
  td{font-size:12px!important;padding:0 8px!important;height:46px!important}
  td:not(:first-child){font-size:12px!important}
  td .badge,.badge{font-size:11px;height:22px;padding:0 6px}
  .tn{font-size:13px;max-width:150px}
  .ta{font-size:10.5px}
  .card{padding:14px}
  .ch,.wh{font-size:15px}
  .kc{padding:12px 14px}
  .kl{font-size:12.5px}
  .ks{font-size:11.5px}
  .sk,.sv{font-size:13px}
  .srow .btn,.srow .sbox,.srow .sel{font-size:13px}
  .tw input,.tw .sel-sm{font-size:12px!important}.cfm-wrap{align-items:flex-end;padding:0}.cfm{max-width:none;border-radius:12px 12px 0 0;border-bottom:0}.cfm-b .btn{flex:1}}
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
.ac{padding:16px 18px;background:${t.surface};border-radius:12px;border:1px solid ${t.border}}
.acl{font-size:14px;color:${t.text3};margin-bottom:8px;font-weight:500}
.acv{font-size:22px;font-weight:600;font-family:${MONO};letter-spacing:-.3px;line-height:1.1;font-variant-numeric:tabular-nums}
.acs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.d4 .kv,.acs .acv{font-size:22px;line-height:1.1}
.d4 .kl,.acs .acl{font-size:14px;margin-bottom:8px}
.d4 .kc{padding:16px 18px}
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
  .tab{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:0;background:transparent;color:${t.text3};font-size:11px;font-weight:500;cursor:pointer;padding:0 2px}
  .tab>span:last-child{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sbar-info label{flex:1 1 calc(50% - 12px)}
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
  .msheet-actions{display:flex;flex-direction:column;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid ${t.border}}
  .tb-r{display:none}
  .msheet-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .slg{padding:0 16px}
  .igrid{grid-template-columns:1fr}
  .d4{grid-template-columns:repeat(2,1fr)}
  .kg,.kg.kg5,.kg.kg6{grid-template-columns:repeat(2,minmax(0,1fr))}
  .kl,.ks{white-space:normal}
}
@media(max-width:600px){
  .sbar{padding:6px 12px}
  .sbar.m-open{padding:6px 16px 16px;position:static}
  .sbar-toggle{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;height:36px;border:0;background:transparent;color:${t.text2};font-size:13px;font-weight:500;cursor:pointer;border-radius:8px}
  .sbar-toggle:active{background:${t.surface2}}
  .sbar:not(.m-open) .sg,.sbar:not(.m-open) .sbar-info{display:none!important}
  .sbar.m-open .sg{margin-top:4px}.sg{grid-template-columns:1fr}.slg{padding:12px 0;border-right:none;border-bottom:1px solid ${t.border}}.slg:last-child{border-bottom:none}.kg{gap:8px}.kv{font-size:26px}.tb-title{font-size:20px}.d2{grid-template-columns:1fr}.acs{grid-template-columns:1fr}.adj-grid{grid-template-columns:1fr}.sbox input{width:100%}.sbox{flex:1 1 100%}}

${t.mode==="light"?`
body{-webkit-font-smoothing:auto;font-weight:450}
th{font-weight:700;color:${t.text2}}
td{font-weight:500}
td:not(:first-child){font-weight:500}
.ta,.tb-badge,.kl,.ks{font-weight:500;color:${t.text2}}
.kl{color:${t.text2}}
.btn,.tb-btn,.bk,.ni{font-weight:600}
.sel,.sbox input,input[type=number],input[type=text],input[type=search]{font-weight:500}
/* depth instead of outlines: layered soft shadows lift white surfaces off the canvas */
.card,.kc,.fc-card{box-shadow:0 1px 2px rgba(16,24,40,.04),0 4px 14px -6px rgba(16,24,40,.08)}
.sbar{box-shadow:0 1px 2px rgba(16,24,40,.05),0 10px 24px -10px rgba(16,24,40,.16)}
.tb-group,.btn,.tb-btn,.bk,.tb-menu{box-shadow:0 1px 2px rgba(16,24,40,.06)}
.tb-group .tb-btn{box-shadow:none}
.btn:hover,.tb-btn:hover,.bk:hover,.tb-menu:hover{box-shadow:0 1px 2px rgba(16,24,40,.08),0 3px 8px -3px rgba(16,24,40,.12)}
.tb-group .tb-btn:hover{box-shadow:none}
.bp,.bx,.tb-btn.pri{background:#0f172a;border-color:#0f172a;color:#fff;box-shadow:0 1px 2px rgba(15,23,42,.22)}
.bp:hover,.bx:hover{background:#1e293b;border-color:#1e293b;opacity:1}
.sbox,.sel,input[type=number],input[type=text],input[type=search]{background:#ffffff;border-color:${t.border2};box-shadow:0 1px 2px rgba(16,24,40,.05),inset 0 1px 1px rgba(16,24,40,.02)}
.sbox:focus-within,.sel:focus-visible,input[type=number]:focus,input[type=text]:focus,input[type=search]:focus{border-color:${t.focus};box-shadow:0 0 0 3px rgba(37,99,235,.14)}
.tw table thead th,th{background:#f7f8fb;border-bottom:1px solid ${t.border}}
tr:hover td{background:rgba(15,23,42,.03)}
.sbar-info label{background:#f1f4f9;box-shadow:inset 0 0 0 1px rgba(16,24,40,.04)}
.sbar-info label:hover{background:#e9edf4}
.badge{background:color-mix(in srgb,var(--bc) 14%,#f1f4f9)!important;box-shadow:none}
.badge.solid{background:color-mix(in srgb,var(--bc) 22%,#f1f4f9)!important}
input[type=checkbox]{background:#e6eaf1;border-color:#cbd3df;box-shadow:inset 0 1px 2px rgba(16,24,40,.08)}
input[type=checkbox]:checked{background:#0f172a;border-color:#0f172a;box-shadow:none}
.sel-menu{border-color:${t.border};box-shadow:0 14px 34px -10px rgba(16,24,40,.22),0 2px 6px rgba(16,24,40,.06)}
.cfm{border-color:${t.border};box-shadow:0 28px 64px -16px rgba(16,24,40,.34),0 2px 8px rgba(16,24,40,.08)}
.kc.r{border-color:${t.redBdr}}
`:""}

/* pill action buttons: compact height, one shape everywhere */
.btn,.tb-btn{border-radius:999px}
.tb-r .btn,.tb-r .tb-btn{height:34px;padding:0 16px;font-size:14px}
.tb-r .tb-icon{width:34px;padding:0}
.srow .btn{padding:0 14px;gap:6px;border-radius:8px}
.tb-btn.pri{background:${t.surface};color:${t.text};border-color:${t.border2}}
.tb-btn.pri:hover{background:${t.surface2};border-color:${t.text3};opacity:1}
.tb-btn.danger,.btn.bdl{background:${t.redBg};color:${t.red};border-color:${t.redBdr}}
.tb-btn.danger:hover,.btn.bdl:hover{background:${t.red};color:${t.onInk==="#f5f6f7"?"#fff":"#12161c"};border-color:${t.red}}

/* pill Back button + capsule action group in the top bar */
.bk{height:38px;border-radius:999px;padding:0 18px 0 6px;font-size:14px;gap:8px;margin-bottom:12px;border:0;background:${t.surface2};box-shadow:none}
.bk:hover{background:color-mix(in srgb,${t.text} 9%,${t.surface2});box-shadow:none}
.bk .bk-ar{width:26px;height:26px;border-radius:50%;background:${t.surface};display:inline-flex;align-items:center;justify-content:center;transition:transform .15s}
.bk:hover .bk-ar{transform:translateX(-2px)}
/* small "i" with a hover note */
.ii{position:relative;display:inline-flex;vertical-align:middle;margin-left:10px;outline:none}
.ii>i{width:20px;height:20px;border-radius:50%;background:${t.surface2};color:${t.text3};font:italic 700 12px Georgia,serif;display:inline-flex;align-items:center;justify-content:center;cursor:help}
.ii:hover>i,.ii:focus>i{background:color-mix(in srgb,${t.text} 10%,${t.surface2});color:${t.text}}
.ii>span{display:none;position:absolute;left:0;top:28px;z-index:30;width:max-content;max-width:260px;padding:8px 10px;border-radius:8px;background:${t.tooltipBg};border:1px solid ${t.border2};color:${t.text};font-size:12px;font-weight:400;line-height:1.4;box-shadow:0 8px 22px rgba(0,0,0,.28)}
.ii:hover>span,.ii:focus>span{display:block}
.kg.kg6{grid-template-columns:repeat(6,minmax(0,1fr))}
@media(max-width:1280px){.kg.kg6{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.kg.kg6{grid-template-columns:repeat(2,minmax(0,1fr))}}
.tb-group{display:inline-flex;align-items:center;height:36px;border:1px solid ${t.border2};border-radius:999px;background:${t.surface};overflow:hidden}
.tb-group .tb-btn,.tb-group .tb-btn.pri,.tb-group .tb-btn.danger{height:100%;border:0;border-radius:0;background:transparent;color:${t.text};padding:0 16px;font-size:14px;gap:7px;opacity:1}
.tb-group .tb-btn + .tb-btn{border-left:1px solid ${t.border}}
.tb-group .tb-btn:hover{background:${t.surface2}}
.tb-group .tb-btn.danger{color:${t.red}}
.tb-group .tb-btn.danger:hover{background:${t.redBg}}
.tb-group .tb-icon{width:42px;padding:0}

/* hover for every inline-styled button / icon button / switch / chart handle */
button[style]:not(:disabled):hover{background-image:linear-gradient(color-mix(in srgb,currentColor 12%,transparent),color-mix(in srgb,currentColor 12%,transparent))!important}
button[style]:not(:disabled):active{transform:translateY(.5px)}
.ic-btn{cursor:pointer;border-radius:6px;transition:background .12s,color .12s}
.ic-btn:hover{background:${t.surface2};color:${t.text}!important}
input[type=checkbox]:not(:disabled):hover{border-color:${t.text3}}
.pp-trim:hover{filter:drop-shadow(0 0 3px rgba(255,255,255,.85))}
.pp-bar{transition:filter .12s}
.pp-bar:hover{filter:brightness(1.14)}

/* dashboard grids + quiet list rows */
.dg{display:grid;gap:12px;margin-bottom:12px;min-width:0}
.dg.a{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}
.dg.b{grid-template-columns:repeat(3,minmax(0,1fr))}
.dg.c{grid-template-columns:repeat(2,minmax(0,1fr))}
.dash-row{transition:background .12s}
.dash-row:hover{background:${t.surface2}}
@media(max-width:1100px){.dg.a,.dg.b{grid-template-columns:minmax(0,1fr)}.dg.c{grid-template-columns:minmax(0,1fr)}}

/* responsive helpers: 3-up KPI rows, heatmap split, odd last card fills the row */
.d4.d3{grid-template-columns:repeat(3,minmax(0,1fr))}
.hm-grid{display:grid;grid-template-columns:340px minmax(0,1fr);gap:16px;align-items:stretch;min-width:0}
@media(max-width:900px){.hm-grid{grid-template-columns:minmax(0,1fr)}}
@media(max-width:1023px){
  .d4.d3{grid-template-columns:repeat(2,minmax(0,1fr))}
  .kg .kc:last-child:nth-child(odd),.d4 .kc:last-child:nth-child(odd){grid-column:1/-1}
}

/* phones: list rows stack (label + value, bar below) so names aren't squeezed */
@media(max-width:600px){
  .dash-row{grid-template-columns:minmax(0,1fr) auto!important;gap:6px 12px!important}
  .dash-row>div:nth-child(2){grid-column:1/-1;grid-row:2}
  .dash-row>div:nth-child(3){grid-column:2;grid-row:1}
}

/* data tables: SKU name gets a proportional column (ellipsis only when it truly overflows), the rest share the slack */
table.tight th,table.tight td{white-space:nowrap;padding-left:8px;padding-right:8px}
table.tight th:nth-child(2){width:24%;min-width:150px}
table.tight td:nth-child(2){width:24%;min-width:150px;max-width:0}
table.tight .badge{padding:0 10px;gap:6px}
table.tight td:nth-child(2) .tn,table.tight td:nth-child(2) .ta{display:block;max-width:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
table.tight th:nth-child(1),table.tight td:nth-child(1){width:28px;padding-left:12px;padding-right:4px}
/* DOI (11th) and Stockout (12th) reserve room for their "+ PO" labels so toggling Include PO never shifts the table */
table.tight th:nth-child(11),table.tight td:nth-child(11){min-width:88px}
table.tight th:nth-child(12),table.tight td:nth-child(12){min-width:110px}
/* toolbar buttons sit a touch shorter than the 36px inputs so the solid Export button doesn't read heavier */
.srow .btn{height:32px}
`;}
