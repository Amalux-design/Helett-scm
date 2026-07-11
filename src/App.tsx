import { useState, useEffect, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from "recharts";

/* ═══════════════════════════════════════════════════════════════
   SKU MAP
═══════════════════════════════════════════════════════════════ */
const SKU_MAP = {
 /* "B0H5R8L5LW":{"sellerSku":"HLT552 Portable Monitor Pro","HLT552 Portable Monitor Pro"},*/
  "B0GV4K1P7L":{"sellerSku":"HL96 Hair Dryer","finalName":"HL96 Hair Dryer"},
  "B0DZGPV245":{"sellerSku":"HE480 30C Pro Old","finalName":"HE480 30C Pro Old"},
  "B0GPCQ9KLN":{"sellerSku":"Logic View Monitor HLT550","finalName":"HLT550 Video Monitor"},
  "B0CPDPTHVN":{"sellerSku":"HT20 Barcode Scanner New","finalName":"HT20 Barcode Scanner New"},
  "B0C8JRN652":{"sellerSku":"UY16 UHF Wireless mic","finalName":"UY16 Wireless Mic"},
  "B0CN1153M4":{"sellerSku":"Helett HT35 Dual UHF Mic","finalName":"HT35 Dual UHF Mic"},
  "B0BRXX6HMR":{"sellerSku":"Wifi Dongle FBA","finalName":"Wifi Dongle FBA"},
  "B0G1YY4MJK":{"sellerSku":"Helett travel-Fi 4G","finalName":"travelfi 4G Hotspot"},
  "B0BYZVNPL4":{"sellerSku":"UNIY UY 35 Mini led Projector","finalName":"UY35 Mini Projector"},
  "B0C9CVWLL3":{"sellerSku":"Uniy S11 FBA","finalName":"Uniy S11 FBA"},
  "B0FLK7RSCV":{"sellerSku":"Helett HLT550 Portable Monitor","finalName":"HLT550 Portable Monitor"},
  "B0DL5PXZ65":{"sellerSku":"Helett H55C Thermal Label Printer","finalName":"H30c pro old (HE480)"},
  "B0FZSJRV5F":{"sellerSku":"Helett H65C Label Printer","finalName":"H65C Mini Printer (New Blue)"},
  "B0D4F7Y3NZ":{"sellerSku":"Helett H29 Wireless Drama Mic","finalName":"H29 Wireless Drama Mic"},
  "B0DKXD4N4R":{"sellerSku":"Helett A4L Pro Thermal Printer","finalName":"A4L Pro Thermal Printer"},
  "B0CN11FZW5":{"sellerSku":"T10 Projector FBA","finalName":"T10 Projector FBA"},
  "B0888WZ411":{"sellerSku":"Helett TV","finalName":"Helett TV"},
  "B0C8TW9ZR6":{"sellerSku":"I5-Z3IP-OQGJ","finalName":"I5-Z3IP-OQGJ"},
  "B0CL4GVKSN":{"sellerSku":"UNIY T10 Mini Projector","finalName":"T10 Mini Projector"},
  "B0BFRS5BLT":{"sellerSku":"UY8401 Smart Digital Door Lock FBA","finalName":"UY8401 Door Lock"},
  "B0CB1DDNV7":{"sellerSku":"UY20 Streaming mic","finalName":"UY20 Streaming Mic"},
  "B0CJVGCB4K":{"sellerSku":"H30c printer (White)","finalName":"H30c Printer (New)"},
  "B0CRB2KDC6":{"sellerSku":"HT320 Digital Door MFN","finalName":"HT320 Smart Lock"},
  "B01G46PYPO":{"sellerSku":"UC46 New Projector 12","finalName":"UC46 Projector 12"},
  "B0BZ8HF4WL":{"sellerSku":"UNIY UY410 Barcode Scanner","finalName":"UY410 Barcode Scanner"},
  "B07TW7QMBN":{"sellerSku":"YUNTAB 3G Tablet","finalName":"YUNTAB 3G Tablet"},
  "B07TD94GPJ":{"sellerSku":"Proscan PLT8990-K","finalName":"Proscan PLT8990-K"},
  "B0BFFW365Y":{"sellerSku":"UNIY UY610 Smart Door Lock FBA","finalName":"UY610 Door Lock"},
  "B0BPHT9WY9":{"sellerSku":"UY40 Projector FBA","finalName":"UY40 Projector"},
  "B0CLYLNCZD":{"sellerSku":"810 App Door Lock FBA","finalName":"810 App Door Lock"},
  "B0CFHRLWM2":{"sellerSku":"helett HT 75W car power inverter","finalName":"HT 75W Power Inverter"},
  "B0B5VQYGW6":{"sellerSku":"UNIY Smart Life Security Camera","finalName":"Smart Life Camera"},
  "B0CQ24C7DX":{"sellerSku":"V0-FM48-RT2B","finalName":"V0-FM48-RT2B"},
  "B0DGF32QRT":{"sellerSku":"Helett AC1200 Dual Band Wifi Router","finalName":"AC1200 Wifi Router"},
  "B0DD7LH58C":{"sellerSku":"Helett JH1200","finalName":"Helett JH1200"},
  "B0FZL52KY4":{"sellerSku":"Helett infiStick Tv Stick","finalName":"infiStick TV Stick"},
  "B0CQTJH6WX":{"sellerSku":"Car-Jumper-Black","finalName":"Car Jumper Black"},
  "B0D39NNN57":{"sellerSku":"Helett HT15 wired desktop scanner","finalName":"HT15 Wired Scanner"},
  "B0D4F12NJT":{"sellerSku":"Uniy U01 Rfid Card","finalName":"U01 RFID Card"},
  "B0CD7YNMRM":{"sellerSku":"XP-H1UH-2R9U","finalName":"XP-H1UH-2R9U"},
  "B07QLRJGDJ":{"sellerSku":"4 UC46 Projector","finalName":"UC46 Projector (4)"},
  "B0DXKWKBWQ":{"sellerSku":"Helett 2x1.5 Thermal Label","finalName":"65C Label Roll"},
  "B0CHFQPZMK":{"sellerSku":"helett HT200 Soundbar","finalName":"HT200 Soundbar"},
  "B0CB8YRRZ4":{"sellerSku":"helett HU1 kids GPS Tracking watch","finalName":"HU1 GPS Kids Watch"},
  "B0CBC9G7W2":{"sellerSku":"HT410 wired Barcode scanner FBA","finalName":"HT410 Barcode (Blue)"},
  "B0DLKM4N5G":{"sellerSku":"Helett Z567 Tyre Inflator","finalName":"Z567 Tyre Inflator"},
  "B0DGGPBX97":{"sellerSku":"Helett travel-Fi 4g Hotspot","finalName":"travelFi 4G Hotspot v2"},
  "B0DPCRLRNJ":{"sellerSku":"HT20pro Wirelss Barcode Scanner","finalName":"HT20 Pro Barcode"},
  "B0CQNM753Q":{"sellerSku":"Helett H92i Android Tv Stick","finalName":"H92i Android TV Stick"},
  "B0C72FSCFM":{"sellerSku":"U19 wireless Training Mic","finalName":"U19 Training Mic"},
  "B0F1KF6P4J":{"sellerSku":"Helett HT-M318 Desktop Barcode Scanner","finalName":"HT-M318 Desktop Scanner"},
  "B07XP99KF8":{"sellerSku":"UC46 0 Projector","finalName":"UC46 Projector (0)"},
  "B0CXPX968F":{"sellerSku":"H89i","finalName":"H89i"},
  "B0C999P5KB":{"sellerSku":"HT210 galaxy projector kid","finalName":"HT210 Galaxy Projector"},
  "B09FGVPBHK":{"sellerSku":"Led Projector","finalName":"LED Projector"},
  "B0BPPNNVT5":{"sellerSku":"UNIY UY (310) 4G Wi-Fi Hotspot Dongle","finalName":"UY310 4G Hotspot"},
  "B0DXC17SSS":{"sellerSku":"HE24 Thermal Label 15x30","finalName":"HE24 Label 15x30"},
  "B0BDFLDDKR":{"sellerSku":"UNIY UY8300 FBA","finalName":"UY8300 FBA"},
  "B0BJC4WGDK":{"sellerSku":"UY 12 UHF Dual wireless MIC","finalName":"UY12 Dual Wireless Mic"},
  "B0CBXG8CLB":{"sellerSku":"HT210 Door lock","finalName":"HT210 Door Lock"},
  "B084TQMCLN":{"sellerSku":"UC 200 Projector","finalName":"UC200 Projector"},
  "B016DGF0ZY":{"sellerSku":"UNIC UC40 Projector 1080p","finalName":"UC40 Projector 1080p"},
  "B0BLNLYVFQ":{"sellerSku":"G5-MA5V-WDTH","finalName":"G5-MA5V-WDTH"},
  "B0DD6WNP26":{"sellerSku":"Helett HW10 wifi extender","finalName":"HW10 Wifi Extender"},
  "B08LQ1G624":{"sellerSku":"UC46 projector","finalName":"UC46 Projector"},
  "B0DPJ8BWCG":{"sellerSku":"Helett H92 TV Stick","finalName":"H92 TV Stick"},
  "B0CXN44J7J":{"sellerSku":"helett H58i Bluetooth Printer FBA","finalName":"H58i Mini Printer"},
  "B0CNLW386T":{"sellerSku":"Helett HT15 wired Barcode Scanner FBA","finalName":"HT15 Wired Scanner FBA"},
  "B0D9LS2P2F":{"sellerSku":"Helett HL96 Hair Dryer FBA","finalName":"HL96 Hair Dryer"},
  "B0DW8DX2M9":{"sellerSku":"Helett H30CLite Printer","finalName":"H30C Lite Printer"},
  "B013JYPTA4":{"sellerSku":"UC 40+ Projector 1325","finalName":"UC40+ Projector"},
  "B0BRKVYG8X":{"sellerSku":"2D-B2X1-4D6F","finalName":"2D-B2X1-4D6F"},
  "B07TB4DZTK":{"sellerSku":"RD-801 Projector","finalName":"RD-801 Projector"},
  "B0FSSL1Q2X":{"sellerSku":"Helett H30C Printer New FBA","finalName":"H30C Printer (Old)"},
  "B0F8QKDJN3":{"sellerSku":"Helett Ht15e Desktop Barcode Scanner FBA","finalName":"HT15E Scanner"},
  "B0DJK3GNCY":{"sellerSku":"helett WS5","finalName":"Helett WS5"},
  "B01DYJ8R4O":{"sellerSku":"UNIC UC30 PROJECTOR","finalName":"UC30 Projector"},
  "B0DW8PCP6D":{"sellerSku":"Helett 4x6 Thermal Label","finalName":"4x6 Thermal Label"},
  "B0D9KKFVT6":{"sellerSku":"UNIY UY720 Smart Door Lock FBA","finalName":"UY720 Door Lock"},
  "B0BL3LJHRB":{"sellerSku":"UY46 old","finalName":"UY46 (Old)"},
  "B08FC23JD7":{"sellerSku":"UC20 projector","finalName":"UC20 Projector"},
  "B0CZ99K438":{"sellerSku":"H80i Autocut Thermal Printer","finalName":"H80i Autocut Printer"},
  "B07T2VZMSG":{"sellerSku":"HTPHT580BLACK","finalName":"HTPHT580 Black"},
  "B0DDL3TR1L":{"sellerSku":"helett HE24 Label Printer","finalName":"HE24 Mini Printer"},
  "B0D9KJJ7WF":{"sellerSku":"D8-ZNA6-NT4M","finalName":"D8-ZNA6-NT4M"},
  "B07FDG8GQT":{"sellerSku":"1UC46Projector","finalName":"UC46 Projector (1)"},
  "B01H35Y352":{"sellerSku":"UC 30 Project 3","finalName":"UC30 Project 3"},
  "B07MK547MK":{"sellerSku":"UC46 90","finalName":"UC46 (90)"},
  "B0GSZRF4M5":{"sellerSku":"Helett Z567 Tyre Inflator NEW","finalName":"Z567 Tyre Inflator NEW"},
  "B0C3HZDJ5C":{"sellerSku":"ZT-NKSW-TLDE","finalName":"ZT-NKSW-TLDE"},
  "B0FL2VFCT9":{"sellerSku":"HE24 Thermal Label 12x50","finalName":"HE24 Label Roll 12x50"},
  "B0C96F68YL":{"sellerSku":"helett HT8400 car power inverter","finalName":"HT8400 Power Inverter"},
  "B0D1P7SC46":{"sellerSku":"Helett H65C 2in1 Thermal Printer","finalName":"H65C 2in1 Printer"},
  "B0BRXVQ85M":{"sellerSku":"UNIY UY20+ Mini Led projector","finalName":"UY20+ Mini Projector"},
  "B0DTNVQ34H":{"sellerSku":"HE24 Label Tape","finalName":"HE24 Label Tape 12x30"},
  "B0FLV3V1W4":{"sellerSku":"Helett H65Clite Printer","finalName":"H65C Lite Printer"},
  "B0FZSCW83R":{"sellerSku":"Helett H75C Printer","finalName":"H65C Mini Printer (New)"},
  "B0BD9191XX":{"sellerSku":"UY400 mini Led Projector","finalName":"UY400 Mini Projector"},
  "B0FGCT1MWB":{"sellerSku":"Helett Ht15 Desktop Barcode Scanner","finalName":"HT15 Desktop Scanner"},
  "B0DQGSMG4N":{"sellerSku":"Helett Label Paper 4x6","finalName":"Label Paper 4x6"},
  "B091TCSG4D":{"sellerSku":"UNIY UY200","finalName":"UNIY UY200"},
  "B0CR75SMCQ":{"sellerSku":"H41","finalName":"H41 Cabinet Lock"},
  "B07T85LWH7":{"sellerSku":"Yuntab 7 inch 3G Unlocked","finalName":"Yuntab 7\" 3G"},
  "B09TY1SZP6":{"sellerSku":"New UY46 FBA","finalName":"UY46 (New)"},
  "B0DTQ3ZCBH":{"sellerSku":"HE24 Thermal Label Tape","finalName":"HE24 Label 15x50"},
  "B0DRL8ZDWX":{"sellerSku":"Helett H30C Lite Printer","finalName":"H30C Lite Printer v2"},
  "B086ZFW6HD":{"sellerSku":"FILPO Soap Dispenser","finalName":"FILPO Soap Dispenser"},
  "B0BJMLX4RR":{"sellerSku":"UY10 Wired Mic","finalName":"UY10 Wired Mic"},
  "B0CQTK12SW":{"sellerSku":"Rice-Cooker-Black","finalName":"Rice Cooker Black"},
  "B0DQGQY98X":{"sellerSku":"Helett HE760 Mobile Printer","finalName":"HE760 Mobile Printer"},
  "B09K4M1JSN":{"sellerSku":"UNIY UY 46 Projector","finalName":"UY46 Projector"},
  "B0D9T8R3W8":{"sellerSku":"Helett H01 Label Holder FBA","finalName":"H01 Label Holder"},
  "B09TWLRXZ3":{"sellerSku":"UNIY A1 128 GB SdCard","finalName":"A1 128GB SD Card"},
  "B0FKZPDH66":{"sellerSku":"Helett H30C Pro Printer","finalName":"H30C Pro (Aiyin)"},
  "B07Q5PC3SV":{"sellerSku":"UC 40+ Projector","finalName":"UC40+ Projector v2"},
  "B0F6MXY655":{"sellerSku":"HT20proL Wirelss Barcode Scanner MFN","finalName":"HT20proL Scanner MFN"},
  "B0BRN9ZGL1":{"sellerSku":"UY-TTH9-BCAS","finalName":"UY-TTH9-BCAS"},
  "B0BLV54ZQK":{"sellerSku":"UY 14 UHF Wireless MIC","finalName":"UY14 Wireless Mic"},
  "B0CC8ZFPRX":{"sellerSku":"HT510 Barcode Scanner","finalName":"HT510 Scanner"},
  "B0DD7RS56N":{"sellerSku":"Helett Z567 Tyre Inflator FBA","finalName":"Z567 Tyre Inflator FBA"},
  "B0CB8X5RCN":{"sellerSku":"UNIY UY85 kids smart watch","finalName":"UY85 Kids Smart Watch"},
  "B0C8NNB48Z":{"sellerSku":"UY510 Barcode Scanner","finalName":"UY510 Scanner"},
  "B08PSLZYZV":{"sellerSku":"UC20 mini projector","finalName":"UC20 Mini Projector"},
  "B0DBCW1PS4":{"sellerSku":"UNIY UY720 Smartdoor Lock FBA","finalName":"UY720 Door Lock v2"},
  "B0CQM5THV3":{"sellerSku":"ECO- D3-BT","finalName":"BT Soundbar"},
  "B0GDKY6QHN":{"sellerSku":"Helett infiStick android stick","finalName":"infiStick Android"},
  "B0FGTMFZFM":{"sellerSku":"MO-DT5V-SO2M","finalName":"MO-DT5V-SO2M"},
  "B0DGCG6MN4":{"sellerSku":"Helett HE760 Receipt Printer FBA","finalName":"HE760 Receipt Printer"},
  "B0CR7JGRYJ":{"sellerSku":"SKU: OFFICE_LOCK_BLACK_30-100","finalName":"Office Lock Black"},
  "B0FHQSL9DH":{"sellerSku":"Helett H30CPro Printer","finalName":"H30C Pro Printer"},
  "B0CMMMJ5WY":{"sellerSku":"Helett HT35 Dual microphone","finalName":"HT35 Dual Mic"},
  "B0GYSTLWT3":{"sellerSku":"Helett H30CLite BT Printer FBA","finalName":"Helett H30CLite BT"},
  "B0GYSMFZC1":{"sellerSku":"HT410 Lite wired Barcode scanner FBA","finalName":"HT410 Lite wired Barcode scanner"},
  "B0H5X3VCM5":{"sellerSku":"H58i BillQuick Go","finalName":"H58i BillQuick Go"},
  "B0F5Q4RV2R":{"sellerSku":"HT20 Lite Barcode Scanner","finalName":"HT20 Lite Barcode Scanner"},
  "B0H1HP2K4L":{"sellerSku":"Helett 4x6 Thermal Label (400)","finalName":"Helett 4x6 Thermal Label (400)"},
  "B0H5R8L5LW":{"sellerSku":"HLT552 Portable Monitor Pro","finalName":"Portable Monitor Pro "},
  "B0H6QGN526":{"sellerSku":"2x1 Label Roll","finalName":"2x1 Label Roll"},
};

/* ═══════════════════════════════════════════════════════════════
   SKU CONFIG
═══════════════════════════════════════════════════════════════ */
const DEFAULT_SKU_CONFIG = {
  "B0D39NNN57": { active: false, note: "Not in use currently", category: "Paused" },
};
function loadSkuConfig() {
  try {
    const saved = localStorage.getItem("fba_sku_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = { ...parsed };
      Object.keys(DEFAULT_SKU_CONFIG).forEach(asin => {
        if (merged[asin] === undefined) merged[asin] = { ...DEFAULT_SKU_CONFIG[asin] };
      });
      return merged;
    }
  } catch(_) {}
  return { ...DEFAULT_SKU_CONFIG };
}
function saveSkuConfig(cfg) {
  try { localStorage.setItem("fba_sku_config", JSON.stringify(cfg)); } catch(_) {}
}
function isActive(cfg, asin) {
  return cfg[asin] === undefined || cfg[asin].active !== false;
}

/* ═══════════════════════════════════════════════════════════════
   FC CITY MAPPING
═══════════════════════════════════════════════════════════════ */
const FC_CITY = {
  AMD2:"Ahmedabad", BLR4:"Bangalore", BLR5:"Bangalore", BLR7:"Bangalore", BLR8:"Bangalore",
  BOM5:"Mumbai", BOM7:"Mumbai", CCX1:"West Bengal", CCX2:"West Bengal", CJB1:"Coimbatore",
  DED4:"Haryana", DEL4:"Haryana", DEL5:"Haryana", DEX3:"Delhi", HYD3:"Hyderabad", HYD8:"Hyderabad",
  LKO1:"Lucknow", MAA4:"Chennai", PAX1:"Patna, Bihar", PNQ2:"Pune", PNQ3:"Pune", SBLL:"Hubballi, Karnataka"
};
function fcLabel(code) {
  return FC_CITY[code] ? `${code} (${FC_CITY[code]})` : code;
}

/* ═══════════════════════════════════════════════════════════════
   FC → REGION MAPPING (for stock heatmap)
═══════════════════════════════════════════════════════════════ */
const FC_REGION = {
  AMD2:"West",  BLR4:"South", BLR5:"South", BLR7:"South",  BLR8:"South",
  BOM5:"West",  BOM7:"West",  CCX1:"East",  CCX2:"East",   CJB1:"South",
  DED4:"North", DEL4:"North", DEL5:"North", DEX3:"North",  HYD3:"South", HYD8:"South",
  LKO1:"North", MAA4:"South", PAX1:"East",  PNQ2:"West",   PNQ3:"West",  SBLL:"South"
};

/* ═══════════════════════════════════════════════════════════════
   STATE → REGION MAPPING
   Handles full names + 2-letter ISO codes + Amazon's abbrevs
═══════════════════════════════════════════════════════════════ */
const STATE_TO_REGION = {
  // ── North ──
  "DELHI":"North","NCT OF DELHI":"North","NEW DELHI":"North","DL":"North",
  "HARYANA":"North","HR":"North",
  "HIMACHAL PRADESH":"North","HP":"North",
  "JAMMU AND KASHMIR":"North","JAMMU & KASHMIR":"North","JK":"North",
  "LADAKH":"North","LA":"North",
  "PUNJAB":"North","PB":"North",
  "RAJASTHAN":"North","RJ":"North",
  "UTTARAKHAND":"North","UTTARANCHAL":"North","UK":"North","UT":"North",
  "UTTAR PRADESH":"North","UP":"North",
  "CHANDIGARH":"North","CH":"North",
  // ── South ──
  "ANDHRA PRADESH":"South","AP":"South","A P":"South",
  "KARNATAKA":"South","KA":"South",
  "KERALA":"South","KL":"South",
  "TAMIL NADU":"South","TN":"South",
  "TELANGANA":"South","TELANGANA STATE":"South","TG":"South","TS":"South",
  "PUDUCHERRY":"South","PONDICHERRY":"South","PY":"South",
  "ANDAMAN AND NICOBAR ISLANDS":"South","ANDAMAN & NICOBAR ISLANDS":"South","ANDAMAN & NICOBAR":"South","AN":"South",
  "LAKSHADWEEP":"South","LD":"South",
  // ── East ──
  "BIHAR":"East","BR":"East",
  "JHARKHAND":"East","JH":"East",
  "ODISHA":"East","ORISSA":"East","OR":"East","OD":"East",
  "WEST BENGAL":"East","WB":"East",
  "ASSAM":"East","AS":"East",
  "MANIPUR":"East","MN":"East",
  "MEGHALAYA":"East","ML":"East",
  "MIZORAM":"East","MZ":"East",
  "NAGALAND":"East","NL":"East",
  "SIKKIM":"East","SK":"East",
  "TRIPURA":"East","TR":"East",
  "ARUNACHAL PRADESH":"East","AR":"East",
  // ── West ──
  "GOA":"West","GA":"West",
  "GUJARAT":"West","GJ":"West",
  "MAHARASHTRA":"West","MH":"West",
  "DADRA AND NAGAR HAVELI":"West","DADRA & NAGAR HAVELI":"West",
  "DADRA AND NAGAR HAVELI AND DAMAN AND DIU":"West","DN":"West",
  "DAMAN AND DIU":"West","DAMAN & DIU":"West","DD":"West",
  // ── Central ──
  "CHHATTISGARH":"Central","CT":"Central","CG":"Central",
  "MADHYA PRADESH":"Central","MP":"Central",
};

/* ═══════════════════════════════════════════════════════════════
   UNSELLABLE DISPOSITIONS
═══════════════════════════════════════════════════════════════ */
const UNSELLABLE_DISPOSITIONS = new Set(["CUSTOMER_DAMAGED","CARRIER_DAMAGED","WAREHOUSE_DAMAGED","DEFECTIVE","DISTRIBUTOR_DAMAGED"]);

/* ═══════════════════════════════════════════════════════════════
   DATE HELPERS
═══════════════════════════════════════════════════════════════ */
function getToday() { const d = new Date(); d.setHours(0,0,0,0); return d; }
function localKey(d) {
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}

/* ═══════════════════════════════════════════════════════════════
   FORMATTERS
═══════════════════════════════════════════════════════════════ */
function fmt(n, dec=0) {
  if (n===null||n===undefined||isNaN(n)||!isFinite(n)) return "—";
  return Number(n).toLocaleString("en-IN",{maximumFractionDigits:dec,minimumFractionDigits:dec});
}
function fmtDate(d) {
  if (!d) return "—";
  return d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
}
function extractSheetId(url) {
  const m = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

/* ═══════════════════════════════════════════════════════════════
   PAPAPARSE
═══════════════════════════════════════════════════════════════ */
function loadPapa() {
  return new Promise((res,rej)=>{
    if (window.Papa){res();return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js";
    s.onload=res; s.onerror=()=>rej(new Error("PapaParse load failed"));
    document.head.appendChild(s);
  });
}
function parseCSV(text) {
  return loadPapa().then(()=>new Promise((res,rej)=>{
    const clean = text.charCodeAt(0)===0xFEFF ? text.slice(1) : text;
    window.Papa.parse(clean,{
      header:true, skipEmptyLines:true,
      transformHeader: h => h.trim(),
      transform: (v) => typeof v==="string" ? v.trim() : v,
      complete: r => res(r.data),
      error: e => rej(e),
    });
  }));
}
function makeGet(rows) {
  if (!rows||!rows.length) return ()=>"";
  const map = {};
  Object.keys(rows[0]).forEach(k => { map[k.toLowerCase()] = k; });
  return function(row, ...names) {
    for (const name of names) {
      const v1 = row[name];
      if (v1 !== undefined && v1 !== null && v1 !== "") return v1;
      const k2 = map[name.toLowerCase()];
      if (k2) { const v2 = row[k2]; if (v2 !== undefined && v2 !== null && v2 !== "") return v2; }
    }
    return "";
  };
}
function n(row, get, ...names) {
  const v = get(row, ...names);
  const f = parseFloat(v);
  return isNaN(f) ? 0 : Math.max(0, f);
}
function s(row, get, ...names) {
  return String(get(row, ...names)||"").trim();
}

/* ═══════════════════════════════════════════════════════════════
   INVENTORY PROCESSOR
═══════════════════════════════════════════════════════════════ */
function buildFcTransferMap(fbaInvRows) {
  const map={};
  if (!fbaInvRows||!fbaInvRows.length) return map;
  const get=makeGet(fbaInvRows);
  fbaInvRows.forEach(r=>{
    const asin = s(r,get,"asin","ASIN");
    if (!asin) return;
    map[asin] = n(r,get,"fc-transfer","fc transfer","fc_transfer","FC Transfer","FCTransfer");
  });
  return map;
}
function processInventory(rows, fbaInvRows) {
  const inv={}, warnings=[];
  if (!rows||!rows.length) return {inv,warnings};
  const get=makeGet(rows);
  const fctMap = buildFcTransferMap(fbaInvRows);
  rows.forEach((r,i)=>{
    const asin = s(r,get,"ASIN","asin");
    if (!asin) return;
    if (!SKU_MAP[asin]){
      warnings.push({type:"unmapped_inventory",asin,row:i+2,context:s(r,get,"SKU","sku")});
      return;
    }
    const csvSku = s(r,get,"SKU","sku");
    const mapSku = SKU_MAP[asin].sellerSku;
    if (csvSku&&mapSku&&csvSku.toLowerCase()!==mapSku.toLowerCase())
      warnings.push({type:"sku_mismatch_inv",asin,csvSku,mapSku,row:i+2});
    const fc   = n(r,get,"FC Sellable","fc sellable","FCsellable");
    const fba  = n(r,get,"FBA Available","fba available","FBAAvailable");
    const fcU  = n(r,get,"FC Unsellable","fc unsellable");
    const fbaU = n(r,get,"FBA Unsellable","fba unsellable");
    const inb  = n(r,get,"Inbound","inbound");
    const proc = n(r,get,"Processing","processing");
    const fctOld = n(r,get,"FC Transfer","fc transfer","FCTransfer");
    const fct  = (fctMap[asin]!==undefined) ? fctMap[asin] : fctOld;
    const onh  = n(r,get,"On Hand","on hand","OnHand") || (fba + fct);
    const cost = n(r,get,"Unit Cost (₹)","Unit Cost","unit cost");
    inv[asin]={
      asin, csvSku, finalName:SKU_MAP[asin].finalName, sellerSku:SKU_MAP[asin].sellerSku,
      fcSellable:fc, fcUnsellable:fcU, fbaAvailable:fba, fbaUnsellable:fbaU,
      inbound:inb, processing:proc, fcTransfer:fct, onHand:onh,
      currentStock: onh + fc + inb,
      unitCost:cost,
      statusFlags: s(r,get,"Status Flags","StatusFlags","status flags"),
    };
  });
  return {inv,warnings};
}

/* ═══════════════════════════════════════════════════════════════
   CITY NORMALIZER
═══════════════════════════════════════════════════════════════ */
const CITY_ALIAS = {
  "BENGALURU":"BANGALORE","BENGALORE":"BANGALORE","BANGLAORE":"BANGALORE","BANGLORE":"BANGALORE",
  "BOMBAY":"MUMBAI","CALCUTTA":"KOLKATA","MADRAS":"CHENNAI",
  "NEW DELHI":"DELHI","N DELHI":"DELHI","NEWDELHI":"DELHI",
  "THIRUVANANTHAPURAM":"TRIVANDRUM","THIRUVANATHAPURAM":"TRIVANDRUM","THIRUVANANTHAPURA":"TRIVANDRUM",
  "COCHIN":"KOCHI","ERNAKULAM":"KOCHI","KAKKANAD":"KOCHI","EDAPALLY":"KOCHI",
  "CALICUT":"KOZHIKODE","KOZHICODE":"KOZHIKODE",
  "SECUNDRABAD":"HYDERABAD","SECUNDERABAD":"HYDERABAD","HYDERBAD":"HYDERABAD",
  "GURGAON":"GURUGRAM","GURGOAN":"GURUGRAM",
  "NAVIMUMBAI":"NAVI MUMBAI","NEW MUMBAI":"NAVI MUMBAI",
  "VISAKHAPATNAM":"VIZAG","VISHAKHAPATNAM":"VIZAG","VISHAKAPATNAM":"VIZAG",
  "AHEMDABAD":"AHMEDABAD","AHMADABAD":"AHMEDABAD","AHAMADABAD":"AHMEDABAD",
  "POONA":"PUNE","PUNA":"PUNE",
  "COIMBATOIRE":"COIMBATORE","COVAI":"COIMBATORE",
  "TRICHUR":"THRISSUR","TRICHOOR":"THRISSUR",
  "LAKHNOU":"LUCKNOW","LUCKNAO":"LUCKNOW",
  "SUART":"SURAT",
};
function normalizeCity(raw) {
  if (!raw) return "";
  let c = raw.toUpperCase().trim();
  c = c.replace(/\s+(CITY|DISTRICT|DIST|TALUK|TEHSIL|MANDAL|URBAN|RURAL|CANTT|CANTONMENT|CORPORATION|MUNICIPAL)$/, "");
  c = c.replace(/\s+/g, " ").trim();
  return CITY_ALIAS[c] || c;
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS PROCESSOR — FIXED
   • Date anchor = MAX(purchase-date in dataset), matching Excel's MAX(AI:AI)
   • Status logic = exclude Cancelled + Returns only (matches Excel SUMPRODUCT)
   • Counts Pending + Shipped with qty > 0 (Excel counts these)
   • Tracks regional demand per ASIN via ship-state
   • Tracks city demand per ASIN via ship-city + ship-state
═══════════════════════════════════════════════════════════════ */
function processOrders(rows) {
  const warnings=[], salesByAsinDay={}, salesByAsinDayChart={}, regionalSales={}, citySales={}, seenU=new Set(), seenM=new Set();
  const lastOrderDate={};
  let maxDate = null, minSalesDate = null;
  if (!rows||!rows.length) return {salesByAsinDay,salesByAsinDayChart,warnings,maxDate,minSalesDate,regionalSales,citySales,lastOrderDate};
  const get=makeGet(rows);

  // Excel excludes exactly these — everything else (Pending, Shipped, etc.) with qty>0 is a sale
  const EXCLUDED_STATUSES = new Set([
    "cancelled",
    "shipped - returned to seller",
    "shipped - returning to seller",
    "shipped - rejected by buyer",
    "shipped - returning",
  ]);

  rows.forEach((r,i)=>{
    const asin    = s(r,get,"asin","ASIN");
    const status  = s(r,get,"order-status","order_status","Order Status").toLowerCase();
    const channel = s(r,get,"sales-channel","sales_channel","Sales Channel").toLowerCase();
    const dateRaw = s(r,get,"purchase-date","purchase_date","Date","date");
    const orderId = s(r,get,"amazon-order-id","order-id","Order ID");
    if (!asin||!dateRaw) return;
    if (orderId && orderId.startsWith("S02-")) return; // removal orders
    // (channel checked below — MCF/Non-Amazon rows still consume real FBA stock,
    //  so they stay IN demand/velocity/DOI/replenish calc; they're excluded only
    //  from the chart-vs-Amazon-dashboard sales history, see salesByAsinDayChart)
    // Use UTC date string (LEFT(C,10) equivalent) to match Excel exactly
    const utcDateStr = String(dateRaw).slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(utcDateStr)) return;
    const d = new Date(utcDateStr+"T00:00:00");

    // Track date range in the dataset
    if (!maxDate || d > maxDate) maxDate = d;
    if (!minSalesDate || d < minSalesDate) minSalesDate = d;

    if (!SKU_MAP[asin]){
      if(!seenU.has(asin)){seenU.add(asin);warnings.push({type:"unmapped_order",asin,row:i+2});}
      return;
    }
    const csvSku=s(r,get,"sku","SKU");
    const mapSku=SKU_MAP[asin]?.sellerSku||"";
    if(csvSku&&mapSku&&csvSku.toLowerCase()!==mapSku.toLowerCase()&&!seenM.has(asin)){
      seenM.add(asin); warnings.push({type:"sku_mismatch_order",asin,csvSku,mapSku,row:i+2});
    }

    // Skip excluded statuses
    if (EXCLUDED_STATUSES.has(status)) return;

    const qty=Math.max(0,parseFloat(s(r,get,"quantity","Quantity","qty")||"0")||0);
    if(qty===0) return;

    // Accumulate daily sales
    const key=localKey(d);
    if(!salesByAsinDay[asin]) salesByAsinDay[asin]={};
    if(!salesByAsinDay[asin][key]) salesByAsinDay[asin][key]={sold:0};
    salesByAsinDay[asin][key].sold+=qty;
    // Chart-only series: matches Amazon's Sales widget (excludes Non-Amazon/MCF rows)
    if(!(channel && channel.includes("non-amazon"))){
      if(!salesByAsinDayChart[asin]) salesByAsinDayChart[asin]={};
      if(!salesByAsinDayChart[asin][key]) salesByAsinDayChart[asin][key]={sold:0};
      salesByAsinDayChart[asin][key].sold+=qty;
    }
    // Track last order date per ASIN
    if(!lastOrderDate[asin]||d>lastOrderDate[asin]) lastOrderDate[asin]=d;

    // Track regional demand
    const stateRaw = s(r,get,"ship-state","Ship State","ship_state","state").toUpperCase().trim();
    const region = STATE_TO_REGION[stateRaw] || "Unknown";
    if(!regionalSales[asin]) regionalSales[asin]={North:0,South:0,East:0,West:0,Central:0,Unknown:0};
    regionalSales[asin][region] = (regionalSales[asin][region]||0) + qty;

    // Track city demand — store as "CITY||STATE" key so we keep state context
    const cityRaw = s(r,get,"ship-city","Ship City","ship_city","city");
    const cityNorm = normalizeCity(cityRaw);
    const stateName = stateRaw || "UNKNOWN";
    if (cityNorm) {
      const cityKey = cityNorm + "||" + stateName;
      if (!citySales[asin]) citySales[asin] = {};
      citySales[asin][cityKey] = (citySales[asin][cityKey] || 0) + qty;
    }
  });

  return {salesByAsinDay,salesByAsinDayChart,warnings,maxDate,minSalesDate,regionalSales,citySales,lastOrderDate};
}

/* ═══════════════════════════════════════════════════════════════
   LEDGER PROCESSOR
═══════════════════════════════════════════════════════════════ */
function processLedger(rows) {
  if (!rows||!rows.length) return {};
  const get=makeGet(rows);
  function parseLedgerDate(str) {
    if (!str) return null;
    const mdy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdy) { const d=new Date(+mdy[3],+mdy[1]-1,+mdy[2]); d.setHours(0,0,0,0); return d; }
    const d=new Date(str); if(isNaN(d)) return null;
    d.setHours(0,0,0,0); return d;
  }
  let latestDate=null;
  rows.forEach(r=>{
    const d=parseLedgerDate(s(r,get,"Date","date"));
    if(d&&(!latestDate||d>latestDate)) latestDate=d;
  });
  if(!latestDate) return {fcData:{}, ledgerDate:null};
  const byKey={};
  rows.forEach(r=>{
    const asin=s(r,get,"ASIN","asin");
    const loc=s(r,get,"Location","location");
    const disp=s(r,get,"Disposition","disposition");
    if(!asin||!loc||!disp||!SKU_MAP[asin]) return;
    const key=`${asin}||${loc}||${disp}`;
    if(!byKey[key]) byKey[key]=[];
    byKey[key].push(r);
  });
  const fcData={};
  Object.keys(byKey).forEach(key=>{
    const [asin,loc,disp]=key.split("||");
    if(!fcData[asin]) fcData[asin]={fcStock:{},fcDemand:{},fcUnsellable:{},fcInTransit:{}};
    const entries=byKey[key];
    if(disp==="SELLABLE"){
      const latest=entries.find(r=>{
        const d=parseLedgerDate(s(r,get,"Date","date"));
        return d&&d.getTime()===latestDate.getTime();
      });
      if(latest){
        const bal=n(latest,get,"Ending Warehouse Balance","EndingWarehouseBalance");
        const tr=n(latest,get,"In Transit Between Warehouses","InTransitBetweenWarehouses");
        fcData[asin].fcStock[loc]=(fcData[asin].fcStock[loc]||0)+bal;
        fcData[asin].fcInTransit[loc]=(fcData[asin].fcInTransit[loc]||0)+tr;
      }
      const totalDemand=entries.reduce((sum,r)=>{
        const ship=parseFloat(s(r,get,"Customer Shipments","CustomerShipments")||"0")||0;
        return sum+Math.max(0,-ship);
      },0);
      fcData[asin].fcDemand[loc]=(fcData[asin].fcDemand[loc]||0)+(entries.length>0?totalDemand/entries.length:0);
    } else if(UNSELLABLE_DISPOSITIONS.has(disp)){
      const latest=entries.find(r=>{
        const d=parseLedgerDate(s(r,get,"Date","date"));
        return d&&d.getTime()===latestDate.getTime();
      });
      if(latest){
        const bal=n(latest,get,"Ending Warehouse Balance","EndingWarehouseBalance");
        fcData[asin].fcUnsellable[loc]=(fcData[asin].fcUnsellable[loc]||0)+bal;
      }
    }
  });
  return {fcData, ledgerDate: latestDate};
}

/* ═══════════════════════════════════════════════════════════════
   LEADTIME PROCESSOR
   Reads ASIN + Mode (Air/SEA) rows from Leadtime sheet.
   Produces: { [asin]: { air:{lead,ship,customs,safety,depart,total}, sea:{…}, cost } }
═══════════════════════════════════════════════════════════════ */
function processLeadtime(rows) {
  if (!rows || !rows.length) return {};
  const get = makeGet(rows);
  const lt = {};
  rows.forEach(r => {
    const asin    = s(r, get, "ASIN", "asin");
    const mode    = s(r, get, "Mode of shipment", "Mode", "mode", "shipment_mode").toLowerCase();
    if (!asin || (!mode.includes("air") && !mode.includes("sea"))) return;
    const lead    = n(r, get, "Lead Time (Days)", "Lead Time", "lead_time", "lead");
    const ship    = n(r, get, "Shipping Time (Days)", "Shipping Time", "shipping_time", "transit");
    const customs = n(r, get, "Customs (Days)", "customs", "Customs");
    const safety  = n(r, get, "Safety Stock (Days)", "Safety Stock", "safety_stock", "safety");
    const depart  = n(r, get, "Departure Delay", "departure_delay", "departure");
    const cost    = n(r, get, "Base Cost / Unit (₹)", "Base Cost / Unit", "Base Cost", "cost", "unit_cost");
    const transitDaysCol = n(r, get, "Total Transit Days", "total_transit_days", "Transit Days", "transit_days");
    const total   = transitDaysCol > 0 ? transitDaysCol : (lead + ship + customs + depart);
    if (!lt[asin]) lt[asin] = { cost: 0 };
    if (cost > 0) lt[asin].cost = cost;
    const modeData = { lead, ship, customs, safety, depart, total, transitDays: total };
    if (mode.includes("air")) { lt[asin].air = modeData; }
    else if (mode.includes("sea")) { lt[asin].sea = modeData; lt[asin].transitDays = total; /* sea = default */ }
  });
  return lt;
}

/* ═══════════════════════════════════════════════════════════════
   PURCHASES PROCESSOR
   Reads Purchases sheet, builds openPoQtyByAsin map.
   Excludes Status == "Delivered" (case-insensitive).
   O(n) single pass.
═══════════════════════════════════════════════════════════════ */
function buildOpenPoMap(rows) {
  if (!rows || !rows.length) return {};
  const get = makeGet(rows);
  const map = {};
  rows.forEach(r => {
    const asin   = s(r, get, "ASIN", "asin");
    const status = s(r, get, "Status", "status").toLowerCase().trim();
    if (!asin) return;
    if (status === "delivered") return;
    const qty = n(r, get, "Tr Qty", "tr qty", "Qty", "qty", "Quantity", "quantity");
    if (qty <= 0) return;
    map[asin] = (map[asin] || 0) + qty;
  });
  return map;
}

/* ═══════════════════════════════════════════════════════════════
   VELOCITY ENGINE — FIXED
   • Uses anchorDate (= maxDate from orders) instead of today
   • Pure averages: avg7=d7/7, avg14=d14/14, avg30=d30/30 — no multipliers
   • Window: anchor-29 to anchor = 30 days (matches Excel >= maxDate-29)
═══════════════════════════════════════════════════════════════ */
function calcVelocity(asin, salesByAsinDay, anchorDate) {
  const data = salesByAsinDay[asin] || {};
  const anchor = anchorDate || getToday();

  let d7=0, d14=0, d30=0;
  for(let i=0; i<30; i++){
    const d=new Date(anchor); d.setDate(d.getDate()-i);
    const {sold=0} = data[localKey(d)] || {};
    if(i<7)  d7  += sold;
    if(i<14) d14 += sold;
    d30 += sold;
  }
  // Pure division — matches Excel's (7d/7), (14d/14), (30d/30)
  const avg7  = d7  / 7;
  const avg14 = d14 / 14;
  const avg30 = d30 / 30;
  const demand = avg7*0.5 + avg14*0.3 + avg30*0.2;
  return { avg7, avg14, avg30, demand, raw7:d7, raw14:d14, raw30:d30 };
}

/* ═══════════════════════════════════════════════════════════════
   TREND ENGINE — compares avg7 vs avg30 to classify momentum
═══════════════════════════════════════════════════════════════ */
function calcTrend(avg7, avg30) {
  if (avg7 === 0 && avg30 === 0) return "—";
  if (avg7 === 0) return "▼▼ Strong Down";
  if (avg30 === 0) return "▲▲ Strong Up";
  const ratio = avg7 / avg30;
  if (ratio > 1.2)   return "▲▲ Strong Up";
  if (ratio > 1.1)   return "▲ Rising";
  if (ratio > 1.05)  return "↗ Slight Up";
  if (ratio >= 0.95) return "→ Stable";
  if (ratio >= 0.85) return "↘ Slight Down";
  if (ratio >= 0.6)  return "▼ Falling";
  return "▼▼ Strong Down";
}
// Change this single value to swap the sidebar logo icon (emoji, short glyph, or svg jsx)
const LOGO_ICON = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="9" r="5.5" stroke="#7c9aff" strokeWidth="2.2"/>
    <circle cx="15" cy="15" r="5.5" stroke="#5a6cff" strokeWidth="2.2"/>
  </svg>
);

const NAV_ICONS = {
  input:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>,
  dashboard:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  allskus:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>,
  fc:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  lis:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>,
  procurement:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  skumgr:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  warnings:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>,
};

function trendColor(trend, t) {
  if (trend.includes("▲")) return t.green;
  if (trend.includes("↗")) return t.green;
  if (trend.includes("→")) return t.text2;
  if (trend.includes("↘")) return t.yellow;
  if (trend.includes("▼▼")) return t.red;
  if (trend.includes("▼")) return t.yellow;
  return t.text3;
}

/* ═══════════════════════════════════════════════════════════════
   PLANNING ENGINE
═══════════════════════════════════════════════════════════════ */
function calcPlanning(inv, vel, settings) {
  const {totalLeadTime:addLT, safetyDays:saf, fbaCoverDays:fcd} = settings;
  const {demand} = vel;
  const cs = inv.currentStock;
  const inb = inv.inbound || 0;
  const doi = demand>0 ? cs/demand : Infinity;
  const anchor = inv._anchor || getToday();
  const stockoutDate = demand>0 ? new Date(anchor.getTime()+doi*86400000) : null;
  // Per-SKU lead times from ltData; fall back to addLT as total if no file data
  const seaLT = inv._seaLT != null ? inv._seaLT + addLT : addLT;
  const airLT = inv._airLT != null ? inv._airLT + addLT : Math.max(1, Math.round(seaLT * 0.35));
  // Reorder threshold = sea lead time + safety stock days
  const reorderThreshold = seaLT + saf;
  const required = demand * reorderThreshold;
  const gap = Math.max(0, reorderThreshold - doi);
  const netReq = required + gap * demand;
  const suggestedBuy = Math.round(netReq);
  // Deduct already-purchased units (on-order PO) from net requirement
  const poUnitsVal = inv._poUnits || 0;
  const adjustedBuy = Math.max(0, suggestedBuy - poUnitsVal);
  const adjustedNetReq = Math.max(0, netReq - poUnitsVal);
  // Shipment split: air bridges gap before sea arrives, sea covers the rest
  // If stockout happens before sea ETA → need air to cover (seaLT - airLT) day window
  const seaETA = seaLT; // days from now
  const stockDaysLeft = isFinite(doi) ? doi : seaETA + 1;
  const needsAir = demand > 0 && stockDaysLeft < seaETA;
  const airWindowDays = needsAir ? Math.max(0, seaETA - Math.max(0, stockDaysLeft)) : 0;
  const airQtyRec = Math.round(airWindowDays * demand);
  const seaQtyRec = Math.max(0, suggestedBuy - airQtyRec);
  const targetFBA = demand*fcd;
  const rawFba = inv._rawFbaAvailable ?? inv.fbaAvailable;
  const replenishQty = Math.max(0, Math.ceil(targetFBA-rawFba));
  const urgency = doi<0?2:doi<saf?2:doi<reorderThreshold?1.5:1;
  const rawPriority = Math.min(9999,Math.max(0,(reorderThreshold-doi))*demand*urgency*(adjustedBuy>0?1:0.15));
  let action="OK", priority="low";
  if(demand>0&&cs<=0){action="STOCKOUT";priority="critical";}
  else if(demand>0&&isFinite(doi)&&doi<=saf){action="SAFETY STOCK BREACH";priority="critical";}
  else if(doi<reorderThreshold*0.25&&adjustedBuy>0){action="REPLENISH FBA";priority="critical";}
  else if(doi<reorderThreshold&&adjustedBuy>0){action="PURCHASE REQUIRED";priority="high";}
  else if(adjustedBuy===0&&suggestedBuy>0){action="PO PLACED";priority="low";}
  else if(inb>required*0.6&&doi>reorderThreshold){action="HOLD";priority="low";}
  else if(doi>reorderThreshold*3&&reorderThreshold>0){action="OVERSTOCK";priority="low";}
  const purchasePct = (demand>0 && doi<reorderThreshold && reorderThreshold>0 && adjustedBuy>0)
    ? Math.min(100, Math.round((reorderThreshold-Math.max(0,doi))/reorderThreshold*100)) : 0;
  const replenishPct = (targetFBA>0 && replenishQty>0)
    ? Math.min(100, Math.round(replenishQty/targetFBA*100)) : 0;
  return {doi,stockoutDate,requiredStock:required,netRequirement:adjustedNetReq,
    suggestedPurchase:adjustedBuy,rawSuggestedPurchase:suggestedBuy,poUnits:poUnitsVal,
    airQtyRec,seaQtyRec,needsAir,seaLT,airLT,
    replenishQty,targetFBA,reorderStock:required,
    action,priority,rawPriority,displayScore:0,purchasePct,replenishPct};
}

/* ═══════════════════════════════════════════════════════════════
   FC PLANNING
═══════════════════════════════════════════════════════════════ */
function calcFCPlanning(asin, fcData, vel, settings) {
  if (!fcData||!fcData[asin]) return null;
  const {fcStock,fcDemand,fcUnsellable,fcInTransit}=fcData[asin];
  const allFCs=[...new Set([...Object.keys(fcStock),...Object.keys(fcDemand),...Object.keys(fcUnsellable),...Object.keys(fcInTransit)])].sort();
  const threshold=settings.fbaCoverDays||settings.safetyDays||14;
  const fcs=allFCs.map(fc=>{
    const stock=fcStock[fc]||0;
    const demand=fcDemand[fc]||0;
    const unsellable=fcUnsellable[fc]||0;
    const inTransit=fcInTransit[fc]||0;
    const doi=demand>0?stock/demand:Infinity;
    let status="ok";
    if(demand===0&&stock===0) status="ok";
    else if(stock===0&&demand>0) status="stockout";
    else if(isFinite(doi)&&doi<threshold/2) status="critical";
    else if(isFinite(doi)&&doi<threshold) status="low";
    else if(demand>0&&isFinite(doi)&&doi>threshold*4) status="surplus";
    return {fc,stock,demand:+demand.toFixed(2),unsellable,inTransit,doi,status,label:fcLabel(fc)};
  });
  const needy=fcs.filter(f=>f.status==="stockout"||f.status==="critical"||f.status==="low");
  const recommendations=needy.map(nf=>{
    const needed=nf.demand>0?Math.ceil(nf.demand*threshold)-nf.stock:0;
    return {fc:nf.fc,label:nf.label,needed:Math.max(0,needed),status:nf.status,doi:nf.doi,demand:nf.demand};
  }).filter(r=>r.needed>0);
  return {fcs,recommendations,threshold};
}

/* ═══════════════════════════════════════════════════════════════
   FORECAST — FIXED: uses anchorDate as today
═══════════════════════════════════════════════════════════════ */
function buildForecast(cs, demand, anchorDate, days=70){
  const today = anchorDate || getToday();
  let stock=cs;
  const pts=[];
  for(let i=0;i<=days;i++){
    const d=new Date(today); d.setDate(d.getDate()+i);
    pts.push({day:i,date:d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"}),stock:Math.max(0,Math.round(stock))});
    stock-=demand;
  }
  return pts;
}

/* ═══════════════════════════════════════════════════════════════
   MASTER COMPUTE — FIXED
   • Passes anchorDate through all velocity/forecast calls
   • Attaches regionalSales to each SKU
═══════════════════════════════════════════════════════════════ */
function computeAll(inv, salesByAsinDay, fcData, settings, anchorDate, regionalSales, citySales, ltData, poUnits, lastOrderDate, salesByAsinDayChart){
  const res={};
  // Stock inclusion flags
  const inclFBA      = settings.inclFBA      !== false;
  const inclFC       = settings.inclFC       !== false;
  const inclInbound  = settings.inclInbound  !== false;
  const inclTransfer = settings.inclTransfer !== false;
  Object.keys(inv).forEach(asin=>{
    const d = inv[asin];
    const vel = calcVelocity(asin, salesByAsinDay, anchorDate);
    // Centralized effective stock — only affects planning/DOI/forecast, not FC breakdown
    const inboundUnits = (d.inbound||0) + (d.processing||0)*0.8;
    // On Hand = FBA Available + FC Transfer; toggle FC Transfer in/out
    const baseOnHand = inclTransfer ? (d.onHand||0) : (d.fbaAvailable||0);
    const fbaStock   = inclFBA     ? baseOnHand : 0;
    const fcStock    = inclFC      ? (d.fcSellable||0) : 0;
    const inbStock   = inclInbound ? inboundUnits : 0;
    const effectiveStock = fbaStock + fcStock + inbStock;
    // effectiveFBA for replenishQty calc
    const effectiveFBA = inclFBA ? baseOnHand : (inclFC ? effectiveStock : baseOnHand);
    const invWithAnchor = { ...d, _anchor: anchorDate, currentStock: effectiveStock, fbaAvailable: effectiveFBA,
      _rawFbaAvailable: d.fbaAvailable||0,
      _seaLT: ltData?.[asin]?.sea?.transitDays ?? null,
      _airLT: ltData?.[asin]?.air?.transitDays ?? null,
      _poUnits: poUnits?.[asin] ?? 0,
    };
    const planning = calcPlanning(invWithAnchor, vel, settings);
    const forecast = buildForecast(effectiveStock, vel.demand, anchorDate);
    const fcPlanning = calcFCPlanning(asin, fcData, vel, settings);
    const defaultTransitDays = ltData?.[asin]?.transitDays ?? null;
    const skuSeaLT = ltData?.[asin]?.sea?.transitDays ?? null;
    const skuAirLT = ltData?.[asin]?.air?.transitDays ?? null;
    const salesHistory = [];
    for(let i=29;i>=0;i--){
      const dt = new Date(anchorDate || getToday());
      dt.setDate(dt.getDate()-i);
      const key = localKey(dt);
      salesHistory.push({date:key, units: (salesByAsinDayChart||salesByAsinDay)[asin]?.[key]?.sold || 0});
    }
    res[asin]={
      ...inv[asin], velocity:vel, planning, forecast, fcPlanning,
      hasFCData:!!fcData[asin],
      defaultTransitDays,
      skuSeaLT, skuAirLT,
      purchasedUnits: poUnits?.[asin] ?? 0,
      regionalSales: regionalSales?.[asin] || {},
      citySales: citySales?.[asin] || {},
      _lastOrderDate: lastOrderDate?.[asin] ?? null,
      salesHistory,
    };
  });
  const maxRaw=Object.values(res).reduce((m,d)=>Math.max(m,d.planning.rawPriority),0);
  Object.values(res).forEach(d=>{
    d.planning.displayScore=maxRaw>0?Math.round((d.planning.rawPriority/maxRaw)*100):0;
  });
  return res;
}

/* ═══════════════════════════════════════════════════════════════
   THEMES
═══════════════════════════════════════════════════════════════ */
const DARK={
  bg:"#14161B",surface:"#1A1D24",surface2:"#20242C",
  border:"#2C313C",border2:"#373D4A",
  text:"#E4E6EA",text2:"#9BA1AC",text3:"#6E7480",
  accent:"#5B8FE0",accentBg:"rgba(91,143,224,.09)",accentBdr:"rgba(91,143,224,.20)",
  red:"#D26A6A",redBg:"rgba(210,106,106,.09)",redBdr:"rgba(210,106,106,.20)",
  yellow:"#D6A24F",yellowBg:"rgba(214,162,79,.09)",yellowBdr:"rgba(214,162,79,.20)",yellowText:"#14161b",
  green:"#5FAE7E",greenBg:"rgba(95,174,126,.09)",greenBdr:"rgba(95,174,126,.20)",
  purple:"#9485D6",purpleBg:"rgba(148,133,214,.09)",
  orange:"#D08652",orangeBg:"rgba(208,134,82,.09)",
  rowHover:"rgba(255,255,255,.03)",
  sidebar:"#101216",sbBorder:"rgba(255,255,255,.06)",sbMuted:"rgba(255,255,255,.30)",
  sbItem:"rgba(255,255,255,.58)",sbItemHover:"rgba(255,255,255,.88)",
  sbHover:"rgba(255,255,255,.045)",sbActive:"rgba(91,143,224,.13)",sbActiveText:"#9bbcec",
  tooltipBg:"#20242C",
};
const LIGHT={
  bg:"#F4F5F7",surface:"#FCFCFD",surface2:"#EEF0F3",
  border:"#E1E4E9",border2:"#D2D6DD",
  text:"#1F2430",text2:"#5C6270",text3:"#8A8F99",
  accent:"#3A6FD8",accentBg:"rgba(58,111,216,.06)",accentBdr:"rgba(58,111,216,.14)",
  red:"#C24545",redBg:"rgba(194,69,69,.05)",redBdr:"rgba(194,69,69,.12)",
  yellow:"#B07A1F",yellowBg:"rgba(176,122,31,.06)",yellowBdr:"rgba(176,122,31,.14)",yellowText:"#fff",
  green:"#2F8253",greenBg:"rgba(47,130,83,.06)",greenBdr:"rgba(47,130,83,.13)",
  purple:"#6A4FB6",purpleBg:"rgba(106,79,182,.06)",
  orange:"#A35A2E",orangeBg:"rgba(163,90,46,.06)",
  rowHover:"rgba(0,0,0,.018)",
  sidebar:"#171A21",sbBorder:"rgba(255,255,255,.06)",sbMuted:"rgba(255,255,255,.30)",
  sbItem:"rgba(255,255,255,.58)",sbItemHover:"rgba(255,255,255,.88)",
  sbHover:"rgba(255,255,255,.05)",sbActive:"rgba(58,111,216,.16)",sbActiveText:"#cddbf7",
  tooltipBg:"#21242B",
};

/* ═══════════════════════════════════════════════════════════════
   CSS GENERATOR
═══════════════════════════════════════════════════════════════ */
function makeCSS(t){return `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{height:100%;font-size:13px;overflow:hidden}
body{height:100%;overflow:hidden;background:${t.bg};color:${t.text};font-family:'Inter',system-ui,sans-serif;line-height:1.45;-webkit-font-smoothing:antialiased}
#fba-root{display:flex;height:100vh;width:100%;overflow:hidden;position:fixed;top:0;left:0;right:0;bottom:0;text-align:left}
.content,.topbar,.tb-title,.tb-sub,.ch,.card,.kc,h1,h2,h3,p,div{text-align:left}
.sb{width:240px;flex:0 0 240px;background:${t.sidebar};border-right:1px solid ${t.sbBorder};display:flex;flex-direction:column;transition:width .2s ease,flex-basis .2s ease;overflow:hidden}
.sb.col{width:52px;flex-basis:52px}
.sb-logo{padding:16px 16px 14px;border-bottom:1px solid ${t.sbBorder};display:flex;align-items:center;gap:9px;min-height:54px;flex-shrink:0}
.sb-icon{width:30px;height:30px;background:${t.accent};border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-icon-svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sb-txt{overflow:hidden;min-width:0}
.sb-txt h1{font-size:19px;font-weight:700;color:#fff;white-space:nowrap;letter-spacing:-.3px}
.sb-txt p{font-size:10px;color:${t.sbMuted};font-family:'Inter',system-ui,sans-serif;margin-top:1px;white-space:nowrap}
.sb.col .sb-txt{display:none}
.sb-nav{flex:1;padding:14px 10px;overflow-y:auto;overflow-x:hidden}
.sb-sec{margin-bottom:18px}
.sb-lbl{font-size:9px;font-weight:600;color:${t.sbMuted};letter-spacing:1px;text-transform:uppercase;padding:0 8px;margin-bottom:6px;white-space:nowrap}
.sb.col .sb-lbl{opacity:0}
.ni{display:flex;align-items:center;gap:11px;padding:9px 11px;border-radius:9px;cursor:pointer;font-size:13px;font-weight:500;color:${t.sbItem};transition:background .15s,color .15s;margin-bottom:3px;white-space:nowrap;overflow:hidden;position:relative;min-height:38px;letter-spacing:-.1px}
.ni:hover{background:${t.sbHover};color:${t.sbItemHover}}
.ni.on{background:${t.sbActive};color:${t.sbActiveText};font-weight:600;box-shadow:inset 2.5px 0 0 0 ${t.accent}}
.ni.disabled{opacity:.25;cursor:not-allowed;pointer-events:none}
.ni-ic{width:22px;min-width:22px;height:22px;display:flex;align-items:center;justify-content:center;opacity:.65;flex-shrink:0}
.ni.on .ni-ic{opacity:1;color:${t.sbActiveText}}
.ni-txt{overflow:hidden;text-overflow:ellipsis}
.sb.col .ni-txt{display:none}
.nb{margin-left:8px;font-size:10px;font-weight:600;padding:1px 7px;border-radius:10px;font-family:'Inter',system-ui,sans-serif;flex-shrink:0;line-height:16px;background:rgba(255,255,255,.10);color:${t.sbItemHover};border:1px solid rgba(255,255,255,.08)}
.nb.y,.nb.b{background:rgba(255,255,255,.10);color:${t.sbItemHover};border:1px solid rgba(255,255,255,.08)}
.sb.col .nb{position:absolute;top:4px;right:4px;font-size:8px;padding:0 4px;line-height:14px;margin-left:0}
.sb-foot{padding:10px 8px;border-top:1px solid ${t.sbBorder};display:flex;justify-content:center;cursor:pointer;color:${t.sbMuted};transition:color .12s;user-select:none;flex-shrink:0}
.sb-foot:hover{color:${t.sbItemHover}}
.sb-foot-icon{width:18px;height:18px;display:block}
.main{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column;background:${t.bg}}
.topbar{height:50px;min-height:50px;background:${t.surface};border-bottom:1px solid ${t.border};display:flex;align-items:center;padding:0 18px;gap:12px;flex-shrink:0;min-width:0;overflow:hidden}
.tb-title{font-size:14px;font-weight:600;color:${t.text};white-space:nowrap;letter-spacing:-.2px;overflow:hidden;text-overflow:ellipsis;max-width:340px}
.tb-sub{font-size:10px;color:${t.text3};font-family:'Inter',system-ui,sans-serif;white-space:nowrap}
.tb-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex-shrink:0;overflow:hidden}
.tb-btn{padding:5px 11px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:600;background:#fff;border:1px solid #fff;color:#111;transition:all .12s;font-family:'Inter',system-ui,sans-serif;white-space:nowrap;letter-spacing:-.1px}
.tb-btn-accent{padding:5px 11px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:500;background:rgb(0, 0, 0);border:1px solid ${t.accent};color:${t.text2};transition:all .12s;font-family:'Inter',system-ui,sans-serif;white-space:nowrap;letter-spacing:-.1px}
.tb-btn:hover{opacity:.88}
.tb-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:600;font-family:'Inter',system-ui,sans-serif;white-space:nowrap}
.content{flex:1;overflow-y:auto;overflow-x:hidden;padding:24px 32px 32px}
.card{background:${t.surface};border:1px solid ${t.border};border-radius:12px;padding:20px;min-width:0;overflow:hidden;width:100%;box-sizing:border-box;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.ch{font-size:13px;font-weight:600;color:${t.text2};margin-bottom:14px}
.kg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:16px;width:100%}
.kc{background:${t.surface};border:1px solid ${t.border};border-radius:16px;padding:16px 18px 18px;position:relative;overflow:hidden;min-width:0;box-shadow:0 1px 3px rgba(0,0,0,.05);transition:transform .12s,box-shadow .12s}
.kc:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.07)}
.kc::after{display:none}
.kc.r::after{background:${t.red}}.kc.y::after{background:${t.yellow}}
.kc.g::after{background:${t.green}}.kc.p::after{background:${t.purple}}.kc.b::after{background:${t.accent}}
.kl{font-size:13px;color:${t.text2};font-weight:500;margin-bottom:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;justify-content:space-between}
.kl::after{content:'↗';font-size:12px;color:${t.text3};opacity:.5}
.kv{font-size:28px;font-weight:700;color:${t.text};line-height:1;font-family:'Inter',system-ui,sans-serif;letter-spacing:-.3px;font-feature-settings:"tnum" 1}
.ks{font-size:12px;color:${t.text3};margin-top:6px;font-family:'Inter',system-ui,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tw{overflow-x:auto;width:100%;max-width:100%;-webkit-overflow-scrolling:touch}
.ts{overflow-y:auto;max-height:calc(100vh - 280px)}
table{width:100%;border-collapse:collapse;table-layout:auto}
th{padding:0 12px;height:40px;text-align:center;font-size:12px;font-weight:600;color:${t.text3};border-bottom:1px solid ${t.border};white-space:nowrap;background:${t.surface};position:sticky;top:0;z-index:2}
td{padding:0 12px;height:54px;border-bottom:1px solid ${t.border};color:${t.text2};font-family:'Inter',system-ui,sans-serif;font-size:13px;white-space:nowrap;font-feature-settings:"tnum" 1;text-align:center}
tr:last-child td{border-bottom:none}
tr:hover td{background:${t.rowHover};transition:background .12s}
tr.cr{cursor:pointer}
.tn{font-family:'Inter',system-ui,sans-serif;font-size:13px;font-weight:500;color:${t.text};overflow:hidden;text-overflow:ellipsis;max-width:200px;text-align:left}
.ta{font-size:9px;color:${t.text3};font-family:'Inter',system-ui,sans-serif;margin-top:1px;text-align:left}
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:6px;font-size:11px;font-weight:500;font-family:'Inter',system-ui,sans-serif;white-space:nowrap;border:none!important;background:transparent!important}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block;flex-shrink:0}
.dot.r{background:${t.red}}.dot.y{background:${t.yellow}}.dot.g{background:${t.green}}.dot.b{background:${t.accent}}.dot.gr{background:${t.text3}}.dot.p{background:${t.orange}}
.br{background:${t.redBg};color:${t.red};border:1px solid ${t.redBdr}}
.by{background:${t.yellowBg};color:${t.yellow};border:1px solid ${t.yellowBdr}}
.bg{background:${t.greenBg};color:${t.green};border:1px solid ${t.greenBdr}}
.bb{background:${t.accentBg};color:${t.accent};border:1px solid ${t.accentBdr}}
.bgr{background:${t.surface2};color:${t.text3};border:1px solid ${t.border}}
.bpr{background:${t.orangeBg};color:${t.orange};border:1px solid ${t.orange}55;font-weight:700}

/* ── STICKY SETTINGS BAR ── */
.sbar{background:${t.surface};border:1px solid ${t.border};border-radius:16px;padding:18px 20px;margin-bottom:16px;min-width:0;overflow:hidden;width:100%;position:sticky;top:0;z-index:10;box-shadow:0 2px 8px rgba(0,0,0,.06)}
.sbar-top{border-radius:16px}

.sg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0;min-width:0;width:100%}
.slg{min-width:0;padding:0 24px;border-right:1px solid ${t.border}}
.slg:first-child{padding-left:0}
.slg:last-child{border-right:none;padding-right:0}
.slg label{font-size:12px;color:${t.text2};font-weight:500;display:flex;justify-content:space-between;margin-bottom:11px;user-select:none;letter-spacing:-.1px}
.slg label span{color:${t.text};font-family:'Inter',system-ui,sans-serif;font-weight:700;font-size:13px}
input[type=range]{width:100%;max-width:100%;appearance:none;height:2px;background:${t.border};border-radius:2px;outline:none;cursor:pointer;display:block}
input[type=range]::-webkit-slider-thumb{appearance:none;width:12px;height:12px;border-radius:50%;background:#fff;cursor:pointer;border:none;box-shadow:none;transition:transform .1s}
input[type=range]:active::-webkit-slider-thumb{transform:scale(1.15)}
input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#fff;cursor:pointer;border:none;box-shadow:none}
.sbar-info{margin-top:14px;padding-top:12px;border-top:1px solid ${t.border};font-size:10px;color:${t.text3};font-family:'Inter',system-ui,sans-serif;line-height:1.6}
.sbar-info strong{color:${t.text2}}
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 13px;border-radius:6px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid transparent;font-family:'Inter',system-ui,sans-serif;transition:all .12s;letter-spacing:-.1px}
.bp{background:${t.accent};color:#fff;border-color:${t.accent}}.bp:hover{opacity:.88}.bp:active{opacity:.75;transform:scale(.98)}
.bs{background:${t.surface2};color:${t.text2};border-color:${t.border}}.bs:hover{color:${t.text};border-color:${t.border2}}.bs:active{background:${t.border}}
.btn:disabled{opacity:.4;cursor:not-allowed}
.ti{padding:8px 10px;background:${t.surface2};border:1px solid ${t.border};border-radius:6px;color:${t.text};font-size:12px;font-family:'Inter',system-ui,sans-serif;outline:none;width:100%;transition:border-color .12s}
.ti:focus{border-color:${t.accent}}
.ti::placeholder{color:${t.text3}}
.fdrop{border:1px dashed ${t.border2};border-radius:8px;padding:14px;text-align:center;cursor:pointer;transition:all .12s;font-size:11px;color:${t.text3}}
.fdrop:hover,.fdrop.drag{border-color:${t.accent};color:${t.accent};background:${t.accentBg}}
.floaded{background:${t.greenBg};border:1px solid ${t.greenBdr};border-radius:6px;padding:8px 11px;font-size:11px;color:${t.green};display:flex;align-items:center;gap:7px;font-family:'Inter',system-ui,sans-serif}
.igrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
.ic{background:${t.surface};border:1px solid ${t.border};border-radius:9px;padding:12px}
.icl{font-size:11px;font-weight:600;color:${t.text};margin-bottom:2px;letter-spacing:-.1px}
.ics{font-size:9px;color:${t.text3};margin-bottom:9px;font-family:'Inter',system-ui,sans-serif}
.srow{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;min-width:0;width:100%}
.sbox{display:flex;align-items:center;gap:6px;background:${t.surface2};border:1px solid ${t.border};border-radius:6px;padding:0 9px;height:32px}
.sbox input{background:none;border:none;outline:none;color:${t.text};font-size:11px;font-family:'Inter',system-ui,sans-serif;width:160px}
.sbox input::placeholder{color:${t.text3}}
.sel{padding:6px 9px;background:${t.surface2};border:1px solid ${t.border};border-radius:6px;color:${t.text2};font-size:11px;cursor:pointer;outline:none;font-family:'Inter',system-ui,sans-serif;height:32px}
.sel:focus{border-color:${t.accent}}
.sr{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid ${t.border}}
.sr:last-child{border-bottom:none}
.sk{font-size:11px;color:${t.text3};font-weight:400}
.sv{font-size:11px;font-weight:600;color:${t.text};font-family:'Inter',system-ui,sans-serif}
.alert{display:flex;align-items:flex-start;gap:8px;padding:9px 12px;border-radius:7px;margin-bottom:8px;font-size:11px;line-height:1.5}
.ar{background:${t.redBg};border:1px solid ${t.redBdr};color:${t.red}}
.ay{background:${t.yellowBg};border:1px solid ${t.yellowBdr};color:${t.yellow}}
.ab{background:${t.accentBg};border:1px solid ${t.accentBdr};color:${t.accent}}
.ag{background:${t.greenBg};border:1px solid ${t.greenBdr};color:${t.green}}
.fc-card{background:${t.surface};border:1px solid ${t.border};border-radius:12px;overflow:hidden;margin-bottom:10px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.fc-card-hdr{padding:14px 16px;background:${t.surface};border-bottom:1px solid ${t.border};display:flex;align-items:center;gap:12px}
.fc-no-data{padding:14px;text-align:center;font-size:11px;color:${t.text3};font-family:'Inter',system-ui,sans-serif}
.fc-rec-list{padding:10px 14px;display:flex;flex-direction:column;gap:5px}
.fc-rec-item{display:flex;align-items:center;gap:10px;padding:10px 12px;background:${t.surface};border-radius:8px;border:1px solid ${t.border};font-size:13px}
.ld{display:flex;align-items:center;justify-content:center;height:120px;flex-direction:column;gap:9px;color:${t.text3}}
.sp{width:20px;height:20px;border:2px solid ${t.border2};border-top-color:${t.accent};border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:50px 20px;color:${t.text3}}
.empty-ic{font-size:28px;margin-bottom:10px;opacity:.25}
.empty h3{font-size:14px;font-weight:600;color:${t.text2};margin-bottom:5px;letter-spacing:-.2px}
.empty p{font-size:11px;line-height:1.7;color:${t.text3}}
.d2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.d4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.bk{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;color:#111;background:#fff;border:1px solid #fff;transition:all .12s;margin-bottom:12px;letter-spacing:-.1px}
.bk:hover{opacity:.88}
.ac{padding:11px;background:${t.surface2};border-radius:7px;border:1px solid ${t.border}}
.acl{font-size:11px;color:${t.text3};margin-bottom:4px;font-weight:500}
.acv{font-size:20px;font-weight:700;font-family:'Inter',system-ui,sans-serif;letter-spacing:-.5px}
.acs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.wsec{background:${t.surface};border:1px solid ${t.border};border-radius:12px;padding:18px;margin-bottom:12px}
.wh{font-size:13px;font-weight:600;color:${t.text2};margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid ${t.border}}

/* ── INDIA HEATMAP ── */
.hm-grid{display:grid;gap:6px}
.hm-region{border-radius:8px;padding:10px 14px;position:relative;overflow:hidden;transition:transform .1s}
.hm-region:hover{transform:scale(1.01)}
.hm-name{font-size:10px;font-weight:700;margin-bottom:5px;letter-spacing:.3px;text-transform:uppercase}
.hm-vals{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.hm-units{font-size:20px;font-weight:700;font-family:'Inter',system-ui,sans-serif;line-height:1}
.hm-pct{font-size:9px;color:${t.text3};font-family:'Inter',system-ui,sans-serif;align-self:flex-end;margin-bottom:2px}
.hm-stock{font-size:9px;font-family:'Inter',system-ui,sans-serif;margin-left:auto;padding:2px 7px;border-radius:12px}
.hm-bar{position:absolute;bottom:0;left:0;height:3px;border-radius:0 2px 0 8px;transition:width .4s ease}

/* ── ADJ CARD ── */
.adj-card{background:${t.surface2};border:1px solid ${t.border};border-radius:9px;padding:12px 14px;margin-bottom:10px}
.adj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.adj-sub{font-size:9px;color:${t.text3};font-family:'Inter',system-ui,sans-serif;margin-top:3px}

@media(max-width:900px){.d4{grid-template-columns:repeat(2,1fr)}}
@media(max-width:768px){.sb{display:none}.content{padding:10px 12px 20px}.igrid{grid-template-columns:1fr}.sg{grid-template-columns:1fr}.kg{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.d2{grid-template-columns:1fr}.acs{grid-template-columns:1fr}.d4{grid-template-columns:1fr 1fr}.adj-grid{grid-template-columns:1fr}}
@media(max-width:480px){.kg{grid-template-columns:repeat(2,1fr)}}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:${t.border2};border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:${t.text3}}
`;}

/* ═══════════════════════════════════════════════════════════════
   SHARED SMALL COMPONENTS
═══════════════════════════════════════════════════════════════ */
function PBadge({action,priority,purchasePct=0,replenishPct=0,t}){
  // Colour by urgency % — applied to text only, not badge background
  function pctColor(pct){
    if(!t) return undefined;
    if(pct>=76) return t.red;
    if(pct>=51) return t.orange;
    if(pct>=26) return t.yellow;
    return t.green;
  }
  const containerC=priority==="critical"?"br":priority==="high"?"by":action==="OVERSTOCK"||action==="HOLD"?"bb":"bg";
  // Combined badge: both signals active
  const isCombined = purchasePct>0 && replenishPct>0 &&
    (action==="PURCHASE REQUIRED"||action==="REPLENISH FBA"||action==="STOCKOUT");
  if(isCombined){
    const purchaseFirst = purchasePct >= replenishPct;
    const pWord=<span style={{color:pctColor(purchasePct)}}>Purchase</span>;
    const rWord=<span style={{color:pctColor(replenishPct)}}>Replenish</span>;
    const title=`Purchase: ${purchasePct}% · Replenish: ${replenishPct}%`;
    return(
      <span className={`badge ${containerC}`} title={title} style={{color:"inherit",gap:0}}>
        {purchaseFirst?pWord:rWord}
        <span style={{opacity:.55}}> + </span>
        {purchaseFirst?rWord:pWord}
      </span>
    );
  }
  // Single badge — colour only the action text by its own %
  const singlePct  = purchasePct||replenishPct;
  const textColor  = singlePct>0&&t ? pctColor(singlePct) : undefined;
  const dotC=priority==="critical"?"r":priority==="high"?"y":action==="OVERSTOCK"||action==="HOLD"?"b":"g";
  return<span className={`badge ${containerC}`}><span className={`dot ${dotC}`}></span><span style={textColor?{color:textColor}:{}}>{action||"OK"}</span></span>;
}
function DOI({doi,t}){
  if(!isFinite(doi)||doi>999)return<span style={{color:t.green}}>∞</span>;
  const col=doi<7?t.red:doi<21?t.yellow:t.green;
  return<span style={{color:col,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmt(doi,1)}d</span>;
}
function TrendBadge({avg7,avg30,t}){
  const trend=calcTrend(avg7,avg30);
  if(trend==="—") return<span style={{color:t.text3,fontSize:10,fontFamily:"'Inter',system-ui,sans-serif"}}>—</span>;
  return<span style={{fontSize:10,color:trendColor(trend,t),fontFamily:"'Inter',system-ui,sans-serif",whiteSpace:"nowrap"}}>{trend}</span>;
}

function DropZone({label,sub,onFile,loaded,fileName}){
  const[drag,setDrag]=useState(false);const ref=useRef();
  return loaded?(
    <div className="floaded">✓<span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{fileName}</span>
      <span style={{cursor:"pointer",opacity:.5,fontSize:13}} onClick={()=>onFile(null)}>✕</span>
    </div>
  ):(
    <div className={`fdrop${drag?" drag":""}`}
      onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);onFile(e.dataTransfer.files[0])}}
      onClick={()=>ref.current.click()}>
      <input ref={ref} type="file" accept=".csv,.tsv,.txt" style={{display:"none"}} onChange={e=>onFile(e.target.files[0])}/>
      <div style={{fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",color:"inherit",marginBottom:6,opacity:.6}}>Upload</div>
      <div style={{fontWeight:700,marginBottom:2}}>{label}</div>
      <div style={{fontSize:9}}>{sub}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INDIA DEMAND + STOCK HEATMAP
═══════════════════════════════════════════════════════════════ */
// Green → Yellow-green → Amber → Orange → Red based on demand intensity
function heatColor(intensity) {
  const stops = [
    {r:39,  g:174, b:96 },  // 0.00 — green   (low demand)
    {r:168, g:208, b:141},  // 0.25 — yellow-green
    {r:241, g:196, b:15 },  // 0.50 — amber
    {r:230, g:126, b:34 },  // 0.75 — orange
    {r:192, g:57,  b:43 },  // 1.00 — red     (peak demand)
  ];
  const t = Math.min(1, Math.max(0, intensity)) * (stops.length - 1);
  const i = Math.floor(t), f = t - i;
  const a = stops[Math.min(i, stops.length-1)];
  const b = stops[Math.min(i+1, stops.length-1)];
  return { r: Math.round(a.r+(b.r-a.r)*f), g: Math.round(a.g+(b.g-a.g)*f), b: Math.round(a.b+(b.b-a.b)*f) };
}
function rgba(rg, alpha) { return `rgba(${rg.r},${rg.g},${rg.b},${alpha})`; }
function hexish(rg) { return `rgb(${rg.r},${rg.g},${rg.b})`; }

function IndiaHeatmap({ regionalSales, fcPlanning, settings, velocity, t }) {
  const REGIONS = ["North","West","Central","East","South"];
  const reg = regionalSales || {};
  const totalUnits = REGIONS.reduce((s,r)=>s+(reg[r]||0),0);
  const unknownUnits = reg["Unknown"]||0;
  const coverDays = settings?.fbaCoverDays || 30;
  const totalDemandPerDay = velocity?.demand || 0;

  const regionStock = {};
  if (fcPlanning?.fcs) {
    fcPlanning.fcs.forEach(fc => {
      const region = FC_REGION[fc.fc];
      if (region) regionStock[region] = (regionStock[region]||0) + fc.stock;
    });
  }
  const hasStock = Object.keys(regionStock).length > 0;
  const pct = r => totalUnits > 0 ? Math.round((reg[r]||0) / totalUnits * 100) : 0;

  if (totalUnits === 0 && !hasStock) {
    return (
      <div style={{padding:"18px 0",textAlign:"center",fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
        No regional data — ship-state column not found in orders CSV
      </div>
    );
  }

  /* Status palette — solid, no transparency */
  const STATUS = {
    STOCKOUT: { label:"Stockout", icon:"", c:t.red, bg:t.surface, border:t.border },
    CRITICAL: { label:"Critical", icon:"", c:t.red, bg:t.surface, border:t.border },
    LOW:      { label:"At Risk",  icon:"", c:t.yellow, bg:t.surface, border:t.border },
    HEALTHY:  { label:"Healthy",  icon:"", c:t.green, bg:t.surface, border:t.border },
    SURPLUS:  { label:"Surplus",  icon:"⬆",  c:t.purple, bg:t.surface, border:t.border },
    NONE:     { label:"No Data",  icon:"—",  c:t.text3,    bg:t.surface, border:t.border },
  };

  function RegBlock({ region }) {
    const demand30 = reg[region] || 0;
    const stock    = regionStock[region] || 0;
    const p        = pct(region);

    const regionShare        = totalUnits > 0 ? demand30 / totalUnits : 0;
    const regionDemandPerDay = totalDemandPerDay * regionShare;
    const targetStock        = Math.round(regionDemandPerDay * coverDays);
    const doi                = regionDemandPerDay > 0 ? stock / regionDemandPerDay : null;
    const coveragePct        = targetStock > 0 ? Math.round(stock / targetStock * 100) : null;
    const barFill            = targetStock > 0 ? Math.min(100, Math.round(stock / targetStock * 100)) : 0;
    const gap                = hasStock && targetStock > 0 ? targetStock - stock : null;
    const hasBothData        = demand30 > 0 && hasStock;

    /* Pick status */
    let st = STATUS.NONE;
    if (demand30 === 0 && stock === 0) {
      st = STATUS.NONE;
    } else if (hasStock && stock === 0 && demand30 > 0) {
      st = STATUS.STOCKOUT;
    } else if (hasStock && coveragePct !== null && coveragePct < 60) {
      st = STATUS.CRITICAL;
    } else if (hasStock && coveragePct !== null && coveragePct < 90) {
      st = STATUS.LOW;
    } else if (hasStock && coveragePct !== null && coveragePct <= 130) {
      st = STATUS.HEALTHY;
    } else if (hasStock && (coveragePct === null || coveragePct > 130)) {
      st = st = STATUS.SURPLUS;
    }

    return (
      <div style={{
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderLeft: `3px solid ${st.c}`,
        borderRadius: 12,
        padding: "16px 18px",
        display:"flex",
        flexDirection:"column",
        gap:0,
      }}>

        {/* ── Header: region name + status badge ── */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{
            fontSize:14,fontWeight:600,
            color:t.text,fontFamily:"'Inter',system-ui,sans-serif",
          }}>{region}</span>
          <span style={{display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:500,color:st.c}}>
            <span className="dot" style={{background:st.c}}></span>{st.icon} {st.label}
          </span>
        </div>

        {/* ── Demand number ── */}
        <div style={{marginBottom:8}}>
          <span style={{
            fontSize:28,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",
            color:t.text,lineHeight:1,
          }}>{fmt(demand30)}</span>
          <span style={{fontSize:10,color:t.text3,marginLeft:8}}>demand · {p}% of total</span>
        </div>

        {/* ── Stock vs target line ── */}
        {hasStock && (
          <div style={{
            fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",
            marginBottom:10,color:t.text2,
          }}>
            <span style={{color:stock>0?st.c:"#e05252",fontWeight:700}}>{fmt(stock)}</span>
            <span style={{color:t.text3}}> in stock</span>
            {targetStock > 0 && <>
              <span style={{color:t.text3}}>  /  target </span>
              <span style={{color:t.text,fontWeight:600}}>{fmt(targetStock)}</span>
            </>}
            {doi !== null && <span style={{color:t.text3}}> · {fmt(doi,1)}d cover</span>}
          </div>
        )}

        {/* ── Progress bar ── */}
        {hasStock && targetStock > 0 && (
          <div style={{marginBottom:10}}>
            <div style={{
              height:6,background:t.surface2,borderRadius:4,
              overflow:"hidden",marginBottom:6,
            }}>
              <div style={{
                height:"100%",width:barFill+"%",
                background:st.c,borderRadius:4,
                transition:"width .4s ease",
              }}/>
            </div>
            <span style={{
              fontSize:9,color:st.c,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600,
            }}>
              {coveragePct}% of target reached
            </span>
          </div>
        )}

        {/* ── Action line ── */}
        {hasBothData && gap !== null && (
          <div style={{
            display:"flex",
            alignItems:"center",
            justifyContent: gap <= 0 ? "flex-end" : "space-between",
            padding:"7px 10px",
            borderRadius:6,
            background:st.c+"14",
            border:`1px solid ${st.c}30`,
            marginTop:"auto",
          }}>
            {gap > 0 && (
              <span style={{
                fontSize:12,fontWeight:600,color:st.c,
              }}>⚠ Shortfall</span>
            )}
            <span style={{
              fontSize:12,fontWeight:700,
              fontFamily:"'Inter',system-ui,sans-serif",color:st.c,
            }}>
              {gap > 0
                ? `Send ${fmt(gap)} units`
                : `${fmt(Math.abs(gap))} units excess`}
            </span>
          </div>
        )}

        {/* No stock — nudge to upload ledger */}
        {!hasStock && demand30 > 0 && (
          <div style={{
            fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",
            marginTop:4,padding:"5px 8px",background:t.surface,borderRadius:6,
          }}>
            Upload Ledger CSV to see FC stock & gap
          </div>
        )}
      </div>
    );
  }

  /* ── Legend ── */
  const legendItems = [
    {label:"Stockout / Critical",c:"#e05252"},
    {label:"At Risk  60–90%",   c:"#d4912b"},
    {label:"Healthy  90–130%",  c:"#27ae60"},
    {label:"Surplus  >130%",    c:"#7c63d4"},
  ];

  return (
    <div>
      {/* Status legend */}
      <div style={{display:"flex",gap:14,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        {legendItems.map(l=>(
          <div key={l.label} style={{display:"flex",alignItems:"center",gap:5,fontSize:9,
            fontFamily:"'Inter',system-ui,sans-serif",color:t.text3}}>
            <div style={{width:8,height:8,borderRadius:2,background:l.c,flexShrink:0}}/>
            {l.label}
          </div>
        ))}
        <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
          target = demand/day × <strong style={{color:t.text}}>{coverDays}d</strong> cover
        </span>
      </div>

      {/* North — full width */}
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8,marginBottom:8}}>
        <RegBlock region="North"/>
      </div>
      {/* West | Central | East — 3 col */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:8}}>
        <RegBlock region="West"/>
        <RegBlock region="Central"/>
        <RegBlock region="East"/>
      </div>
      {/* South — full width */}
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
        <RegBlock region="South"/>
      </div>

      {/* Footer info */}
      <div style={{marginTop:8,fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",
        display:"flex",gap:12,flexWrap:"wrap"}}>
        <span>Total demand: {fmt(totalUnits)} units (30d)</span>
        {unknownUnits > 0 && <span>· Unclassified: {fmt(unknownUnits)} units</span>}
        {!hasStock && <span style={{color:t.yellow}}>· Upload Ledger to enable stock & gap analysis</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA INPUT
═══════════════════════════════════════════════════════════════ */
const DataInput = forwardRef(function DataInput({onLoaded,loading,setLoading,t,parseDebug},ref){
  const[url,setUrl]=useState("https://docs.google.com/spreadsheets/d/1Va-jdWfO2dmO6R-QCnkg9S2YqIWacx9pKfkW3Th-RGw/edit?usp=sharing");
  const[files,setFiles]=useState({inventory:null,orders:null,ledger:null,leadtime:null});
  const[names,setNames]=useState({});
  const[err,setErr]=useState(null);

  const rf=f=>new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(f);});
  const hf=(k,f)=>{setFiles(p=>({...p,[k]:f}));setNames(p=>({...p,[k]:f?.name||null}));};

  const loadCSV=async()=>{
    if(!files.inventory||!files.orders){setErr("Inventory and Orders CSV files are required");return;}
    setErr(null);setLoading(true);
    try{
      const[it,ot]=await Promise.all([rf(files.inventory),rf(files.orders)]);
      const[ir,or]=await Promise.all([parseCSV(it),parseCSV(ot)]);
      let lr=[];if(files.ledger){try{const lt=await rf(files.ledger);lr=await parseCSV(lt);}catch(_){}}
      let ltr=[];if(files.leadtime){try{const ltt=await rf(files.leadtime);ltr=await parseCSV(ltt);}catch(_){}}
      let purchr=[];if(files.purchases){try{const pt=await rf(files.purchases);purchr=await parseCSV(pt);}catch(_){}}
      const debug={
        invCols:ir[0]?Object.keys(ir[0]):[],
        ordCols:or[0]?Object.keys(or[0]):[],
        ledCols:lr[0]?Object.keys(lr[0]):[],
        ltCols:ltr[0]?Object.keys(ltr[0]):[],
        invRows:ir.length,ordRows:or.length,ledRows:lr.length,ltRows:ltr.length,
      };
      onLoaded({invRows:ir,ordRows:or,ledRows:lr,ltRows:ltr,purchRows:purchr,debug});
    }catch(e){setErr("Parse error: "+e.message);}finally{setLoading(false);}
  };

  const loadSheets=async()=>{
    const id=extractSheetId(url);
    if(!id){setErr("Invalid Google Sheets URL");return;}
    setErr(null);setLoading(true);
    const base=`https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=`;
    try{
      const ft=async(tab,required=true)=>{
        const r=await fetch(base+encodeURIComponent(tab));
        if(!r.ok){if(!required)return[];throw new Error(`Tab "${tab}" not accessible (HTTP ${r.status})`);}
        const txt=await r.text();
        if(txt.trim().startsWith("<!")){if(!required)return[];throw new Error(`Tab "${tab}" returned HTML — ensure sheet is public`);}
        return parseCSV(txt);
      };
      const[ir,or,lr,ltr,purchr,fir]=await Promise.all([ft("Inventory",true),ft("Sales",true),ft("Ledger",false),ft("Leadtime",false),ft("Purchases",false),ft("FBA_Inv",false)]);
      const debug={
        invCols:ir[0]?Object.keys(ir[0]):[],
        ordCols:or[0]?Object.keys(or[0]):[],
        ledCols:lr[0]?Object.keys(lr[0]):[],
        ltCols:ltr[0]?Object.keys(ltr[0]):[],
        invRows:ir.length,ordRows:or.length,ledRows:lr.length,ltRows:ltr.length,
        source:"sheets",
      };
      onLoaded({invRows:ir,ordRows:or,ledRows:lr,ltRows:ltr,purchRows:purchr,fbaInvRows:fir,debug});
    }catch(e){setErr("Sheets error: "+e.message);}finally{setLoading(false);}
  };

  useImperativeHandle(ref,()=>({refreshSheets:loadSheets}));

  return(
    <div style={{maxWidth:900}}>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:3}}>Load Inventory Data</div>
        <div style={{fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
          Upload CSVs or connect a public Google Sheets document with tabs: Inventory, Sales, Ledger
        </div>
      </div>
      <div className="alert ab" style={{marginBottom:12}}>
        <span>✓</span>
        <span><strong>sales logic:</strong> Counts all orders except Cancelled + Returns · Anchor = latest date in dataset · Pending orders included · </span>
      </div>
      <div className="card" style={{marginBottom:18}}>
        <div className="ch">Google Sheets — Live Connection</div>
        <div style={{fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginBottom:11}}>
          Sheet must be public. Tabs: <strong>Inventory</strong> · <strong>Sales</strong> · <strong>Ledger</strong> (optional) · <strong>Leadtime</strong> (optional)
        </div>
        <div style={{display:"flex",gap:8,marginBottom:9}}>
          <input className="ti" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://docs.google.com/spreadsheets/d/..."/>
          <button className="btn bp" onClick={loadSheets} disabled={loading}>{loading?"Fetching…":"Connect"}</button>
        </div>
        {extractSheetId(url)&&<div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>Sheet ID: {extractSheetId(url)}</div>}
      </div>
      <div className="igrid">
        {[{k:"inventory",l:"Inventory",s:"Required · ASIN, SKU, FC Sellable, FBA Available, Inbound"},
          {k:"orders",l:"Orders / Sales",s:"Required · purchase-date, asin, sku, quantity, order-status, ship-state"},
          {k:"ledger",l:"Ledger",s:"Optional · Date, ASIN, Location, Disposition, Ending Warehouse Balance"},
          {k:"leadtime",l:"Lead Time",s:"Optional · ASIN, Mode of shipment, Lead Time (Days), Shipping Time (Days), Customs (Days), Safety Stock (Days)"}].map(({k,l,s})=>(
          <div key={k} className="ic">
            <div className="icl">{l}{(k==="ledger"||k==="leadtime")&&<span style={{fontSize:9,color:t.text3,marginLeft:5}}>Optional</span>}</div>
            <div className="ics">{s}</div>
            <DropZone label={`Drop ${k}.csv`} sub="Drag & drop or click" onFile={f=>hf(k,f)} loaded={!!files[k]} fileName={names[k]}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <button className="btn bp" onClick={loadCSV} disabled={loading||!files.inventory||!files.orders}>
          {loading?"Processing…":"▶ Load & Calculate"}</button>
        {(!files.inventory||!files.orders)&&<span style={{fontSize:10,color:t.text3}}>Inventory + Orders required</span>}
      </div>
      {err&&<div className="alert ar" style={{marginTop:10}}><span>⚠</span><span>{err}</span></div>}
      {parseDebug&&<div style={{marginTop:12,background:t.surface,border:`1px solid ${t.border}`,borderRadius:10,padding:12}}>
        <div style={{fontSize:10,fontWeight:700,color:t.text3,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>
          ✅ Parse Result — Columns Detected
        </div>
        {[["Inventory",parseDebug.invCols,parseDebug.invRows],
          ["Sales/Orders",parseDebug.ordCols,parseDebug.ordRows],
          ["Ledger",parseDebug.ledCols,parseDebug.ledRows],
          ["Lead Time",parseDebug.ltCols||[],parseDebug.ltRows||0]].map(([lbl,cols,cnt])=>(
          <div key={lbl} style={{marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:t.accent,marginBottom:3}}>{lbl} — {cnt} rows</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {cols.length===0
                ?<span style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>No data / not loaded</span>
                :cols.map(c=>{
                  const important=["ASIN","FBA Available","FC Sellable","Inbound","order-status","purchase-date","asin","quantity","Location","Disposition","Ending Warehouse Balance","ship-state","ship-city","Mode of shipment","Lead Time (Days)","Shipping Time (Days)","Customs (Days)","Safety Stock (Days)"].includes(c);
                  return<span key={c} style={{fontSize:9,padding:"2px 6px",borderRadius:4,fontFamily:"'Inter',system-ui,sans-serif",
                    background:important?t.greenBg:t.surface2,color:important?t.green:t.text3,
                    border:`1px solid ${important?t.greenBdr:t.border}`}}>{c}</span>;
                })
              }
            </div>
          </div>
        ))}
        <div style={{fontSize:9,color:t.text3,marginTop:4,fontFamily:"'Inter',system-ui,sans-serif"}}>
          Green = key columns. <strong>ship-state</strong> + <strong>ship-city</strong> needed for regional heatmap &amp; city breakdown. <strong>Leadtime</strong> tab needed for Procurement Forecast.
        </div>
      </div>}
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════
   SETTINGS BAR — sticky, recalculates on mouse release
═══════════════════════════════════════════════════════════════ */
function SBar({settings,setSettings,t,isTop}){
  const[local,setLocal]=useState(settings);
  useEffect(()=>setLocal(settings),[settings]);
  const onMove=(k,v)=>setLocal(p=>({...p,[k]:v}));
  const onRelease=(k,v)=>setSettings(p=>({...p,[k]:v}));
  const sliders=[
    ["totalLeadTime","Additional Lead Time",0,60,"d","Extra buffer days added on top of Excel lead time (default 0)"],
    ["safetyDays","Safety Stock",0,100,"d","Trigger reorder when remaining stock falls below this many days"],
    ["fbaCoverDays","FBA Cover Days",0,100,"d","Target days of stock to keep in FBA"],
  ];
  return(
    <div className={`sbar${isTop?" sbar-top":""}`}>
      <div className="sg">
        {sliders.map(([k,l,min,max,unit,tip])=>(
          <div key={k} className="slg">
            <label title={tip}>{l}<span>{local[k]}{unit}</span></label>
            <input type="range" min={min} max={max} value={local[k]}
              onChange={e=>onMove(k,+e.target.value)}
              onMouseUp={e=>onRelease(k,+e.target.value)}
              onTouchEnd={e=>onRelease(k,+e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="sbar-info">
        Reorder Point: <strong>Sea LT + {local.safetyDays}d safety</strong>
        &nbsp;·&nbsp; Additional Delay: <strong>+{local.totalLeadTime}d</strong>
        &nbsp;·&nbsp; Target FBA: <strong>{local.fbaCoverDays}d cover</strong>
        &nbsp;·&nbsp; Demand: weighted avg (7d×0.5 + 14d×0.3 + 30d×0.2)
        &nbsp;·&nbsp;
        <label style={{cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox"
            checked={local.inclFBA!==false}
            onChange={e=>{const v=e.target.checked;onMove("inclFBA",v);onRelease("inclFBA",v);}}
            style={{marginRight:4,accentColor:"currentColor"}}
          />Include FBA
        </label>
        &nbsp;&nbsp;
        <label style={{cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox"
            checked={local.inclTransfer!==false}
            onChange={e=>{const v=e.target.checked;onMove("inclTransfer",v);onRelease("inclTransfer",v);}}
            style={{marginRight:4,accentColor:"currentColor"}}
          />Include FC Transfer
        </label>
        &nbsp;&nbsp;
        <label style={{cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox"
            checked={local.inclFC!==false}
            onChange={e=>{const v=e.target.checked;onMove("inclFC",v);onRelease("inclFC",v);}}
            style={{marginRight:4,accentColor:"currentColor"}}
          />Include FC
        </label>
        &nbsp;&nbsp;
        <label style={{cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox"
            checked={local.inclInbound!==false}
            onChange={e=>{const v=e.target.checked;onMove("inclInbound",v);onRelease("inclInbound",v);}}
            style={{marginRight:4,accentColor:"currentColor"}}
          />Include Inbound
        </label>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function InventoryHealthBar({skus, t}) {
  const total = skus.length || 1;
  const data = [
    {label:"Critical",      count:skus.filter(d=>d.planning.priority==="critical").length,                                           color:t.red},
    {label:"High Priority", count:skus.filter(d=>d.planning.priority==="high"&&d.planning.action!=="OVERSTOCK").length,              color:t.yellow},
    {label:"Healthy",       count:skus.filter(d=>d.planning.priority==="low"&&d.planning.action!=="OVERSTOCK"&&d.velocity.demand>0).length, color:t.green},
    {label:"Overstock",     count:skus.filter(d=>d.planning.action==="OVERSTOCK").length,                                           color:t.purple},
    {label:"No Demand",     count:skus.filter(d=>d.velocity.demand===0).length,                                                     color:t.text3},
  ].filter(d=>d.count>0);

  return(
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{top:4,right:50,left:0,bottom:4}}>
          <CartesianGrid strokeDasharray="2 4" stroke={t.border} horizontal={false}/>
          <XAxis type="number" tick={{fill:t.text3,fontSize:11}} axisLine={false} tickLine={false}/>
          <YAxis type="category" dataKey="label" width={90} tick={{fill:t.text2,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}} axisLine={false} tickLine={false}/>
          <Tooltip
            contentStyle={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}
            formatter={(v,_,{payload})=>[`${v} SKUs (${Math.round(v/total*100)}%)`,payload.label]}
            cursor={{fill:`${t.accent}08`}}
          />
          <Bar dataKey="count" radius={[0,4,4,0]} maxBarSize={20}>
            {data.map((d,i)=><Cell key={i} fill={d.color} fillOpacity={.82}/>)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:4}}>
        {data.map(d=>(
          <span key={d.label} style={{display:"flex",alignItems:"center",gap:4,fontSize:9,fontFamily:"'Inter',system-ui,sans-serif",color:t.text3}}>
            <span style={{width:7,height:7,borderRadius:2,background:d.color,display:"inline-block",opacity:.85}}/>
            {d.label} <strong style={{color:d.color}}>{d.count}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

function Dashboard({data,settings,setSettings,onSku,t}){
  const skus=Object.values(data);
  const crit=skus.filter(d=>d.planning.priority==="critical").length;
  const high=skus.filter(d=>d.planning.priority==="high").length;
  const over=skus.filter(d=>d.planning.action==="OVERSTOCK").length;
  const totalStock=skus.reduce((s,d)=>s+d.currentStock,0);
  const totalDemand=skus.reduce((s,d)=>s+d.velocity.demand,0);
  const withFC=skus.filter(d=>d.hasFCData).length;

  const [alertSort,setAlertSort]=useState({col:"score",dir:"desc"});

  const alerts=useMemo(()=>{
    const base=skus.filter(d=>d.planning.priority==="critical"||d.planning.priority==="high");
    const {col,dir}=alertSort;
    const m=dir==="asc"?1:-1;
    return base.sort((a,b)=>{
      if(col==="sku") return m*(a.finalName.localeCompare(b.finalName));
      if(col==="doi") return m*((isFinite(a.planning.doi)?a.planning.doi:9999)-(isFinite(b.planning.doi)?b.planning.doi:9999));
      if(col==="stock") return m*(a.currentStock-b.currentStock);
      if(col==="demand") return m*(a.velocity.demand-b.velocity.demand);
      return m*(b.planning.displayScore-a.planning.displayScore); // score default
    }).slice(0,10);
  },[skus,alertSort]);

  function SortTh({col,label,style={}}){
    const active=alertSort.col===col;
    return(
      <th style={{cursor:"pointer",userSelect:"none",...style}}
        onClick={()=>setAlertSort(s=>({col,dir:s.col===col&&s.dir==="asc"?"desc":"asc"}))}>
        {label}{active?(alertSort.dir==="asc"?" ▲":" ▼"):""}
      </th>
    );
  }

  const topD=useMemo(()=>skus.filter(d=>d.velocity.demand>0)
    .sort((a,b)=>b.velocity.demand-a.velocity.demand).slice(0,8)
    .map(d=>({name:d.finalName.substring(0,14)+(d.finalName.length>14?"…":""),demand:+d.velocity.demand.toFixed(2),asin:d.asin})),[skus]);

  const atRisk=useMemo(()=>skus
    .filter(d=>d.velocity.demand>0&&isFinite(d.planning.doi)&&d.planning.doi<9999)
    .sort((a,b)=>a.planning.doi-b.planning.doi).slice(0,10)
    .map(d=>({
      name:d.finalName.substring(0,18)+(d.finalName.length>18?"…":""),
      doi:+d.planning.doi.toFixed(1),
      asin:d.asin,
      priority:d.planning.priority,
    })),[skus]);

  function doiBarColor(priority) {
    return priority==="critical"?t.red:priority==="high"?t.yellow:t.green;
  }

  return(<div>
    <SBar settings={settings} setSettings={setSettings} t={t}/>

    {/* KPI cards */}
    <div className="kg" style={{marginBottom:12}}>
      {[
        {l:"Total SKUs",    v:skus.length,        s:"Mapped & active",    c:""},
        {l:"Total Stock",   v:fmt(totalStock),     s:"FC + FBA + Inbound", c:""},
        {l:"Daily Demand",  v:fmt(totalDemand,0),  s:"Weighted avg/day",   c:""},
        {l:"Critical",      v:crit,                s:"Immediate action",   c:"r"},
        {l:"High Priority", v:high,                s:"Purchase required",  c:"y"},
        {l:"Overstock",     v:over,                s:"Excess inventory",   c:"p"},
        {l:"FC Coverage",   v:withFC,              s:"ASINs with ledger",  c:"b"},
      ].map(k=>(
        <div key={k.l} className={`kc ${k.c}`}>
          <div className="kl">{k.l}</div>
          <div className="kv" style={{color:k.c==="r"?t.red:k.c==="y"?t.yellow:k.c==="p"?t.purple:k.c==="b"?t.accent:t.text}}>{k.v}</div>
          <div className="ks">{k.s}</div>
        </div>
      ))}
    </div>

    {/* Chart row 1: Inventory Health + Most at Risk */}
    <div className="d2" style={{marginBottom:10}}>
      <div className="card">
        <div className="ch">Inventory Health</div>
        <InventoryHealthBar skus={skus} t={t}/>
      </div>
      <div className="card">
        <div className="ch">Most at Risk — Lowest Days of Inventory</div>
        {atRisk.length>0?(
          <ResponsiveContainer width="100%" height={220}>
            <BarChart layout="vertical" data={atRisk} margin={{top:0,right:40,left:0,bottom:0}}
              onClick={e=>e?.activePayload&&onSku(e.activePayload[0]?.payload?.asin)}
              style={{cursor:"pointer"}}>
              <CartesianGrid strokeDasharray="2 4" stroke={t.border} horizontal={false}/>
              <XAxis type="number" tick={{fill:t.text3,fontSize:11}} unit="d" axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" width={130} tick={{fill:t.text2,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}} axisLine={false} tickLine={false}/>
              <Tooltip
                contentStyle={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}
                formatter={v=>[`${v}d`,`Days of Inventory`]}
                cursor={{fill:`${t.accent}08`}}
              />
              <Bar dataKey="doi" radius={[0,4,4,0]} maxBarSize={18}>
                {atRisk.map((e,i)=>(
                  <Cell key={i} fill={doiBarColor(e.priority)} fillOpacity={.8}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ):(
          <div style={{padding:"30px 0",textAlign:"center",fontSize:11,color:t.text3}}>No active SKUs with demand data</div>
        )}
      </div>
    </div>

    {/* Chart row 2: Top demand */}
    {topD.length>0&&<div className="card" style={{marginBottom:10}}>
      <div className="ch">Top 8 by Weighted Daily Demand</div>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={topD} margin={{top:4,right:12,left:0,bottom:50}}
          onClick={e=>e?.activePayload&&onSku(e.activePayload[0]?.payload?.asin)}
          style={{cursor:"pointer"}}>
          <CartesianGrid strokeDasharray="2 4" stroke={t.border} vertical={false}/>
          <XAxis dataKey="name" tick={{fill:t.text3,fontSize:9,fontFamily:"'Inter',system-ui,sans-serif"}} angle={-35} textAnchor="end" axisLine={false} tickLine={false}/>
          <YAxis tick={{fill:t.text3,fontSize:11}} axisLine={false} tickLine={false}/>
          <Tooltip
            contentStyle={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}
            formatter={v=>[`${v} u/day`,"Demand"]}
            cursor={{fill:`${t.accent}08`}}
          />
          <Bar dataKey="demand" fill={t.accent} fillOpacity={.75} radius={[3,3,0,0]} maxBarSize={36}/>
        </BarChart>
      </ResponsiveContainer>
    </div>}

    {/* Priority Alerts table */}
    {alerts.length>0&&<div className="card">
      <div className="ch">Priority Alerts</div>
      <div className="tw ts"><table>
        <thead><tr>
          <SortTh col="sku" label="SKU" style={{textAlign:"left"}}/>
          <th>ASIN</th>
          <SortTh col="doi" label="DOI"/>
          <SortTh col="stock" label="Stock"/>
          <SortTh col="demand" label="Demand/Day"/>
          <th>7D Total</th><th>Stockout</th><th>Action</th>
        </tr></thead>
        <tbody>{alerts.map(d=>(
          <tr key={d.asin} className="cr" onClick={()=>onSku(d.asin)}>
            <td><div className="tn">{d.finalName}</div><div className="ta">{d.sellerSku}</div></td>
            <td className="ta">{d.asin}</td>
            <td><DOI doi={d.planning.doi} t={t}/></td>
            <td>{fmt(d.currentStock)}</td>
            <td>{fmt(d.velocity.demand,2)}</td>
            <td style={{color:t.accent,fontWeight:700}}>{fmt(d.velocity.raw7)}</td>
            <td style={{color:t.red}}>{fmtDate(d.planning.stockoutDate)}</td>
            <td><PBadge action={d.planning.action} priority={d.planning.priority} purchasePct={d.planning.purchasePct||0} replenishPct={d.planning.replenishPct||0} t={t}/></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>}
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   ALL SKUs
═══════════════════════════════════════════════════════════════ */
function AllSKUs({data,settings,setSettings,onSku,t}){
  const[q,setQ]=useState(""),[fil,setFil]=useState("all");
  const[sort,setSort]=useState({col:"doi",dir:"asc"});
  const[picked,setPicked]=useState(()=>new Set());
  function togglePick(asin,e){e.stopPropagation();setPicked(prev=>{const nx=new Set(prev);nx.has(asin)?nx.delete(asin):nx.add(asin);return nx;});}

  function toggleSort(col){
    setSort(s=>({col,dir:s.col===col&&s.dir==="asc"?"desc":"asc"}));
  }
  function SortTh({col,label,style={}}){
    const active=sort.col===col;
    return(
      <th style={{cursor:"pointer",userSelect:"none",...style}}
        onClick={()=>toggleSort(col)}>
        {label}{active?(sort.dir==="asc"?" ▲":" ▼"):""}
      </th>
    );
  }

  const skus=useMemo(()=>{
    const base=Object.values(data)
      .filter(d=>fil==="critical"?d.planning.priority==="critical":fil==="high"?d.planning.priority==="high":fil==="over"?d.planning.action==="OVERSTOCK":fil==="ok"?d.planning.priority==="low":true)
      .filter(d=>!q||d.finalName.toLowerCase().includes(q.toLowerCase())||d.asin.includes(q)||d.sellerSku.toLowerCase().includes(q.toLowerCase()));
    const {col,dir}=sort;
    const m=dir==="asc"?1:-1;
    return base.sort((a,b)=>{
      if(col==="sku")    return m*a.finalName.localeCompare(b.finalName);
      if(col==="stock")  return m*(a.currentStock-b.currentStock);
      if(col==="fba")    return m*(a.fbaAvailable-b.fbaAvailable);
      if(col==="fc")     return m*(a.fcSellable-b.fcSellable);
      if(col==="demand") return m*(a.velocity.demand-b.velocity.demand);
      if(col==="doi")    return m*((isFinite(a.planning.doi)?a.planning.doi:99999)-(isFinite(b.planning.doi)?b.planning.doi:99999));
      if(col==="buy")    return m*(a.planning.suggestedPurchase-b.planning.suggestedPurchase);
      if(col==="replen") return m*(a.planning.replenishQty-b.planning.replenishQty);
      // default: priority score
      return m*(b.planning.displayScore-a.planning.displayScore);
    });
  },[data,q,sort,fil]);

  return(<div>
    <SBar settings={settings} setSettings={setSettings} t={t}/>
    <div className="card">
      <div className="srow">
        <div className="sbox"><span style={{color:t.text3}}>⌕</span><input placeholder="Name, ASIN, SKU…" value={q} onChange={e=>setQ(e.target.value)}/></div>
        <select className="sel" value={fil} onChange={e=>setFil(e.target.value)}>
          <option value="all">All SKUs</option><option value="critical">Critical</option>
          <option value="high">High Priority</option><option value="ok">OK</option><option value="over">Overstock</option>
        </select>
        {picked.size>0&&<span style={{fontSize:9,color:t.accent,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:700}}>{picked.size} selected</span>}
        {picked.size>0&&<button className="btn bs" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>setPicked(new Set())}>Deselect All</button>}
        <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>{skus.length}/{Object.keys(data).length}</span>
      </div>
      {picked.size>0&&(
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",padding:"7px 10px",marginBottom:8,background:t.accentBg,border:`1px solid ${t.accentBdr}`,borderRadius:6}}>
          <span style={{fontSize:9,fontWeight:700,color:t.accent,fontFamily:"'Inter',system-ui,sans-serif"}}>Selected:</span>
          {skus.filter(d=>picked.has(d.asin)).map(d=>(
            <span key={d.asin} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:10,color:t.text,background:t.surface,border:`1px solid ${t.border2}`,borderRadius:4,padding:"2px 7px",fontFamily:"'Inter',system-ui,sans-serif"}}>
              {d.finalName}
              <span style={{cursor:"pointer",color:t.text3}} onClick={()=>setPicked(prev=>{const nx=new Set(prev);nx.delete(d.asin);return nx;})}>✕</span>
            </span>
          ))}
        </div>
      )}
      <div className="tw ts"><table style={{fontSize:11}}>
        <thead><tr>
          <th style={{width:28}}></th>
          <SortTh col="sku" label="SKU Name" style={{textAlign:"left"}}/>
          <th style={{textAlign:"left"}}>ASIN</th>
          <th>Trend</th>
          <SortTh col="demand" label="W.Demand"/>
          <SortTh col="stock" label="Stock"/>
          <SortTh col="fba" label="FBA"/>
          <SortTh col="fc" label="FC"/>
          <th>Inbound</th>
          <SortTh col="doi" label="DOI"/>
          <th>Stockout</th>
          <SortTh col="buy" label="Buy Qty"/>
          <SortTh col="replen" label="Replenish"/>
          <th>Status</th>
        </tr></thead>
        <tbody>{skus.map(d=>(
          <tr key={d.asin} className="cr" onClick={()=>onSku(d.asin)} style={picked.has(d.asin)?{background:t.accentBg}:undefined}>
            <td onClick={e=>togglePick(d.asin,e)}><input type="checkbox" checked={picked.has(d.asin)} onChange={()=>{}} style={{cursor:"pointer"}}/></td>
            <td style={{textAlign:"left"}}><div className="tn">{d.finalName}</div><div className="ta">{d.sellerSku}</div></td>
            <td style={{textAlign:"left"}} className="ta">{d.asin}</td>
            <td><span style={{fontSize:10,color:trendColor(calcTrend(d.velocity.avg7,d.velocity.avg30),t),fontFamily:"'Inter',system-ui,sans-serif",whiteSpace:"nowrap"}}>{calcTrend(d.velocity.avg7,d.velocity.avg30)}</span></td>
            <td style={{fontWeight:700,color:t.text}}>{fmt(d.velocity.demand,2)}</td>
            <td>{fmt(d.currentStock)}</td><td>{fmt(d.fbaAvailable)}</td><td>{fmt(d.fcSellable)}</td><td>{fmt(d.inbound)}</td>
            <td><DOI doi={d.planning.doi} t={t}/></td>
            <td style={{color:d.planning.doi<30?t.red:t.text3}}>{fmtDate(d.planning.stockoutDate)}</td>
            <td style={{color:t.accent,fontWeight:700}}>{d.planning.suggestedPurchase>0?fmt(d.planning.suggestedPurchase):"—"}</td>
            <td style={{color:t.yellow,fontWeight:700}}>{d.planning.replenishQty>0?fmt(d.planning.replenishQty):"—"}</td>
            <td><PBadge action={d.planning.action} priority={d.planning.priority} purchasePct={d.planning.purchasePct||0} replenishPct={d.planning.replenishPct||0} t={t}/></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  </div>);
}









/* ═══════════════════════════════════════════════════════════════
   FC VIEW — WAREHOUSE FIRST
   Each warehouse card lists all SKUs inside it with stock levels.
   Sorted by worst status. Collapsible. Click SKU row → SKU detail.
═══════════════════════════════════════════════════════════════ */
function FCView({data,settings,setSettings,onSku,t}){
  const[q,setQ]=useState(""),[fil,setFil]=useState("all");
  const[expanded,setExpanded]=useState(new Set());

  const FC_STATUS_COLOR={stockout:t.red,critical:t.red,low:t.yellow,ok:t.green,surplus:t.purple};
  const FC_STATUS_LABEL={stockout:"STOCKOUT",critical:"CRITICAL",low:"LOW",ok:"OK",surplus:"SURPLUS"};
  const STATUS_RANK={stockout:0,critical:1,low:2,ok:3,surplus:4};

  // Invert data structure: FC code → list of SKUs
  const warehouses=useMemo(()=>{
    const map={};
    Object.values(data).forEach(d=>{
      if(!d.fcPlanning) return;
      d.fcPlanning.fcs.forEach(fc=>{
        if(fc.stock===0&&fc.demand===0&&fc.unsellable===0&&fc.inTransit===0) return;
        if(!map[fc.fc]) map[fc.fc]={code:fc.fc,label:fc.label,skus:[],totalStock:0,totalUnsellable:0,totalInTransit:0};
        map[fc.fc].skus.push({
          asin:d.asin,name:d.finalName,sellerSku:d.sellerSku,
          stock:fc.stock,demand:fc.demand,doi:fc.doi,
          status:fc.status,unsellable:fc.unsellable,inTransit:fc.inTransit,
        });
        map[fc.fc].totalStock+=fc.stock;
        map[fc.fc].totalUnsellable+=fc.unsellable;
        map[fc.fc].totalInTransit+=fc.inTransit;
      });
    });
    Object.values(map).forEach(wh=>{
      wh.skus.sort((a,b)=>(STATUS_RANK[a.status]??3)-(STATUS_RANK[b.status]??3));
      wh.worstStatus=wh.skus.reduce((w,s)=>(STATUS_RANK[s.status]??3)<(STATUS_RANK[w]??3)?s.status:w,"ok");
      wh.critCount=wh.skus.filter(s=>s.status==="critical"||s.status==="stockout").length;
      wh.lowCount=wh.skus.filter(s=>s.status==="low").length;
    });
    return Object.values(map)
      .sort((a,b)=>(STATUS_RANK[a.worstStatus]??3)-(STATUS_RANK[b.worstStatus]??3));
  },[data]);

  const filtered=useMemo(()=>warehouses
    .filter(wh=>
      fil==="critical"?(wh.worstStatus==="critical"||wh.worstStatus==="stockout"):
      fil==="low"?wh.worstStatus==="low":true)
    .filter(wh=>!q||wh.code.toLowerCase().includes(q.toLowerCase())||wh.label.toLowerCase().includes(q.toLowerCase()))
  ,[warehouses,q,fil]);

  const critWH=warehouses.filter(w=>w.worstStatus==="critical"||w.worstStatus==="stockout").length;
  const lowWH=warehouses.filter(w=>w.worstStatus==="low").length;
  const totalStockAll=warehouses.reduce((s,w)=>s+w.totalStock,0);

  function toggleCollapse(code){
    setExpanded(prev=>{const next=new Set(prev);next.has(code)?next.delete(code):next.add(code);return next;});
  }

  return(<div>
    <SBar settings={settings} setSettings={setSettings} t={t}/>

    <div className="kg" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:12}}>
      {[
        {l:"Fulfilment Centres",v:warehouses.length,s:"With ledger data",c:"b"},
        {l:"Critical FCs",v:critWH,s:"Near stockout",c:"r"},
        {l:"Low Stock FCs",v:lowWH,s:"Below cover target",c:"y"},
        {l:"Total FC Stock",v:fmt(totalStockAll),s:"Units across all FCs",c:""},
      ].map(k=>(
        <div key={k.l} className={`kc ${k.c}`}>
          <div className="kl">{k.l}</div>
          <div className="kv" style={{color:k.c==="b"?t.accent:k.c==="r"?t.red:k.c==="y"?t.yellow:t.text}}>{k.v}</div>
          <div className="ks">{k.s}</div>
        </div>
      ))}
    </div>

    <div className="srow" style={{marginBottom:10}}>
      <div className="sbox">
        <span style={{color:t.text3}}>⌕</span>
        <input placeholder="FC code or city…" value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      <select className="sel" value={fil} onChange={e=>setFil(e.target.value)}>
        <option value="all">All Warehouses ({warehouses.length})</option>
        <option value="critical">Critical / Stockout ({critWH})</option>
        <option value="low">Low Stock ({lowWH})</option>
      </select>
      <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
        {filtered.length} of {warehouses.length} warehouses
      </span>
    </div>

    {warehouses.length===0&&(
      <div className="empty">
        <div className="empty-ic">🏭</div>
        <h3>No Ledger Data</h3>
        <p>Upload a Ledger CSV or add a Ledger tab to your Google Sheet<br/>to see per-warehouse stock levels.</p>
      </div>
    )}

    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {filtered.map(wh=>{
        const wc=FC_STATUS_COLOR[wh.worstStatus]||t.green;
        const isOpen=expanded.has(wh.code);
        return(
          <div key={wh.code} className="fc-card" style={{borderLeft:`2px solid ${wc}`}}>

            {/* ── Warehouse header ── */}
            <div className="fc-card-hdr" style={{cursor:"pointer"}} onClick={()=>toggleCollapse(wh.code)}>
              {/* Status dot */}
              <div style={{
                width:7,height:7,borderRadius:"50%",background:wc,flexShrink:0,
              }}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:600,color:t.text,letterSpacing:"-.1px"}}>{wh.label}</div>
                <div style={{fontSize:12,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginTop:3}}>
                  {wh.code}
                  &nbsp;·&nbsp;{wh.skus.length} SKU{wh.skus.length!==1?"s":""}
                  &nbsp;·&nbsp;<span style={{color:t.text2}}>{fmt(wh.totalStock)} sellable</span>
                  {wh.totalUnsellable>0&&<>&nbsp;·&nbsp;<span style={{color:t.yellow}}>{fmt(wh.totalUnsellable)} unsellable</span></>}
                  {wh.totalInTransit>0&&<>&nbsp;·&nbsp;<span style={{color:t.accent}}>{fmt(wh.totalInTransit)} in-transit</span></>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                {wh.critCount>0&&(
                  <span style={{fontSize:12,fontWeight:600,color:t.red,display:"flex",alignItems:"center",gap:5}}>
                    <span className="dot r"></span>{wh.critCount} critical
                  </span>
                )}
                {wh.lowCount>0&&wh.critCount===0&&(
                  <span style={{fontSize:12,fontWeight:600,color:t.yellow,display:"flex",alignItems:"center",gap:5}}>
                    <span className="dot y"></span>{wh.lowCount} low
                  </span>
                )}
                <span style={{fontSize:12,fontWeight:500,color:wc,display:"flex",alignItems:"center",gap:5}}>
                  <span className="dot" style={{background:wc}}></span>{FC_STATUS_LABEL[wh.worstStatus]}
                </span>
                <span style={{
                  fontSize:11,color:t.text3,lineHeight:1,
                  display:"inline-block",
                  transform:isOpen?"rotate(0deg)":"rotate(-90deg)",
                  transition:"transform .18s",
                }}>▾</span>
              </div>
            </div>

            {/* ── SKU table (collapsible) ── */}
            {isOpen&&(
              <div className="tw" style={{maxHeight:340,overflowY:"auto"}}>
                <table>
                  <thead><tr>
                    <th style={{minWidth:180}}>SKU</th>
                    <th style={{textAlign:"right"}}>Sellable</th>
                    <th style={{textAlign:"right"}}>Demand / d</th>
                    <th style={{textAlign:"right"}}>DOI</th>
                    <th style={{textAlign:"right"}}>Unsellable</th>
                    <th style={{textAlign:"right"}}>In-Transit</th>
                    <th>Status</th>
                  </tr></thead>
                  <tbody>
                    {wh.skus.map(sku=>{
                      const sc=FC_STATUS_COLOR[sku.status]||t.green;
                      return(
                        <tr key={sku.asin} className="cr" onClick={e=>{e.stopPropagation();onSku(sku.asin);}}>
                          <td>
                            <div style={{fontWeight:600,color:t.text,fontSize:12,
                              maxWidth:210,overflow:"hidden",textOverflow:"ellipsis"}}>{sku.name}</div>
                            <div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginTop:2}}>{sku.asin}</div>
                          </td>
                          <td style={{textAlign:"right",fontWeight:700,
                            color:sku.stock>0?t.text:t.red}}>{fmt(sku.stock)}</td>
                          <td style={{textAlign:"right",color:t.text2}}>
                            {sku.demand>0?fmt(sku.demand,2):"—"}
                          </td>
                          <td style={{textAlign:"right"}}>
                            {sku.demand>0
                              ?<span style={{color:sc,fontWeight:700}}>
                                {isFinite(sku.doi)?fmt(sku.doi,1)+"d":"∞"}
                              </span>
                              :<span style={{color:t.text3}}>—</span>}
                          </td>
                          <td style={{textAlign:"right",color:sku.unsellable>0?t.yellow:t.text3}}>
                            {sku.unsellable>0?fmt(sku.unsellable):"—"}
                          </td>
                          <td style={{textAlign:"right",color:sku.inTransit>0?t.accent:t.text3}}>
                            {sku.inTransit>0?fmt(sku.inTransit):"—"}
                          </td>
                          <td>
                            <span style={{fontSize:12,fontWeight:500,color:sc,display:"inline-flex",alignItems:"center",gap:5}}>
                              <span className="dot" style={{background:sc}}></span>{FC_STATUS_LABEL[sku.status]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   LIS — Send-Stock Recommendation List
   Flat list of SKU × FC, sourced from fcPlanning.recommendations
   Same logic as SKUDetail send-stock section. Sorted by DOI asc.
═══════════════════════════════════════════════════════════════ */
function LISView({data, settings, setSettings, onSku, t}) {
  const [q, setQ]           = useState("");
  const [filSt, setFilSt]   = useState("actionable");
  const [sortCol, setSortCol] = useState("status");
  const [sortDir, setSortDir] = useState(1); // 1=asc, -1=desc

  const FC_STATUS_COLOR = {stockout:t.red,critical:t.red,low:t.yellow,ok:t.green,surplus:t.purple};
  const STATUS_RANK     = {stockout:0,critical:1,low:2,ok:3,surplus:4};
  const TREND_RANK      = {"▲▲ Strong Up":0,"▲ Rising":1,"↗ Slight Up":2,"→ Stable":3,"↘ Slight Down":4,"▼ Falling":5,"▼▼ Strong Down":6,"—":7};

  function toggleSort(col) {
    setSortCol(prev => {
      if (prev === col) { setSortDir(d => d * -1); return col; }
      setSortDir(1); return col;
    });
  }

  const rows = useMemo(() => {
    const out = [];
    Object.values(data).forEach(d => {
      if (!d.fcPlanning) return;
      const vel   = d.velocity;
      const trend = calcTrend(vel?.avg7, vel?.avg30);
      d.fcPlanning.recommendations.forEach(r => {
        if (r.needed <= 0) return;
        const fcEntry = d.fcPlanning.fcs.find(f => f.fc === r.fc);
        out.push({
          asin:    d.asin,
          name:    d.finalName,
          fc:      r.fc,
          fcLabel: r.label,
          demand:  r.demand,
          fcStock: fcEntry?.stock ?? 0,
          doi:     r.doi,
          status:  r.status,
          sendQty: r.needed,
          trend,
        });
      });
    });
    return out;
  }, [data]);

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a,b) => {
      let va, vb;
      if (sortCol === "status") {
        va = STATUS_RANK[a.status] ?? 3;
        vb = STATUS_RANK[b.status] ?? 3;
        if (va === vb) { // secondary: doi asc
          const ad = isFinite(a.doi)?a.doi:1e9, bd = isFinite(b.doi)?b.doi:1e9;
          return ad - bd;
        }
        return (va - vb) * sortDir;
      }
      if (sortCol === "doi") {
        va = isFinite(a.doi)?a.doi:1e9;
        vb = isFinite(b.doi)?b.doi:1e9;
      } else if (sortCol === "demand") { va=a.demand; vb=b.demand; }
      else if (sortCol === "fcStock")  { va=a.fcStock; vb=b.fcStock; }
      else if (sortCol === "sendQty")  { va=a.sendQty; vb=b.sendQty; }
      else if (sortCol === "trend")    { va=TREND_RANK[a.trend]??7; vb=TREND_RANK[b.trend]??7; }
      else if (sortCol === "name")     { return sortDir*a.name.localeCompare(b.name); }
      else if (sortCol === "fc")       { return sortDir*a.fc.localeCompare(b.fc); }
      else { va=0; vb=0; }
      return (va - vb) * sortDir;
    });
    return arr;
  }, [rows, sortCol, sortDir]);

  const filtered = useMemo(() => {
    let r = filSt === "all" ? sorted : sorted.filter(x => x.status==="stockout"||x.status==="critical"||x.status==="low");
    if (q) {
      const lq = q.toLowerCase();
      r = r.filter(x =>
        x.name.toLowerCase().includes(lq)||
        x.asin.toLowerCase().includes(lq)||
        x.fc.toLowerCase().includes(lq)||
        x.fcLabel.toLowerCase().includes(lq)
      );
    }
    return r;
  }, [sorted, filSt, q]);

  const totalSend = filtered.reduce((s,r)=>s+r.sendQty,0);
  const critCount = rows.filter(r=>r.status==="stockout"||r.status==="critical").length;
  const lowCount  = rows.filter(r=>r.status==="low").length;

  function SortTh({col, label, minW}) {
    const active = sortCol === col;
    const arrow  = active ? (sortDir===1?"↑":"↓") : "";
    return (
      <th onClick={()=>toggleSort(col)} style={{
        padding:"0 12px",height:40,fontSize:12,fontWeight:600,
        color:active?t.accent:t.text3,
        background:t.surface,
        textAlign:"left",whiteSpace:"nowrap",cursor:"pointer",
        userSelect:"none",minWidth:minW||undefined,
        borderBottom:active?`2px solid ${t.accent}`:`1px solid ${t.border}`,
      }}>
        {label}{active&&<span style={{marginLeft:4,fontSize:10}}>{arrow}</span>}
      </th>
    );
  }

  const TD = {padding:"0 12px",height:54,borderBottom:`1px solid ${t.border}`,verticalAlign:"middle"};

  return (
    <div>
      <SBar settings={settings} setSettings={setSettings} t={t}/>

      <div className="kg" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:12}}>
        {[
          {l:"Total Recommendations",v:rows.length,   s:"FC × SKU needing stock",c:"b"},
          {l:"Critical / Stockout",  v:critCount,     s:"Immediate action",      c:"r"},
          {l:"Low Stock",            v:lowCount,      s:"Below cover target",    c:"y"},
          {l:"Total Units to Send",  v:fmt(totalSend),s:"Across filtered rows",  c:""},
        ].map(k=>(
          <div key={k.l} className={`kc ${k.c}`}>
            <div className="kl">{k.l}</div>
            <div className="kv" style={{color:k.c==="b"?t.accent:k.c==="r"?t.red:k.c==="y"?t.yellow:t.text}}>{k.v}</div>
            <div className="ks">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="srow" style={{marginBottom:10}}>
        <div className="sbox">
          <span style={{color:t.text3}}>⌕</span>
          <input placeholder="SKU, ASIN or FC…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="sel" value={filSt} onChange={e=>setFilSt(e.target.value)}>
          <option value="actionable">Critical + Low ({critCount+lowCount})</option>
          <option value="all">All ({rows.length})</option>
        </select>
        <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
          {filtered.length} rows · click header to sort
        </span>
      </div>

      {rows.length === 0 && (
        <div className="empty">
          <div className="empty-ic">📦</div>
          <h3>No FC Data</h3>
          <p>Upload a Ledger CSV or add a Ledger tab to see FC-level send-stock recommendations.</p>
        </div>
      )}

      {rows.length > 0 && (
        <div className="tw">
          <table style={{minWidth:820,width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr>
                <SortTh col="name"    label="SKU"              minW={200}/>
                <SortTh col="fc"      label="APOB / FC"        minW={130}/>
                <SortTh col="demand"  label="Demand/d"/>
                <SortTh col="fcStock" label="FC Stock"/>
                <SortTh col="doi"     label="DOI"/>
                <SortTh col="trend"   label="Trend"/>
                <SortTh col="status"  label="Status"/>
                <SortTh col="sendQty" label="Send Recommendation" minW={210}/>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r,i)=>{
                const sc = FC_STATUS_COLOR[r.status]||t.green;
                const tc = trendColor(r.trend, t);
                return (
                  <tr key={`${r.asin}-${r.fc}-${i}`} className="cr"
                    style={{background:i%2===0?"transparent":t.surface+"18"}}
                    onClick={()=>onSku(r.asin)}>
                    <td style={TD}>
                      <div style={{fontWeight:600,color:t.text,fontSize:12,maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.name}</div>
                      <div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginTop:2}}>{r.asin}</div>
                    </td>
                    <td style={TD}>
                      <div style={{fontWeight:700,color:t.accent,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}}>{r.fc}</div>
                      <div style={{fontSize:9,color:t.text3,marginTop:2}}>{r.fcLabel}</div>
                    </td>
                    <td style={{...TD,fontFamily:"'Inter',system-ui,sans-serif",color:t.text2}}>
                      {r.demand>0?fmt(r.demand,2):<span style={{color:t.text3}}>—</span>}
                    </td>
                    <td style={{...TD,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:700,color:r.fcStock>0?t.text:t.red}}>
                      {fmt(r.fcStock)}
                    </td>
                    <td style={TD}>
                      <span style={{color:sc,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>
                        {isFinite(r.doi)?fmt(r.doi,1)+"d":"∞"}
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{color:tc,fontFamily:"'Inter',system-ui,sans-serif",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>
                        {r.trend||"—"}
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:12,fontWeight:500,color:sc,fontFamily:"'Inter',system-ui,sans-serif"}}>
                        <span className="dot" style={{background:sc}}></span>{r.status}
                      </span>
                    </td>
                    <td style={TD}>
                      <span style={{color:t.accent,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:700,fontSize:12}}>
                        Send {fmt(r.sendQty)} units to {r.fc}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{marginTop:10,padding:"7px 12px",background:t.surface2,border:`1px solid ${t.border}`,
        borderRadius:6,fontSize:10,fontFamily:"'Inter',system-ui,sans-serif",color:t.text3,
        display:"flex",gap:20,flexWrap:"wrap"}}>
        <span>Cover target = FBA Cover Days slider · Same formula as SKU Detail send-stock</span>
        <span style={{marginLeft:"auto"}}>Click any row → SKU Detail</span>
      </div>
    </div>
  );
}


function OrderQtyCell({qty, t}) {
  if (qty === null) return <span style={{color:t.text3}}>—</span>;
  const rounded = Math.round(qty);
  if (rounded <= 0) return (
    <span style={{
      display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:500,
      color:t.purple,fontFamily:"'Inter',system-ui,sans-serif",
    }}><span className="dot p"></span>{fmt(Math.abs(rounded))} surplus</span>
  );
  return <span style={{color:t.accent,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmt(rounded)}</span>;
}

/* ═══════════════════════════════════════════════════════════════
   PROCUREMENT FORECAST
   • Reads per-ASIN lead times from ltData (Leadtime sheet)
   • Total Inventory = FBA Available + Local WH (FC Sellable) + Upcoming Goods (editable)
   • SEA is priority mode; AIR shown for urgency gap-fill
   • Reorder day for SEA = last safe date to place order before stockout
═══════════════════════════════════════════════════════════════ */
function ProcurementForecast({data, ltData, anchorDate, openPoMap, settings, t}) {
  // Upcoming Goods: user-editable per-SKU POs / supplier transit stock
  const [upcoming, setUpcoming] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fba_upcoming_goods") || "{}"); }
    catch { return {}; }
  });
  const [editingAsin, setEditingAsin] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [q, setQ] = useState("");
  const [fil, setFil] = useState("all");

  const saveUpcoming = (asin, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    const next = {...upcoming, [asin]: v};
    setUpcoming(next);
    try { localStorage.setItem("fba_upcoming_goods", JSON.stringify(next)); } catch {}
    setEditingAsin(null);
  };

  const hasLtData = ltData && Object.keys(ltData).length > 0;
  const anchor = anchorDate || getToday();

  // Per-SKU procurement calculations
  const skus = useMemo(() => {
    if (!data) return [];
    const safetyDays = settings?.safetyDays ?? 30;
    return Object.values(data).map(d => {
      const lt       = ltData?.[d.asin] || null;
      const wfAds    = d.velocity.demand;
      const fba      = d.fbaAvailable || 0;
      const localWH  = d.fcSellable || 0;           // FC Sellable = local warehouse
      const upcomingQty = upcoming[d.asin] || 0;
      const totalInv = fba + localWH + upcomingQty;

      // Open PO qty from Purchases sheet (excluding Delivered)
      const openPoQty = Math.max(0, openPoMap?.[d.asin] ?? 0);

      const doh      = wfAds > 0 ? totalInv / wfAds : Infinity;
      const stockoutDate = wfAds > 0 && isFinite(doh)
        ? new Date(anchor.getTime() + doh * 86400000) : null;

      const airTotal = lt?.air?.total ?? null;
      const seaTotal = lt?.sea?.total ?? null;
      const cost     = lt?.cost || 0;

      // ── AIR recommendation ──
      // Only needed if stock runs out before sea arrives
      let orderAir = null;
      let airOrderDate = null;
      let airArrivalDate = null;
      if (airTotal !== null && seaTotal !== null && wfAds > 0) {
        if (isFinite(doh) && doh < seaTotal) {
          // Gap = days of sales not covered before sea arrives
          const gapDays = Math.max(0, seaTotal - doh);
          orderAir = Math.max(0, Math.round(gapDays * wfAds));
        } else {
          orderAir = 0;
        }
        airOrderDate   = new Date(anchor.getTime());
        airArrivalDate = new Date(anchor.getTime() + airTotal * 86400000);
      } else if (airTotal !== null && wfAds > 0) {
        // Have air LT but no sea LT — use legacy formula
        orderAir = wfAds * airTotal - totalInv;
        airOrderDate   = new Date(anchor.getTime());
        airArrivalDate = new Date(anchor.getTime() + airTotal * 86400000);
      } else if (airTotal !== null) {
        orderAir = 0;
      }

      // ── SEA recommendation ──
      // Target = daily_sales × (seaLT + safetyDays)
      // Available = totalInv + openPoQty
      // Sea = max(0, target - available - airQty)
      let orderSea = null;
      let seaOrderDate = null;
      let seaArrivalDate = null;
      if (seaTotal !== null) {
        if (wfAds > 0) {
          const targetUnits    = wfAds * (seaTotal + safetyDays);
          const availableInv   = totalInv + openPoQty;
          const airDeduct      = Math.max(0, orderAir ?? 0);
          orderSea = Math.max(0, Math.round(targetUnits - availableInv - airDeduct));
        } else {
          orderSea = 0;
        }
        seaOrderDate   = new Date(anchor.getTime());
        seaArrivalDate = new Date(anchor.getTime() + seaTotal * 86400000);
      }

      // Reorder day for SEA = last safe date to place the order = stockout − SEA days
      const reorderSeaDate = (stockoutDate && seaTotal)
        ? new Date(stockoutDate.getTime() - seaTotal * 86400000) : null;

      // Urgency status
      let statusLabel, statusTier;
      if (wfAds === 0 && totalInv === 0) {
        statusLabel = "⬜ No Sales Data"; statusTier = "none";
      } else if (totalInv === 0 && wfAds > 0) {
        statusLabel = "🔴 STOCK OUT — Order Air"; statusTier = "critical";
      } else if (airTotal !== null && isFinite(doh) && doh < airTotal) {
        statusLabel = "🔴 Order Air Now"; statusTier = "critical";
      } else if (seaTotal !== null && isFinite(doh) && doh < seaTotal) {
        statusLabel = "🟠 SEA + AIR gap order"; statusTier = "urgent";
      } else if (seaTotal !== null && isFinite(doh) && doh < seaTotal * 1.3) {
        statusLabel = "🟡 Place SEA order soon"; statusTier = "soon";
      } else if (wfAds > 0) {
        statusLabel = "🟢 Stock OK — routine SEA"; statusTier = "ok";
      } else {
        statusLabel = "⬜ No Sales Data"; statusTier = "none";
      }

      const trend = calcTrend(d.velocity.avg7, d.velocity.avg30);
      return {
        ...d, lt, wfAds, fba, localWH, upcomingQty, totalInv,
        openPoQty,
        doh, stockoutDate, airTotal, seaTotal, orderAir, orderSea,
        airOrderDate, airArrivalDate, seaOrderDate, seaArrivalDate,
        reorderSeaDate, statusLabel, statusTier, trend, cost,
      };
    });
  }, [data, ltData, upcoming, anchor, openPoMap, settings]);

  const filtered = useMemo(() => skus
    .filter(d =>
      fil === "critical" ? d.statusTier === "critical" :
      fil === "urgent"   ? (d.statusTier === "critical" || d.statusTier === "urgent") :
      fil === "soon"     ? d.statusTier === "soon" :
      fil === "has_lt"   ? d.lt !== null : true)
    .filter(d => !q || d.finalName.toLowerCase().includes(q.toLowerCase()) || d.asin.includes(q))
    .sort((a, b) => {
      const ord = {critical:0, urgent:1, soon:2, ok:3, none:4};
      const ao = ord[a.statusTier] ?? 5, bo = ord[b.statusTier] ?? 5;
      if (ao !== bo) return ao - bo;
      return (isFinite(a.doh)?a.doh:99999) - (isFinite(b.doh)?b.doh:99999);
    })
  , [skus, q, fil]);

  const critCount  = skus.filter(d => d.statusTier === "critical").length;
  const urgCount   = skus.filter(d => d.statusTier === "urgent").length;
  const soonCount  = skus.filter(d => d.statusTier === "soon").length;
  const totalSeaQty = skus.reduce((s, d) => s + Math.max(0, d.orderSea ?? 0), 0);
  const ltSkuCount  = hasLtData ? Object.keys(ltData).length : 0;

  function statusSty(tier) {
    if (tier === "critical") return {bg:t.redBg,   color:t.red,    bdr:t.redBdr};
    if (tier === "urgent")   return {bg:t.orangeBg, color:t.orange, bdr:t.yellowBdr};
    if (tier === "soon")     return {bg:t.yellowBg, color:t.yellow, bdr:t.yellowBdr};
    if (tier === "ok")       return {bg:t.greenBg,  color:t.green,  bdr:t.greenBdr};
    return {bg:t.surface2, color:t.text3, bdr:t.border};
  }

  const TH = {
    padding:"0 12px", height:40, textAlign:"left", fontSize:12, fontWeight:600,
    color:t.text3,
    background:t.surface, borderBottom:`2px solid ${t.border}`,
    whiteSpace:"nowrap", position:"sticky", top:0, zIndex:1,
  };
  const TD = {
    padding:"0 12px", height:50, color:t.text2,
    fontSize:13, whiteSpace:"nowrap",
    borderBottom:`1px solid ${t.border}`,
  };

  return (
    <div>
      {/* Page header */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:20,fontWeight:700,color:t.text,marginBottom:4}}>Procurement Forecast</div>
        <div style={{fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
          WF ADS = (30d×0.2)+(14d×0.3)+(7d×0.5) · Sea = priority mode · Air = gap-fill only · Open POs auto-deducted from SEA rec · Safety stock included in SEA target
        </div>
      </div>

      {/* No leadtime warning */}
      {!hasLtData && (
        <div className="alert ay" style={{marginBottom:12}}>
          <span>⚠</span>
          <span>No Leadtime data loaded — AIR / SEA columns will show "—". Upload a <strong>Leadtime CSV</strong> or add a <strong>Leadtime</strong> tab to your Google Sheet.</span>
        </div>
      )}

      {/* KPI cards */}
      <div className="kg" style={{gridTemplateColumns:"repeat(5,1fr)",marginBottom:12}}>
        {[
          {l:"Critical / Air", v:critCount,  s:"Order air immediately", c:"r"},
          {l:"SEA + AIR Gap",  v:urgCount,   s:"SEA + gap air order needed", c:"o"},
          {l:"Order SEA Soon", v:soonCount,  s:"Approaching SEA lead time", c:"y"},
          {l:"Total SEA Order",v:fmt(Math.round(totalSeaQty)), s:"Units to purchase (sea)", c:""},
          {l:"Leadtime SKUs",  v:ltSkuCount, s:"ASINs with LT data loaded", c:"b"},
        ].map(k=>(
          <div key={k.l} className={`kc ${k.c}`}>
            <div className="kl">{k.l}</div>
            <div className="kv" style={{color:k.c==="r"?t.red:k.c==="o"?t.orange:k.c==="y"?t.yellow:k.c==="b"?t.accent:t.text}}>{k.v}</div>
            <div className="ks">{k.s}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div className="srow" style={{marginBottom:10}}>
        <div className="sbox">
          <span style={{color:t.text3}}>⌕</span>
          <input placeholder="Name, ASIN…" value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        <select className="sel" value={fil} onChange={e=>setFil(e.target.value)}>
          <option value="all">All SKUs</option>
          <option value="critical">🔴 Critical Only</option>
          <option value="urgent">🟠 Urgent (Critical + Gap)</option>
          <option value="soon">🟡 Order Soon</option>
          <option value="has_lt">Has Leadtime Data</option>
        </select>
        <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>{filtered.length} / {skus.length} SKUs</span>
      </div>

      {/* Main table */}
      <div className="card" style={{padding:0,overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{minWidth:1700,width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr>
                {/* Product */}
                <th style={{...TH,minWidth:170,borderRight:`1px solid ${t.border2}`}}>SKU</th>
                <th style={TH}>WF ADS</th>
                <th style={TH}>Trend</th>

                {/* Inventory group */}
                <th style={{...TH,background:t.accentBg,borderTop:`2px solid ${t.accent}22`}}>FBA Avail</th>
                <th style={{...TH,background:t.accentBg,borderTop:`2px solid ${t.accent}22`}}>Local WH</th>
                <th style={{...TH,background:t.accentBg,borderTop:`2px solid ${t.accent}22`,color:t.accent}}>
                  Upcoming ✎
                </th>
                <th style={{...TH,background:t.accentBg,borderTop:`2px solid ${t.accent}22`,fontWeight:800}}>Total Inv</th>

                {/* DOH / Stockout */}
                <th style={TH}>Days in Hand</th>
                <th style={TH}>Est. Stockout</th>

                {/* AIR group */}
                <th style={{...TH,background:t.orangeBg,borderTop:`2px solid ${t.orange}55`}}>AIR Days</th>
                <th style={{...TH,background:t.orangeBg,borderTop:`2px solid ${t.orange}55`}}>Order AIR</th>
                <th style={{...TH,background:t.orangeBg,borderTop:`2px solid ${t.orange}55`}}>AIR Arrival</th>

                {/* SEA group */}
                <th style={{...TH,background:t.greenBg,borderTop:`2px solid ${t.green}55`}}>SEA Days</th>
                <th style={{...TH,background:t.greenBg,borderTop:`2px solid ${t.green}55`}}>Open POs</th>
                <th style={{...TH,background:t.greenBg,borderTop:`2px solid ${t.green}55`}}>Order SEA</th>
                <th style={{...TH,background:t.greenBg,borderTop:`2px solid ${t.green}55`}}>SEA Arrival</th>
                <th style={{...TH,background:t.greenBg,borderTop:`2px solid ${t.green}55`}}>Reorder by (SEA)</th>

                {/* Status */}
                <th style={{...TH,minWidth:220}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => {
                const sc = statusSty(d.statusTier);
                const reorderPast = d.reorderSeaDate && d.reorderSeaDate < anchor;
                const reorderSoon = d.reorderSeaDate && !reorderPast
                  && (d.reorderSeaDate.getTime() - anchor.getTime() < 10 * 86400000);
                return (
                  <tr key={d.asin} style={{background:t.surface}}>
                    {/* SKU */}
                    <td style={{...TD,borderRight:`1px solid ${t.border2}`}}>
                      <div style={{fontWeight:600,color:t.text,fontSize:12,maxWidth:165,overflow:"hidden",textOverflow:"ellipsis"}}>{d.finalName}</div>
                      <div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginTop:2}}>{d.asin}</div>
                    </td>
                    {/* WF ADS */}
                    <td style={TD}>
                      <span style={{fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",color:t.text}}>{fmt(d.wfAds,2)}</span>
                      <span style={{fontSize:9,color:t.text3,marginLeft:3}}>u/d</span>
                    </td>
                    {/* Trend */}
                    <td style={TD}>
                      <span style={{fontSize:10,color:trendColor(d.trend,t),fontFamily:"'Inter',system-ui,sans-serif"}}>{d.trend}</span>
                    </td>

                    {/* Inventory group */}
                    <td style={{...TD,background:t.accentBg}}>{fmt(d.fba)}</td>
                    <td style={{...TD,background:t.accentBg}}>{fmt(d.localWH)}</td>
                    {/* Upcoming — editable */}
                    <td style={{...TD,background:t.accentBg,cursor:"pointer",userSelect:"none"}}
                        onClick={() => { setEditingAsin(d.asin); setEditVal(String(d.upcomingQty)); }}>
                      {editingAsin === d.asin ? (
                        <input
                          autoFocus type="number" min="0"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onBlur={() => saveUpcoming(d.asin, editVal)}
                          onKeyDown={e => {
                            if (e.key === "Enter") saveUpcoming(d.asin, editVal);
                            if (e.key === "Escape") setEditingAsin(null);
                          }}
                          onClick={e => e.stopPropagation()}
                          style={{
                            width:70,padding:"3px 6px",
                            background:t.surface,border:`1px solid ${t.accent}`,
                            borderRadius:4,color:t.text,fontSize:12,
                            fontFamily:"'Inter',system-ui,sans-serif",outline:"none",
                          }}
                        />
                      ) : (
                        <span style={{
                          display:"inline-flex",alignItems:"center",gap:5,
                          padding:"2px 8px",borderRadius:4,
                          background: d.upcomingQty > 0 ? t.accentBg : t.surface2,
                          border: `1px solid ${d.upcomingQty > 0 ? t.accentBdr : t.border}`,
                          color: d.upcomingQty > 0 ? t.accent : t.text3,
                          fontFamily:"'Inter',system-ui,sans-serif",fontSize:11,
                        }}>
                          {fmt(d.upcomingQty)}<span style={{fontSize:8,opacity:.5}}>✎</span>
                        </span>
                      )}
                    </td>
                    {/* Total Inv */}
                    <td style={{...TD,background:t.accentBg,fontWeight:700,color:t.text,fontFamily:"'Inter',system-ui,sans-serif"}}>
                      {fmt(d.totalInv)}
                    </td>

                    {/* Days in Hand */}
                    <td style={TD}>
                      <span style={{
                        fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",
                        color: !isFinite(d.doh) ? t.green
                             : d.doh < 30 ? t.red
                             : d.doh < 60 ? t.yellow : t.green,
                      }}>
                        {isFinite(d.doh) ? fmt(d.doh,1)+"d" : "∞"}
                      </span>
                    </td>
                    {/* Est. Stockout */}
                    <td style={TD}>
                      <span style={{fontSize:11,color:d.stockoutDate?t.text2:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
                        {d.stockoutDate ? fmtDate(d.stockoutDate) : "—"}
                      </span>
                    </td>

                    {/* AIR group */}
                    <td style={{...TD,background:t.orangeBg}}>
                      {d.airTotal !== null
                        ? <span style={{color:t.orange,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600}}>{d.airTotal}d</span>
                        : <span style={{color:t.text3}}>—</span>}
                    </td>
                    <td style={{...TD,background:t.orangeBg}}>
                      <OrderQtyCell qty={d.orderAir} t={t}/>
                    </td>
                    <td style={{...TD,background:t.orangeBg}}>
                      {d.airArrivalDate
                        ? <span style={{fontSize:11,color:t.orange,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmtDate(d.airArrivalDate)}</span>
                        : <span style={{color:t.text3}}>—</span>}
                    </td>

                    {/* SEA group */}
                    <td style={{...TD,background:t.greenBg}}>
                      {d.seaTotal !== null
                        ? <span style={{color:t.green,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600}}>{d.seaTotal}d</span>
                        : <span style={{color:t.text3}}>—</span>}
                    </td>
                    {/* Open POs */}
                    <td style={{...TD,background:t.greenBg}}>
                      {d.openPoQty > 0
                        ? <span style={{
                            display:"inline-block",padding:"2px 8px",borderRadius:4,
                            background:t.accentBg,border:`1px solid ${t.accentBdr}`,
                            color:t.accent,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:700,fontSize:11,
                          }}>{fmt(d.openPoQty)}</span>
                        : <span style={{color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>—</span>}
                    </td>
                    <td style={{...TD,background:t.greenBg}}>
                      <OrderQtyCell qty={d.orderSea} t={t}/>
                    </td>
                    {/* SEA Arrival */}
                    <td style={{...TD,background:t.greenBg}}>
                      {d.seaArrivalDate
                        ? <span style={{fontSize:11,color:t.green,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmtDate(d.seaArrivalDate)}</span>
                        : <span style={{color:t.text3}}>—</span>}
                    </td>
                    {/* Reorder by (SEA) — last safe date */}
                    <td style={{...TD,background:t.greenBg}}>
                      {d.reorderSeaDate ? (
                        <span style={{
                          fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:reorderPast?700:400,
                          color: reorderPast ? t.red : reorderSoon ? t.yellow : t.green,
                        }}>
                          {reorderPast && "⚠ "}{fmtDate(d.reorderSeaDate)}
                        </span>
                      ) : <span style={{color:t.text3}}>—</span>}
                    </td>

                    {/* Status badge */}
                    <td style={TD}>
                      <span style={{
                        display:"inline-flex",alignItems:"center",gap:6,fontSize:12,
                        fontWeight:500,color:sc.color,whiteSpace:"nowrap",
                      }}>
                        <span className="dot" style={{background:sc.color}}></span>{d.statusLabel.replace(/^[⬜🔴🟠🟡🟢]\s*/,"")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals row */}
      {filtered.length > 0 && (
        <div style={{
          marginTop:8,padding:"8px 12px",background:t.surface,border:`1px solid ${t.border}`,
          borderRadius:8,display:"flex",gap:20,flexWrap:"wrap",alignItems:"center",
          fontSize:10,fontFamily:"'Inter',system-ui,sans-serif",
        }}>
          <span style={{fontWeight:600,color:t.text3}}>Totals ({filtered.length} SKUs)</span>
          <span style={{color:t.text2}}>FBA: <strong style={{color:t.text}}>{fmt(filtered.reduce((s,d)=>s+d.fba,0))}</strong></span>
          <span style={{color:t.text2}}>Local WH: <strong style={{color:t.text}}>{fmt(filtered.reduce((s,d)=>s+d.localWH,0))}</strong></span>
          <span style={{color:t.accent}}>Upcoming: <strong>{fmt(filtered.reduce((s,d)=>s+d.upcomingQty,0))}</strong></span>
          <span style={{color:t.text2}}>Total Inv: <strong style={{color:t.text,fontWeight:800}}>{fmt(filtered.reduce((s,d)=>s+d.totalInv,0))}</strong></span>
          <span style={{color:t.accent}}>Open POs: <strong>{fmt(filtered.reduce((s,d)=>s+d.openPoQty,0))}</strong></span>
          <span style={{color:t.orange}}>Order AIR: <strong>{fmt(Math.round(filtered.reduce((s,d)=>s+Math.max(0,d.orderAir??0),0)))}</strong></span>
          <span style={{color:t.green}}>Order SEA: <strong>{fmt(Math.round(filtered.reduce((s,d)=>s+Math.max(0,d.orderSea??0),0)))}</strong></span>
        </div>
      )}

      {/* Legend */}
      <div style={{marginTop:8,display:"flex",gap:14,flexWrap:"wrap",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
        <span>🔴 DOH &lt; AIR lead time — order air now</span>
        <span>🟠 DOH &lt; SEA lead time — need SEA + gap air</span>
        <span>🟡 DOH &lt; SEA × 1.3 — place SEA soon</span>
        <span>🟢 Stock OK — schedule routine SEA</span>
        <span>· Upcoming ✎ = click to edit · Open POs auto-fetched from Purchases sheet · AIR = gap coverage only · SEA target = ADS × (SEA days + safety stock) − (Inv + Open POs)</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WARNINGS PAGE
═══════════════════════════════════════════════════════════════ */
function WarningsPage({warnings,t}){
  const unmapped=warnings.filter(w=>w.type.includes("unmapped"));
  const mismatch=[...new Map(warnings.filter(w=>w.type.includes("mismatch")).map(w=>[w.asin,w])).values()];
  if(!warnings.length)return(<div className="empty"><div className="empty-ic">✅</div><h3>No Issues</h3><p>All ASINs mapped. SKUs match.</p></div>);
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
      <span style={{fontSize:15,fontWeight:700,color:t.text}}>Data Quality Report</span>
      <span className="badge bgr"><span className="dot gr"></span>{warnings.length} total</span>
    </div>
    {unmapped.length>0&&<div className="wsec">
      <div className="wh" style={{color:t.red}}>Unmapped ASINs — Excluded ({unmapped.length})</div>
      <div className="alert ar" style={{marginBottom:8}}>Not found in SKU Map. Excluded from all calculations.</div>
      <div className="tw ts"><table>
        <thead><tr><th>Source</th><th>ASIN</th><th>Context</th><th>Row</th></tr></thead>
        <tbody>{unmapped.map((w,i)=>(
          <tr key={i}>
            <td><span className={`badge ${w.type.includes("inv")?"bb":"bgr"}`}><span className={`dot ${w.type.includes("inv")?"b":"gr"}`}></span>{w.type.includes("inv")?"Inventory":"Orders"}</span></td>
            <td style={{color:t.red,fontFamily:"'Inter',system-ui,sans-serif",fontSize:11}}>{w.asin}</td>
            <td style={{color:t.text3,fontSize:10}}>{w.context||"—"}</td>
            <td style={{fontSize:10,color:t.text3}}>{w.row||"—"}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>}
    {mismatch.length>0&&<div className="wsec">
      <div className="wh" style={{color:t.yellow}}>SKU Mismatches — Included ({mismatch.length})</div>
      <div className="alert ay" style={{marginBottom:8}}>Records still included. Verify these are the correct products.</div>
      <div className="tw ts"><table>
        <thead><tr><th>ASIN</th><th>SKU in File</th><th>Expected</th></tr></thead>
        <tbody>{mismatch.map((w,i)=>(
          <tr key={i}>
            <td style={{fontFamily:"'Inter',system-ui,sans-serif",fontSize:11}}>{w.asin}</td>
            <td style={{color:t.red,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}}>{w.csvSku}</td>
            <td style={{color:t.green,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}}>{w.mapSku}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>}
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   SKU DETAIL
   • Title = SKU name (set from parent)
   • Reorder level line on forecast chart
   • India demand heatmap
═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   TOP CITIES BREAKDOWN
   Reads citySales {asin→{"CITY||STATE"→qty}}, groups small cities
   into "Other [State]", shows top 15 by volume
═══════════════════════════════════════════════════════════════ */
function TopCities({ citySales, t }) {
  const [expanded, setExpanded] = useState(false);

  if (!citySales || Object.keys(citySales).length === 0) {
    return (
      <div style={{padding:"14px 0",textAlign:"center",fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
        No city data — ship-city column not found in orders CSV
      </div>
    );
  }

  // Parse "CITY||STATE" keys into [{city, stateLabel, qty}]
  const entries = Object.entries(citySales).map(([key, qty]) => {
    const [city, stateRaw] = key.split("||");
    const stateLabel = stateRaw
      ? stateRaw.split(" ").map(w=>w.charAt(0)+w.slice(1).toLowerCase()).join(" ")
      : "Unknown";
    return { city, stateLabel, stateRaw: stateRaw||"UNKNOWN", qty };
  });

  const totalQty = entries.reduce((s, e) => s + e.qty, 0);
  if (totalQty === 0) return null;

  const sorted = [...entries].sort((a,b) => b.qty - a.qty);
  const TOP_N = 15;
  const top = sorted.slice(0, TOP_N);
  const rest = sorted.slice(TOP_N);

  // Group rest by state → "Other [State]" buckets
  const otherByState = {};
  rest.forEach(e => {
    const k = "Other " + e.stateLabel;
    if (!otherByState[k]) otherByState[k] = { city: k, stateLabel: e.stateLabel, qty: 0, isOther: true };
    otherByState[k].qty += e.qty;
  });
  const otherRows = Object.values(otherByState).sort((a,b) => b.qty - a.qty);
  const hasRest = otherRows.length > 0;

  // Always show top 15; show "Other" groups only when expanded
  const visibleRows = expanded ? [...top, ...otherRows] : top;
  const maxQty = top[0]?.qty || 1;

  function CityRow({ row, rank, isOther }) {
    const pct = totalQty > 0 ? (row.qty / totalQty * 100) : 0;
    const barPct = row.qty / maxQty * 100;
    return (
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        {/* Rank */}
        <div style={{
          width:20, textAlign:"right", fontSize:9, flexShrink:0,
          color: isOther ? t.text3 : rank<3 ? t.accent : t.text3,
          fontFamily:"'Inter',system-ui,sans-serif",
        }}>
          {isOther ? "·" : `${rank+1}`}
        </div>

        {/* City + state */}
        <div style={{width:160,flexShrink:0}}>
          <div style={{
            fontSize:11, fontWeight: isOther?400:600,
            color: isOther ? t.text3 : t.text,
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          }}>{row.city}</div>
          <div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>{row.stateLabel}</div>
        </div>

        {/* Bar */}
        <div style={{flex:1,height:6,background:t.surface2,borderRadius:3,overflow:"hidden"}}>
          <div style={{
            width: barPct+"%", height:"100%", borderRadius:3,
            background: isOther ? t.border2 : rank<3 ? t.accent : "rgba(99,102,241,0.55)",
            transition:"width .3s",
          }}/>
        </div>

        {/* Units + % */}
        <div style={{width:70,textAlign:"right",flexShrink:0}}>
          <span style={{fontSize:11,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",color:isOther?t.text3:t.text}}>{fmt(row.qty)}</span>
          <span style={{fontSize:9,color:t.text3,marginLeft:4}}>{pct.toFixed(1)}%</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",marginBottom:10}}>
        Top {top.length} cities · {hasRest ? `${otherRows.length} state group${otherRows.length>1?"s":""} collapsed below · ` : ""}total {fmt(totalQty)} units
      </div>

      {/* Top 15 rows — always visible */}
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {top.map((row, i) => <CityRow key={row.city+i} row={row} rank={i} isOther={false}/>)}
      </div>

      {/* Collapsible rest */}
      {hasRest && (
        <div style={{marginTop:8}}>
          <div
            onClick={()=>setExpanded(e=>!e)}
            style={{
              display:"flex", alignItems:"center", gap:6, cursor:"pointer",
              padding:"6px 10px", borderRadius:7,
              background: t.surface2, border:`1px solid ${t.border}`,
              fontSize:10, color:t.text3,
              userSelect:"none",
            }}
          >
            <span style={{
              display:"inline-block", transition:"transform .2s",
              transform: expanded?"rotate(90deg)":"rotate(0deg)",
              fontSize:10,
            }}>▶</span>
            <span>
              {expanded ? "Hide" : "Show"} remaining {otherRows.length} state group{otherRows.length>1?"s":""} &nbsp;·&nbsp; {fmt(rest.reduce((s,e)=>s+e.qty,0))} units ({(rest.reduce((s,e)=>s+e.qty,0)/totalQty*100).toFixed(1)}% of demand)
            </span>
          </div>

          {expanded && (
            <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:6,
              paddingLeft:8, borderLeft:`2px solid ${t.border}`}}>
              {otherRows.map((row, i) => <CityRow key={row.city+i} row={row} rank={top.length+i} isOther={true}/>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SKUDetail({sku, onBack, settings, setSettings, t, poUnits, setPoUnits, purchRows}){
  if(!sku) return null;
  const {velocity:vel, planning:pl, forecast, fcPlanning, hasFCData, regionalSales, citySales, salesHistory} = sku;

  const [bkVisible,setBkVisible]=useState(true);
  useEffect(()=>{
    const scroller=document.querySelector(".content");
    if(!scroller)return;
    let lastY=scroller.scrollTop;
    const onScroll=()=>{
      const y=scroller.scrollTop;
      setBkVisible(y<=lastY||y<40);
      lastY=y;
    };
    scroller.addEventListener("scroll",onScroll,{passive:true});
    return()=>scroller.removeEventListener("scroll",onScroll);
  },[]);

  // Per-SKU lead time from file; Additional Lead Time slider = extra buffer on top
  const seaLTBase = sku.skuSeaLT ?? null;
  const airLTBase = sku.skuAirLT ?? null;
  const defaultLT = seaLTBase ?? settings.totalLeadTime;
  const [ltAdj, setLtAdj] = useState(0);
  const effectiveLT = defaultLT + ltAdj + settings.totalLeadTime;
  const effectiveAirLT = airLTBase != null ? airLTBase + ltAdj + settings.totalLeadTime : null;

  // Recompute local planning values with per-SKU LTs + adjustment
  const localReorderStock = Math.round(vel.demand * (effectiveLT + settings.safetyDays));
  const localDoi = vel.demand > 0 ? (sku.currentStock / vel.demand) : Infinity;
  const localGap = Math.max(0, (effectiveLT + settings.safetyDays) - localDoi);
  const localRequired = vel.demand * (effectiveLT + settings.safetyDays);
  const localSuggestedPurchaseRaw = Math.round(localRequired + Math.max(0, localGap) * vel.demand);
  const currentPoUnits = poUnits?.[sku.asin] ?? 0;
  // Auto-fetched open POs from Purchases sheet (non-Delivered, this ASIN)
  const skuPoRows = (purchRows||[]).filter(r=>{
    const get = makeGet([r]);
    const asin   = s(r,get,"ASIN","asin");
    const status = s(r,get,"Status","status").toLowerCase().trim();
    return asin === sku.asin && status !== "delivered";
  });
  const totalOpenPoQty = skuPoRows.reduce((sum,r)=>{
    const get = makeGet([r]);
    return sum + Math.max(0, n(r,get,"Tr Qty","tr qty","Qty","qty","Quantity","quantity")||0);
  },0);
  const totalPoDeduction = currentPoUnits + totalOpenPoQty;
  const localSuggestedPurchase = Math.max(0, localSuggestedPurchaseRaw - totalPoDeduction);
  const fullyCoveredByPos = localSuggestedPurchaseRaw > 0 && localSuggestedPurchase === 0 && totalPoDeduction > 0;
  // ── Shipment split — scenario-based ──
  // doi in days from anchor; how long stock lasts
  const stockDaysLeft = isFinite(localDoi) ? localDoi : effectiveLT + 999;
  const hasAir = effectiveAirLT != null && effectiveAirLT > 0;

  // Scenario 1: stock lasts past sea arrival → all SEA, no air
  // Scenario 2: stock lasts past air arrival but not sea → SEA now (full), no air yet
  // Scenario 3: stock runs out before sea arrives → bridge gap with air
  //   gap = days between air_arrival and sea_arrival = effectiveLT - effectiveAirLT
  //   air covers that gap window of sales
  // Scenario 4: stock runs out before even air arrives → all must be air (crisis)

  let localAirQty = 0;
  let localSeaQty = localSuggestedPurchase;
  let splitScenario = 1; // 1=all sea, 2=sea urgent, 3=split, 4=crisis air

  if (localSuggestedPurchase > 0 && vel.demand > 0) {
    if (!hasAir) {
      // No air LT data — can only recommend sea
      splitScenario = 1;
      localSeaQty = localSuggestedPurchase;
      localAirQty = 0;
    } else if (stockDaysLeft >= effectiveLT) {
      // Scenario 1: healthy, all sea
      splitScenario = 1;
      localSeaQty = localSuggestedPurchase;
      localAirQty = 0;
    } else if (stockDaysLeft >= effectiveAirLT) {
      // Scenario 2: stock lasts until air arrives but not sea
      // Sea order placed now covers everything, but sea deadline is urgent
      splitScenario = 2;
      localSeaQty = localSuggestedPurchase;
      localAirQty = 0;
    } else if (stockDaysLeft >= 0) {
      // Scenario 3: stock runs out before sea, but air can bridge
      // Air covers: from stockout until sea arrives = (effectiveLT - stockDaysLeft) days of demand
      // But capped at (effectiveLT - effectiveAirLT) days max (the real air window)
      const gapDays = effectiveLT - effectiveAirLT; // days air bridges before sea
      const airBridgeQty = Math.ceil(gapDays * vel.demand);
      localAirQty = Math.min(airBridgeQty, localSuggestedPurchase);
      localSeaQty = Math.max(0, localSuggestedPurchase - localAirQty);
      splitScenario = 3;
    } else {
      // Scenario 4: already stocked out — air everything needed urgently
      splitScenario = 4;
      localAirQty = localSuggestedPurchase;
      localSeaQty = 0;
    }
  }

  // ── FC manual inbound overrides (persisted to localStorage, keyed asin::fc) ──
  const [fcInbound, setFcInbound] = useState(()=>{
    try { return JSON.parse(localStorage.getItem("fc_inbound")||"{}"); } catch(_){ return {}; }
  });
  function setFcInboundVal(asin, fc, raw) {
    setFcInbound(prev=>{
      const key = `${asin}::${fc}`;
      const next = {...prev};
      const num = parseFloat(raw);
      if (raw===""||raw===null||raw===undefined||isNaN(num)) { delete next[key]; }
      else { next[key] = Math.max(0, Math.floor(num)); }
      try { localStorage.setItem("fc_inbound", JSON.stringify(next)); } catch(_){}
      return next;
    });
  }


  const soi = forecast.findIndex(p=>p.stock===0);
  const reorderStock = localReorderStock;
  const FC_STATUS_COLOR = {stockout:t.red,critical:t.red,low:t.yellow,ok:t.green,surplus:t.purple};

  // ── Order deadline dates ──
  const anchor = sku._anchor || new Date();
  const stockoutMs = vel.demand > 0 && isFinite(localDoi)
    ? anchor.getTime() + localDoi * 86400000 : null;
  const seaArrivalDate = stockoutMs != null
    ? new Date(anchor.getTime() + effectiveLT * 86400000) : null;
  const airArrivalDate = hasAir && stockoutMs != null
    ? new Date(anchor.getTime() + effectiveAirLT * 86400000) : null;
  // Last safe date = stockout - transit (can be past = overdue)
  const seaOrderByDate = stockoutMs != null && effectiveLT > 0
    ? new Date(stockoutMs - effectiveLT * 86400000) : null;
  const airOrderByDate = hasAir && stockoutMs != null
    ? new Date(stockoutMs - effectiveAirLT * 86400000) : null;

  function daysFromAnchor(d) {
    if (!d) return null;
    return Math.round((d.getTime() - anchor.getTime()) / 86400000);
  }
  function deadlineColor(daysLeft) {
    if (daysLeft == null) return t.text3;
    if (daysLeft < 0)  return t.red;
    if (daysLeft < 14) return t.orange;
    return t.green;
  }
  function deadlineLabel(d) {
    if (!d) return "—";
    const dl = daysFromAnchor(d);
    const ds = fmtDate(d);
    if (dl < 0)   return `${ds} (${Math.abs(dl)}d overdue)`;
    if (dl === 0) return `${ds} (TODAY)`;
    return `${ds} (in ${dl}d)`;
  }

  const seaDaysLeft = daysFromAnchor(seaOrderByDate);
  const airDaysLeft = daysFromAnchor(airOrderByDate);
  const seaArrivalDaysLeft = daysFromAnchor(seaArrivalDate);
  const airArrivalDaysLeft = daysFromAnchor(airArrivalDate);

  const SCENARIO_MSG = {
    1: null,
    2: {color:t.orange, msg:`SEA deadline is urgent — stock lasts until air arrival but place SEA order now`},
    3: {color:t.red,    msg:`Stock runs out before SEA arrives — Air bridges the ${effectiveLT - (effectiveAirLT??0)}d gap`},
    4: {color:t.red,    msg:`Already stocked out — order all units by Air immediately`},
  };

  return(<div>
    <div className="bk" onClick={onBack} style={{
      position:"sticky",top:8,zIndex:20,
      transform:bkVisible?"translateY(0)":"translateY(-140%)",
      opacity:bkVisible?1:0,
      transition:"transform .22s ease,opacity .22s ease",
      boxShadow:"0 4px 12px rgba(0,0,0,.18)",
    }}>← Back</div>
    <SBar settings={settings} setSettings={setSettings} t={t}/>

    {/* Per-SKU Lead Time */}
    <div className="card" style={{marginBottom:10,padding:"10px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <div style={{fontSize:13,fontWeight:600,color:t.text2,whiteSpace:"nowrap"}}>
          Lead Time
        </div>
        <div style={{flex:1,minWidth:160}}>
          <input type="range" min={-30} max={30} value={ltAdj}
            onChange={e=>setLtAdj(+e.target.value)}
            style={{width:"100%"}}
          />
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center",fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",flexWrap:"wrap"}}>
          <span>
            🚢 Sea: <span style={{color:t.green,fontWeight:700}}>{seaLTBase != null ? seaLTBase : "—"}d</span>
            {seaLTBase != null && <span style={{color:t.text3,fontSize:9}}> (file)</span>}
          </span>
          {effectiveAirLT != null && (
            <span style={{color:t.text3}}>
              ✈ Air: <span style={{color:t.accent}}>{airLTBase}d</span>
              {settings.totalLeadTime > 0 && <span style={{color:t.text3}}> +{settings.totalLeadTime}</span>}
              <span style={{color:t.accent}}> = {effectiveAirLT}d</span>
            </span>
          )}
          {ltAdj !== 0 && <span style={{color:t.yellow}}>{ltAdj > 0 ? "+" : ""}{ltAdj}d adj</span>}
          <span style={{color:t.text,fontWeight:700}}>→ Eff: {effectiveLT}d</span>
          {ltAdj !== 0 && <button onClick={()=>setLtAdj(0)} style={{fontSize:9,padding:"2px 6px",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:4,color:t.text3,cursor:"pointer"}}>Reset</button>}
        </div>
        <div style={{fontSize:9,color:t.text3}}>
          Reorder @ <span style={{color:t.yellow,fontWeight:700}}>{fmt(localReorderStock)} units</span>
          &nbsp;·&nbsp;{settings.safetyDays}d safety
        </div>
      </div>
    </div>

    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
      <div>
        <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:2}}>{sku.finalName}</div>
        <div style={{fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>{sku.sellerSku} · {sku.asin}</div>
      </div>
      <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
        <PBadge action={pl.action} priority={pl.priority} purchasePct={pl.purchasePct||0} replenishPct={pl.replenishPct||0} t={t}/>
      </div>
    </div>

    {/* KPI row */}
    <div className="d4" style={{marginBottom:10,gridTemplateColumns:"repeat(3,1fr)"}}>
      {[
        {l:"Days of Inventory",v:isFinite(pl.doi)?`${fmt(pl.doi,1)}d`:"∞",col:pl.doi<7?t.red:pl.doi<21?t.yellow:t.green},
        {l:"Stockout Date",v:fmtDate(pl.stockoutDate),col:pl.doi<7?t.red:pl.doi<21?t.yellow:t.text},
        {l:"Gross Requirement",v:fmt(pl.netRequirement),col:pl.netRequirement>0?t.red:t.green},
      ].map(k=>(
        <div key={k.l} className="kc">
          <div className="kl">{k.l}</div>
          <div className="kv" style={{fontSize:16,color:k.col}}>{k.v}</div>
        </div>
      ))}
    </div>

    {/* Order Deadlines — shipment split */}
    <div className="card" style={{marginBottom:10}}>
      <div className="ch">Shipment Plan — Order Deadlines &amp; Split</div>
      {vel.demand === 0 ? (
        <div style={{fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"6px 0"}}>No demand — not applicable</div>
      ) : !stockoutMs ? (
        <div style={{fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"6px 0"}}>Infinite stock — no order needed</div>
      ) : (
        <div>
          {/* Scenario banner */}
          {SCENARIO_MSG[splitScenario] && (
            <div style={{
              marginBottom:10,padding:"8px 12px",borderRadius:7,fontSize:11,fontWeight:600,
              background:SCENARIO_MSG[splitScenario].color+"18",
              border:`1px solid ${SCENARIO_MSG[splitScenario].color}44`,
              color:SCENARIO_MSG[splitScenario].color,
            }}>
              ⚠ {SCENARIO_MSG[splitScenario].msg}
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:hasAir?"1fr 1fr":"1fr",gap:10,marginBottom:10}}>

            {/* SEA card */}
            <div style={{
              padding:"12px 14px",borderRadius:8,
              background: splitScenario===4 ? t.surface2 : deadlineColor(seaDaysLeft)+"14",
              border:`1px solid ${splitScenario===4 ? t.border : deadlineColor(seaDaysLeft)+"55"}`,
              opacity: splitScenario===4 ? 0.45 : 1,
            }}>
              <div style={{fontSize:13,fontWeight:600,color:t.text2,marginBottom:10}}>
                🚢 Sea Shipment
              </div>
              {/* Order by date */}
              <div style={{marginBottom:6}}>
                <div style={{fontSize:9,color:t.text3,marginBottom:2}}>ORDER BY</div>
                <div style={{fontSize:14,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",color:splitScenario===4?t.text3:deadlineColor(seaDaysLeft)}}>
                  {splitScenario===4 ? "N/A — order all by Air" : deadlineLabel(seaOrderByDate)}
                </div>
              </div>
              {/* Arrival date */}
              {seaArrivalDate && splitScenario!==4 && (
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:9,color:t.text3,marginBottom:2}}>ARRIVES ~</div>
                  <div style={{fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",color:t.text2}}>
                    {fmtDate(seaArrivalDate)}
                    {seaArrivalDaysLeft!=null&&<span style={{color:t.text3,fontSize:9}}> (in {seaArrivalDaysLeft}d)</span>}
                  </div>
                </div>
              )}
              {/* Units */}
              <div style={{
                marginTop:8,padding:"7px 10px",borderRadius:6,
                background:t.surface2,border:`1px solid ${t.border}`,
                display:"flex",justifyContent:"space-between",alignItems:"center",
              }}>
                <span style={{fontSize:12,color:t.text3}}>Order Qty</span>
                <span style={{fontSize:16,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",color:splitScenario===4?t.text3:t.green}}>
                  {splitScenario===4 ? "—" : fmt(localSeaQty)} <span style={{fontSize:10,fontWeight:400}}>units</span>
                </span>
              </div>
              {effectiveLT>0&&splitScenario!==4&&(
                <div style={{marginTop:5,fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
                  {effectiveLT}d transit · covers long-term stock
                </div>
              )}
            </div>

            {/* AIR card — only if air LT exists */}
            {hasAir && (
              <div style={{
                padding:"12px 14px",borderRadius:8,
                background: (splitScenario===3||splitScenario===4) ? deadlineColor(airDaysLeft)+"14" : t.surface2,
                border:`1px solid ${(splitScenario===3||splitScenario===4) ? deadlineColor(airDaysLeft)+"55" : t.border}`,
                opacity: splitScenario===1 ? 0.4 : 1,
              }}>
                <div style={{fontSize:13,fontWeight:600,color:t.text2,marginBottom:10}}>
                  ✈ Air Shipment {splitScenario===1&&<span style={{color:t.text3,fontWeight:400}}>(not needed)</span>}
                </div>
                {/* Order by date */}
                <div style={{marginBottom:6}}>
                  <div style={{fontSize:9,color:t.text3,marginBottom:2}}>ORDER BY</div>
                  <div style={{fontSize:14,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",color:splitScenario===1?t.text3:deadlineColor(airDaysLeft)}}>
                    {splitScenario===1 ? "Not required" : deadlineLabel(airOrderByDate)}
                  </div>
                </div>
                {/* Arrival */}
                {airArrivalDate && splitScenario!==1 && (
                  <div style={{marginBottom:6}}>
                    <div style={{fontSize:9,color:t.text3,marginBottom:2}}>ARRIVES ~</div>
                    <div style={{fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",color:t.text2}}>
                      {fmtDate(airArrivalDate)}
                      {airArrivalDaysLeft!=null&&<span style={{color:t.text3,fontSize:9}}> (in {airArrivalDaysLeft}d)</span>}
                    </div>
                  </div>
                )}
                {/* Units */}
                <div style={{
                  marginTop:8,padding:"7px 10px",borderRadius:6,
                  background:t.surface2,border:`1px solid ${t.border}`,
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                }}>
                  <span style={{fontSize:12,color:t.text3}}>Order Qty</span>
                  <span style={{fontSize:16,fontWeight:800,fontFamily:"'Inter',system-ui,sans-serif",color:splitScenario===1?t.text3:t.accent}}>
                    {splitScenario===1 ? "—" : fmt(localAirQty)} <span style={{fontSize:10,fontWeight:400}}>units</span>
                  </span>
                </div>
                {splitScenario===3&&(
                  <div style={{marginTop:5,fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
                    {effectiveAirLT}d transit · bridges {effectiveLT-(effectiveAirLT??0)}d gap until sea arrives
                  </div>
                )}
                {splitScenario===4&&(
                  <div style={{marginTop:5,fontSize:9,color:t.red,fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600}}>
                    Already stocked out — order all units now
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Total summary row */}
          {localSuggestedPurchase > 0 && (
            <div style={{
              padding:"8px 12px",background:t.surface2,borderRadius:7,border:`1px solid ${t.border}`,
              display:"flex",gap:20,alignItems:"center",flexWrap:"wrap",
              fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",
            }}>
              <span style={{color:t.text3,fontSize:9,textTransform:"uppercase",letterSpacing:".5px"}}>Total Order</span>
              <span>🚢 Sea: <strong style={{color:t.green}}>{fmt(localSeaQty)} u</strong></span>
              {hasAir&&<span>✈ Air: <strong style={{color:localAirQty>0?t.accent:t.text3}}>{fmt(localAirQty)} u</strong></span>}
              <span style={{marginLeft:"auto",fontWeight:800,color:t.text,fontSize:13}}>
                = {fmt(localSuggestedPurchase)} units total
              </span>
              {currentPoUnits>0&&(
                <span style={{fontSize:10,color:t.text3}}>
                  ({fmt(currentPoUnits)} on PO, deducted)
                </span>
              )}
            </div>
          )}

          {/* No LT data nudge */}
          {effectiveLT === 0 && !hasAir && (
            <div style={{marginTop:8,fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
              Upload Leadtime CSV to enable split calculations.
            </div>
          )}
        </div>
      )}
    </div>

    {/* Inventory + Velocity */}
    <div className="d2" style={{marginBottom:10}}>
      <div className="card">
        <div className="ch">Inventory Breakdown</div>
        {[["FBA Available",fmt(sku.fbaAvailable)],["FBA Unsellable",fmt(sku.fbaUnsellable)],
          ["FC Transfer",fmt(sku.fcTransfer||0)],["On Hand (FBA + FC Transfer)",fmt(sku.onHand||(sku.fbaAvailable+sku.fcTransfer)||0)],
          ["FC Sellable",fmt(sku.fcSellable)],["FC Unsellable",fmt(sku.fcUnsellable)],
          ["Inbound",fmt(sku.inbound)],
          ["Total Current Stock",fmt(sku.currentStock)],["Unit Cost",sku.unitCost?`₹${fmt(sku.unitCost,2)}`:"—"]].map(([k,v])=>(
          <div key={k} className="sr"><span className="sk">{k}</span><span className="sv">{v}</span></div>
        ))}
      </div>
      <div className="card">
        <div className="ch">Sales Velocity (Net — Excl. Cancelled & Returns)</div>
        {[["7-Day Total",fmt(vel.raw7)+" units"],
          ["7-Day Avg",fmt(vel.avg7,2)+" u/day"],
          ["14-Day Total",fmt(vel.raw14)+" units"],
          ["14-Day Avg",fmt(vel.avg14,2)+" u/day"],
          ["30-Day Total",fmt(vel.raw30)+" units"],
          ["30-Day Avg",fmt(vel.avg30,2)+" u/day"],
          ["Weighted Demand",fmt(vel.demand,2)+" u/day"],
          ["Formula","7D×0.5 + 14D×0.3 + 30D×0.2"],
          ["Reorder Stock Level",fmt(localReorderStock)+" units"],
          ["Urgency","auto × demand"]].map(([k,v])=>(
          <div key={k} className="sr"><span className="sk">{k}</span>
            <span className="sv" style={k==="Weighted Demand"?{color:t.accent}:k==="Reorder Stock Level"?{color:t.yellow}:{}}>{v}</span>
          </div>
        ))}
      </div>
    </div>

    {/* ── Active Purchase Orders ── */}
    {(()=>{
      const poRows = skuPoRows;
      const totalOpenQty = totalOpenPoQty;
      const STATUS_COLORS = {
        "in production": "#5BA8E0",
        "production completed": "#9C7FE0",
        "in transit":    t.yellow,
        "ordered":       t.text2,
        "open":          t.green,
        "pending":       t.text3,
        "partially shipped": t.orange,
      };
      function statusColor(st){ return STATUS_COLORS[st.toLowerCase()] || t.text2; }
      return (
        <div className="card" style={{marginBottom:10}}>
          <div className="ch">Active Purchase Orders</div>
          {poRows.length === 0 ? (
            <div style={{fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"6px 0"}}>
              No active POs for this SKU
            </div>
          ) : (
            <>
              <div className="tw" style={{marginBottom:8}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      {["PO Number","Status","Ordered Qty","Date","Del. Date"].map(h=>(
                        <th key={h} style={{padding:"0 12px",height:36,fontSize:12,fontWeight:600,color:t.text3,
                          background:t.surface,
                          borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap",textAlign:"left"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poRows.map((r,i)=>{
                      const get  = makeGet([r]);
                      const poNo = s(r,get,"PO No","po no","PO Number","po_number","order_id") || `PO-${i+1}`;
                      const st   = s(r,get,"Status","status");
                      const qty  = n(r,get,"Tr Qty","tr qty","Qty","qty","Quantity","quantity");
                      const date = s(r,get,"Date","date","Created Date","created_date","Order Date");
                      const del  = s(r,get,"Date of Delivery","date_of_delivery","Delivery Date","delivery_date","Date of Completion","date_of_completion");
                      const sc   = statusColor(st);
                      return (
                        <tr key={i} style={{borderBottom:`1px solid ${t.border}`}}>
                          <td style={{padding:"7px 10px",fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",color:t.text,fontWeight:600,textAlign:"left"}}>{poNo}</td>
                          <td style={{padding:"7px 10px",textAlign:"left"}}>
                            <span style={{
                              display:"inline-block",padding:"3px 9px",borderRadius:5,fontSize:11,
                              fontWeight:600,background:sc+"22",color:sc,
                              border:`1px solid ${sc}44`,fontFamily:"'Inter',system-ui,sans-serif",whiteSpace:"nowrap",
                            }}>{st||"—"}</span>
                          </td>
                          <td style={{padding:"7px 10px",fontFamily:"'Inter',system-ui,sans-serif",fontSize:12,fontWeight:700,color:t.accent,textAlign:"left"}}>{qty>0?fmt(qty):"—"}</td>
                          <td style={{padding:"7px 10px",fontSize:11,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",textAlign:"left"}}>{date||"—"}</td>
                          <td style={{padding:"7px 10px",fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",color:del?t.green:t.text3,fontWeight:del?600:400,textAlign:"left"}}>{del||"—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{
                padding:"7px 12px",background:t.accentBg,border:`1px solid ${t.accentBdr}`,
                borderRadius:6,display:"flex",alignItems:"center",justifyContent:"space-between",
                fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",
              }}>
                <span style={{color:t.text3,fontSize:9,textTransform:"uppercase",letterSpacing:".5px"}}>
                  Total Open PO Qty ({poRows.length} PO{poRows.length!==1?"s":""})
                </span>
                <span style={{fontWeight:800,fontSize:15,color:t.accent}}>{fmt(totalOpenQty)} units</span>
              </div>
            </>
          )}
        </div>
      );
    })()}

    {/* Recommended Actions */}
    <div className="card" style={{marginBottom:10}}>
      <div className="ch">Recommended Actions</div>
      <div className="acs">
        {[{l:"Gross Requirement",v:fmt(localSuggestedPurchaseRaw),col:localSuggestedPurchaseRaw>0?t.red:t.green},
          {l:"FBA Replenishment Qty",v:fmt(pl.replenishQty),col:pl.replenishQty>0?t.yellow:t.green},
          {l:"Target Stock Level",v:fmt(pl.requiredStock,0),col:t.text}].map(k=>(
          <div key={k.l} className="ac">
            <div className="acl">{k.l}</div>
            <div className="acv" style={{color:k.col}}>{k.v}</div>
          </div>
        ))}
      </div>
      {/* Purchased Units field */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10,padding:"8px 10px",background:t.surface2,borderRadius:7,border:`1px solid ${t.border}`}}>
        <span style={{fontSize:13,fontWeight:600,color:t.text2,whiteSpace:"nowrap"}}>Purchased Units (PO Placed)</span>
        <input
          type="number" min={0} placeholder="0"
          value={currentPoUnits||""}
          onChange={e=>setPoUnits(sku.asin, e.target.value)}
          style={{width:80,background:"transparent",border:`1px solid ${t.border}`,
            borderRadius:4,color:t.green,padding:"3px 7px",fontSize:13,
            textAlign:"right",outline:"none",fontFamily:"'Inter',system-ui,sans-serif",fontWeight:700}}
        />
        {currentPoUnits>0&&<span style={{fontSize:10,color:t.text3}}>deducting <span style={{color:t.green,fontWeight:700}}>{fmt(currentPoUnits)}</span> units on order</span>}
        <span style={{marginLeft:"auto",fontSize:13,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif",color:localSuggestedPurchase>0?t.accent:t.green}}>
          Still need: {localSuggestedPurchase>0?fmt(localSuggestedPurchase)+" units":"✓ Covered"}
        </span>
      </div>

      {/* ── PO Deduction Tip ── */}
      {totalOpenPoQty > 0 && (
        <div style={{
          marginTop:8,padding:"9px 12px",borderRadius:7,fontSize:11,
          background: fullyCoveredByPos ? t.green+"18" : t.accent+"14",
          border:`1px solid ${fullyCoveredByPos ? t.green+"44" : t.accent+"44"}`,
          fontFamily:"'Inter',system-ui,sans-serif",
        }}>
          {fullyCoveredByPos ? (
            <span style={{color:t.green,fontWeight:700}}>
              ✅ Fully covered by open POs — no new order needed.
              &nbsp;<span style={{fontWeight:400,color:t.text3}}>
                ({skuPoRows.length} active PO{skuPoRows.length!==1?"s":""} · {fmt(totalOpenPoQty)} units in pipeline)
              </span>
            </span>
          ) : (
            <span style={{color:t.accent}}>
              💡 <strong>{fmt(totalOpenPoQty)} units</strong> across {skuPoRows.length} active PO{skuPoRows.length!==1?"s":""} deducted from gross requirement of <strong>{fmt(localSuggestedPurchaseRaw)} units</strong>.
              &nbsp;<span style={{color:t.text3}}>Still need to order: <strong style={{color:t.accent}}>{fmt(localSuggestedPurchase)} units</strong>.</span>
            </span>
          )}
        </div>
      )}
      {localSuggestedPurchase > 0 && (
        <div style={{marginTop:10,padding:"8px 10px",background:t.surface2,borderRadius:7,border:`1px solid ${t.border}`,fontSize:11}}>
          <div style={{fontSize:13,fontWeight:600,color:t.text2,marginBottom:8}}>Shipment Split</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            {splitScenario!==4&&<span>🚢 Sea: <span style={{color:t.green,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmt(localSeaQty)} units</span> <span style={{color:t.text3,fontSize:10}}>({effectiveLT}d ETA)</span></span>}
            {hasAir&&(splitScenario===3||splitScenario===4)&&localAirQty>0
              ? <span>✈ Air: <span style={{color:t.accent,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>{fmt(localAirQty)} units</span> <span style={{color:t.text3,fontSize:10}}>({effectiveAirLT}d ETA · bridge gap)</span></span>
              : hasAir&&splitScenario!==4&&<span style={{color:t.text3,fontSize:10}}>✈ Air: not required</span>
            }
          </div>
        </div>
      )}
    </div>

    {/* FC Detail */}
    {hasFCData&&fcPlanning&&<div className="card" style={{marginBottom:10}}>
      <div className="ch">FC Breakdown</div>
      <div className="tw ts" style={{maxHeight:250,overflowY:"auto"}}>
        <table>
          <thead><tr>
            <th>FC Location</th><th>Sellable</th><th>Demand/Day</th>
            <th>FC DOI</th><th>In Transit</th><th>Unsellable</th>
            <th style={{textAlign:"right"}}>Inbound</th><th>Status</th>
          </tr></thead>
          <tbody>{fcPlanning.fcs.map(fc=>(
            <tr key={fc.fc}>
              <td style={{color:t.text,fontSize:12}}>{fc.label}</td>
              <td>{fmt(fc.stock)}</td>
              <td>{fc.demand>0?fmt(fc.demand,2):"—"}</td>
              <td>{fc.demand>0?(isFinite(fc.doi)?<span style={{color:FC_STATUS_COLOR[fc.status],fontWeight:700}}>{fmt(fc.doi,1)}d</span>:<span style={{color:t.green}}>∞</span>):"—"}</td>
              <td>{fc.inTransit>0?<span style={{color:t.accent}}>{fmt(fc.inTransit)}</span>:"—"}</td>
              <td>{fc.unsellable>0?<span style={{color:t.yellow}}>{fmt(fc.unsellable)}</span>:"—"}</td>
              <td style={{textAlign:"right"}}>
                <input
                  type="number"
                  min={0}
                  placeholder="—"
                  value={fcInbound[`${sku.asin}::${fc.fc}`]??''}
                  onChange={e=>setFcInboundVal(sku.asin, fc.fc, e.target.value)}
                  onClick={e=>e.stopPropagation()}
                  style={{
                    width:58,background:"transparent",border:`1px solid ${t.border}`,
                    borderRadius:4,color:t.accent,padding:"2px 5px",
                    fontSize:11,textAlign:"right",outline:"none",
                    fontFamily:"'Inter',system-ui,sans-serif",
                  }}
                />
              </td>
              <td><span className="badge" style={{background:`${FC_STATUS_COLOR[fc.status]}18`,color:FC_STATUS_COLOR[fc.status],border:`1px solid ${FC_STATUS_COLOR[fc.status]}40`}}>{fc.status.toUpperCase()}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {fcPlanning.recommendations.length>0&&<div style={{marginTop:10}}>
        <div style={{fontSize:13,fontWeight:600,color:t.text2,marginBottom:8}}>Send-Stock Recommendations</div>
        {fcPlanning.recommendations.map(r=>{
          const inboundOffset = fcInbound[`${sku.asin}::${r.fc}`]||0;
          const finalNeeded = Math.max(0, r.needed - inboundOffset);
          return(
          <div key={r.fc} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:t.surface2,borderRadius:7,border:`1px solid ${t.border}`,marginBottom:5,fontSize:11}}>
            <span className="badge" style={{background:`${FC_STATUS_COLOR[r.status]}18`,color:FC_STATUS_COLOR[r.status],border:`1px solid ${FC_STATUS_COLOR[r.status]}40`}}>{r.status.toUpperCase()}</span>
            <span style={{flex:1,color:t.text}}>{r.label}</span>
            <span style={{color:t.text3}}>DOI: {isFinite(r.doi)?fmt(r.doi,1)+"d":"∞"}</span>
            {inboundOffset>0&&<span style={{color:t.text3,fontSize:10,fontFamily:"'Inter',system-ui,sans-serif"}}>−{fmt(inboundOffset)} inbound</span>}
            <span style={{color:finalNeeded>0?t.accent:t.green,fontWeight:700,fontFamily:"'Inter',system-ui,sans-serif"}}>
              {finalNeeded>0?`Send: ${fmt(finalNeeded)} units`:"✓ Covered"}
            </span>
          </div>
          );
        })}
      </div>}
    </div>}
    {!hasFCData&&<div className="alert ab" style={{marginBottom:10}}>ℹ No ledger data — FC-level analysis unavailable.</div>}

    {/* ── 30-DAY SALES TREND ── */}
    {salesHistory&&salesHistory.length>1&&(
    <div className="card" style={{marginBottom:10}}>
      <div className="ch">Sales — Last 30 Days</div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={salesHistory} margin={{top:8,right:16,left:0,bottom:0}}>
          <CartesianGrid stroke={t.border} strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="date" tickFormatter={dt=>{const p=dt.split("-");return `${p[2]}/${p[1]}`;}}
            tick={{fill:t.text3,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}} axisLine={false} tickLine={false}
            interval={Math.max(0,Math.floor(salesHistory.length/8)-1)}/>
          <YAxis tick={{fill:t.text3,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif"}} axisLine={false} tickLine={false} width={36}/>
          <Tooltip
            labelFormatter={dt=>{const p=dt.split("-");return `${p[2]}/${p[1]}/${p[0]}`;}}
            formatter={v=>[fmt(v),"Units sold"]}
            contentStyle={{background:t.tooltipBg,border:`1px solid ${t.border}`,borderRadius:8,fontSize:12,fontFamily:"'Inter',system-ui,sans-serif",boxShadow:"0 4px 12px rgba(0,0,0,.08)"}}
            labelStyle={{color:t.text2}} itemStyle={{color:t.accent}}/>
          <Line type="monotone" dataKey="units" stroke={t.accent} strokeWidth={2} dot={false} activeDot={{r:4}}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
    )}

    {/* ── INDIA REGIONAL HEATMAP ── */}
    <div className="card" style={{marginBottom:10}}>
      <div className="ch">India Regional Demand & Stock Heatmap</div>
      <IndiaHeatmap regionalSales={regionalSales} fcPlanning={fcPlanning} settings={settings} velocity={vel} t={t}/>
    </div>

    {/* ── TOP CITIES ── */}
    <div className="card" style={{marginBottom:10}}>
      <div className="ch">Top Cities by Demand</div>
      <TopCities citySales={citySales} t={t}/>
    </div>

    {/* ── 70-DAY FORECAST with Reorder Line ── */}
    <div className="card">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div className="ch" style={{marginBottom:0}}>70-Day Inventory Forecast</div>
        <div style={{display:"flex",gap:14,alignItems:"center",fontSize:9,fontFamily:"'Inter',system-ui,sans-serif"}}>
          <span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:14,height:2,background:t.accent,display:"inline-block",borderRadius:1}}/>
            <span style={{color:t.text3}}>Stock</span>
          </span>
          {reorderStock>0&&<span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:14,height:2,background:t.yellow,display:"inline-block",borderRadius:1,opacity:.8,borderTop:"2px dashed "+t.yellow}}/>
            <span style={{color:t.yellow}}>Reorder level ({fmt(reorderStock)} units)</span>
          </span>}
          {soi>0&&<span style={{display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:2,height:10,background:t.red,display:"inline-block"}}/>
            <span style={{color:t.red}}>Stockout</span>
          </span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={forecast} margin={{top:24,right:60,left:0,bottom:4}}>
          <CartesianGrid strokeDasharray="3 3" stroke={t.border}/>
          <XAxis dataKey="date" tick={{fill:t.text3,fontSize:11}} interval={Math.ceil(forecast.length/10)}/>
          <YAxis tick={{fill:t.text3,fontSize:10}}
            domain={[0, Math.ceil(Math.max(sku.currentStock, reorderStock) * 1.12)]}/>
          <Tooltip contentStyle={{background:"#1f2937",border:"1px solid #374151",borderRadius:8,fontSize:11}}
            itemStyle={{color:"#f9fafb"}} labelStyle={{color:"#d1d5db"}}/>
          {/* Reorder level horizontal line — always visible since Y-axis scales to include it */}
          {reorderStock>0&&(
            <ReferenceLine y={reorderStock} stroke={t.yellow} strokeDasharray="6 3" strokeWidth={1.5}
              label={{value:`Reorder: ${fmt(reorderStock)}`,fill:t.yellow,fontSize:9,position:"insideTopLeft",offset:4}}/>
          )}
          {/* Stockout date vertical line — label pushed inside left so it doesn't clip */}
          {soi>0&&(
            <ReferenceLine x={forecast[soi]?.date} stroke={t.red} strokeDasharray="4 2" strokeWidth={1.5}
              label={{value:"Stockout",fill:t.red,fontSize:9,position:"insideTopLeft"}}/>
          )}
          <Line type="monotone" dataKey="stock" stroke={t.accent} strokeWidth={2} dot={false}/>
        </LineChart>
      </ResponsiveContainer>
      {soi>0&&<div style={{marginTop:6,fontSize:9,color:t.red,fontFamily:"'Inter',system-ui,sans-serif"}}>
        ⚠ Projected stockout in ~{soi} days ({fmtDate(new Date((sku._anchor||getToday()).getTime()+soi*86400000))})
      </div>}
      {reorderStock>0&&sku.currentStock<=reorderStock&&<div style={{marginTop:4,fontSize:9,color:t.yellow,fontFamily:"'Inter',system-ui,sans-serif"}}>
        ⚡ Current stock is at or below the reorder level — purchase recommended
      </div>}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   SKU MANAGER
═══════════════════════════════════════════════════════════════ */
const CATEGORY_OPTIONS = [
  "Active","Paused","Discontinued","Seasonal","New Launch",
  "Low Priority","High Priority","Pending Restock","Under Review"
];

function SKUManager({skuCfg,setSkuCfg,data,settings,setSettings,t}){
  const[search,setSearch]=useState("");
  const[filterStatus,setFilterStatus]=useState("all");
  const[editingNote,setEditingNote]=useState(null);
  const[noteValue,setNoteValue]=useState("");
  const[selected,setSelected]=useState(new Set());

  const allAsins=Object.keys(SKU_MAP);
  const rows=allAsins.map(asin=>{
    const cfg=skuCfg[asin]||{active:true,note:"",category:"Active"};
    const liveData=data?.[asin];
    return{
      asin,finalName:SKU_MAP[asin].finalName,sellerSku:SKU_MAP[asin].sellerSku,
      active:cfg.active!==false,note:cfg.note||"",
      category:cfg.category||(cfg.active===false?"Paused":"Active"),
      demand:liveData?.velocity?.demand??null,doi:liveData?.planning?.doi??null,
      stock:liveData?.currentStock??null,action:liveData?.planning?.action??null,
      priority:liveData?.planning?.priority??null,hasLiveData:!!liveData,
    };
  });

  const filtered=rows
    .filter(r=>filterStatus==="active"?r.active:filterStatus==="inactive"?!r.active:true)
    .filter(r=>!search||r.finalName.toLowerCase().includes(search.toLowerCase())||r.asin.includes(search)||r.sellerSku.toLowerCase().includes(search.toLowerCase())||r.note.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>{if(a.active!==b.active)return a.active?1:-1;return a.finalName.localeCompare(b.finalName);});

  const activeCount=rows.filter(r=>r.active).length;
  const inactiveCount=rows.filter(r=>!r.active).length;

  function toggle(asin){
    const cur=skuCfg[asin]||{active:true};
    const nowActive=cur.active!==false;
    setSkuCfg({...skuCfg,[asin]:{...cur,active:!nowActive,category:!nowActive?"Active":(cur.category||"Paused")}});
  }
  function setNote(asin,note){
    const cur=skuCfg[asin]||{active:true};
    setSkuCfg({...skuCfg,[asin]:{...cur,note}});
    setEditingNote(null);
  }
  function setCategory(asin,category){
    const cur=skuCfg[asin]||{active:true};
    setSkuCfg({...skuCfg,[asin]:{...cur,category}});
  }
  function toggleSelect(asin){const next=new Set(selected);next.has(asin)?next.delete(asin):next.add(asin);setSelected(next);}
  function selectAll(){setSelected(new Set(filtered.map(r=>r.asin)));}
  function clearSelect(){setSelected(new Set());}
  function bulkSetActive(active){
    const updates={};
    selected.forEach(asin=>{const cur=skuCfg[asin]||{active:true};updates[asin]={...cur,active,category:active?"Active":(cur.category==="Active"?"Paused":cur.category)};});
    setSkuCfg({...skuCfg,...updates});setSelected(new Set());
  }
  function bulkSetCategory(category){
    const updates={};
    selected.forEach(asin=>{const cur=skuCfg[asin]||{active:true};updates[asin]={...cur,category};});
    setSkuCfg({...skuCfg,...updates});setSelected(new Set());
  }
  function resetAll(){if(window.confirm("Reset all SKU config to defaults?"))setSkuCfg({...DEFAULT_SKU_CONFIG});}
  const doiColor=(doi)=>{if(!isFinite(doi)||doi>999)return t.green;if(doi<7)return t.red;if(doi<21)return t.yellow;return t.green;};

  return(<div>
    <SBar settings={settings} setSettings={setSettings} t={t}/>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14,gap:12,flexWrap:"wrap"}}>
      <div>
        <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:4}}>SKU Manager</div>
        <div style={{fontSize:10,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>
          Toggle SKUs active/inactive · Add notes · Set categories · Changes apply instantly
        </div>
      </div>
      <button className="btn bs" onClick={resetAll} style={{fontSize:11}}>↺ Reset Defaults</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
      {[{l:"Total SKUs",v:allAsins.length,c:""},{l:"Active",v:activeCount,c:"g",sub:"In calculations"},{l:"Inactive",v:inactiveCount,c:"r",sub:"Excluded"},{l:"In Calculations",v:data?Object.keys(data).length:"—",c:"",sub:"Currently loaded"}].map(k=>(
        <div key={k.l} className={`kc ${k.c}`}>
          <div className="kl">{k.l}</div>
          <div className="kv" style={{color:k.c==="r"?t.red:k.c==="g"?t.green:t.text}}>{k.v}</div>
          {k.sub&&<div className="ks">{k.sub}</div>}
        </div>
      ))}
    </div>
    <div className="alert ab" style={{marginBottom:12}}>
      <span>ℹ</span><span>Inactive SKUs are <strong>completely excluded</strong> from all views and calculations. Stored in localStorage.</span>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
      <div className="sbox"><span style={{color:t.text3}}>⌕</span><input placeholder="Search name, ASIN, SKU, note…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <select className="sel" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
        <option value="all">All SKUs ({rows.length})</option>
        <option value="active">Active ({activeCount})</option>
        <option value="inactive">Inactive ({inactiveCount})</option>
      </select>
      {selected.size>0&&(
        <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}>
          <span style={{fontSize:10,color:t.accent,fontFamily:"'Inter',system-ui,sans-serif"}}>{selected.size} selected</span>
          <button className="btn bp" style={{fontSize:10,padding:"4px 9px"}} onClick={()=>bulkSetActive(true)}>✓ Activate</button>
          <button className="btn" style={{fontSize:10,padding:"4px 9px",background:t.redBg,color:t.red,border:`1px solid ${t.redBdr}`}} onClick={()=>bulkSetActive(false)}>✕ Deactivate</button>
          <select className="sel" style={{fontSize:10}} defaultValue="" onChange={e=>{if(e.target.value)bulkSetCategory(e.target.value);}}>
            <option value="">Set category…</option>
            {CATEGORY_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <button className="btn bs" style={{fontSize:10,padding:"4px 9px"}} onClick={clearSelect}>Clear</button>
        </div>
      )}
      {selected.size===0&&<button className="btn bs" style={{fontSize:10,padding:"4px 9px",marginLeft:4}} onClick={selectAll}>Select All</button>}
      <span style={{marginLeft:"auto",fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>{filtered.length} SKUs shown</span>
    </div>
    <div className="card" style={{padding:0,overflow:"hidden"}}>
      <div className="tw ts">
        <table>
          <thead><tr>
            <th style={{width:32}}><input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={e=>e.target.checked?selectAll():clearSelect()} style={{cursor:"pointer"}}/></th>
            <th>Status</th><th>SKU Name</th><th>ASIN</th><th>Seller SKU</th><th>Category</th><th>Note</th>
            {data&&<><th>DOI</th><th>Stock</th><th>Demand/Day</th><th>Action</th></>}
          </tr></thead>
          <tbody>{filtered.map(r=>(
            <tr key={r.asin} style={{opacity:r.active?1:.55}}>
              <td><input type="checkbox" checked={selected.has(r.asin)} onChange={()=>toggleSelect(r.asin)} style={{cursor:"pointer"}}/></td>
              <td>
                <button onClick={()=>toggle(r.asin)} style={{padding:"4px 12px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:500,fontFamily:"'Inter',system-ui,sans-serif",background:r.active?t.greenBg:t.redBg,color:r.active?t.green:t.red,border:`1px solid ${r.active?t.greenBdr:t.redBdr}`,transition:"all .15s"}}>
                  {r.active?"● ACTIVE":"○ INACTIVE"}
                </button>
              </td>
              <td><div className="tn" style={{maxWidth:180}}>{r.finalName}</div></td>
              <td><span style={{fontSize:10,fontFamily:"'Inter',system-ui,sans-serif",color:t.text3}}>{r.asin}</span></td>
              <td><span style={{fontSize:10,color:t.text2,fontFamily:"'Inter',system-ui,sans-serif"}}>{r.sellerSku}</span></td>
              <td>
                <select value={r.category} onChange={e=>setCategory(r.asin,e.target.value)} style={{padding:"3px 6px",background:t.surface2,border:`1px solid ${t.border}`,borderRadius:6,color:t.text2,fontSize:10,cursor:"pointer",fontFamily:"'Inter',system-ui,sans-serif",outline:"none"}}>
                  {CATEGORY_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </td>
              <td style={{minWidth:180}}>
                {editingNote===r.asin?(
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <input autoFocus value={noteValue} onChange={e=>setNoteValue(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter")setNote(r.asin,noteValue);if(e.key==="Escape")setEditingNote(null);}}
                      style={{flex:1,padding:"3px 7px",background:t.surface2,border:`1px solid ${t.accent}`,borderRadius:5,color:t.text,fontSize:11,fontFamily:"'Inter',system-ui,sans-serif",outline:"none"}}
                      placeholder="Add note…"/>
                    <span style={{cursor:"pointer",color:t.green,fontSize:14}} onClick={()=>setNote(r.asin,noteValue)}>✓</span>
                    <span style={{cursor:"pointer",color:t.text3,fontSize:14}} onClick={()=>setEditingNote(null)}>✕</span>
                  </div>
                ):(
                  <div onClick={()=>{setEditingNote(r.asin);setNoteValue(r.note);}} style={{cursor:"pointer",fontSize:10,color:r.note?t.text2:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"3px 0",borderBottom:`1px dashed ${t.border2}`,minWidth:120}} title="Click to edit">
                    {r.note||<span style={{opacity:.4}}>click to add note…</span>}
                  </div>
                )}
              </td>
              {data&&<>
                <td>{r.hasLiveData?<span style={{color:doiColor(r.doi),fontWeight:700}}>{isFinite(r.doi)&&r.doi<999?fmt(r.doi,1)+"d":"∞"}</span>:<span style={{color:t.text3,fontSize:9}}>inactive</span>}</td>
                <td>{r.hasLiveData?fmt(r.stock):"—"}</td>
                <td>{r.hasLiveData?fmt(r.demand,2):"—"}</td>
                <td>{r.hasLiveData?<PBadge action={r.action} priority={r.priority} purchasePct={r.purchasePct||0} replenishPct={r.replenishPct||0} t={t}/>:<span className="badge bgr"><span className="dot gr"></span>excluded</span>}</td>
              </>}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
    <div style={{marginTop:12,display:"flex",gap:8,alignItems:"center"}}>
      <button className="btn bs" style={{fontSize:11}} onClick={()=>{
        const blob=new Blob([JSON.stringify(skuCfg,null,2)],{type:"application/json"});
        const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="sku_config.json";a.click();URL.revokeObjectURL(url);
      }}>↓ Export Config JSON</button>
      <span style={{fontSize:9,color:t.text3,fontFamily:"'Inter',system-ui,sans-serif"}}>Save config to file. To hard-code, paste into DEFAULT_SKU_CONFIG.</span>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function FBAPlanner(){
  const dataInputRef=useRef(null);
  const[dark,setDark]=useState(true);
  const[parseDebug,setParseDebug]=useState(null);
  const t=dark?DARK:LIGHT;
  const[tab,setTab]=useState("input");
  const[col,setCol]=useState(false);
  const[rawData,setRawData]=useState(null);
  const[data,setData]=useState(null);
  const[warnings,setWarnings]=useState([]);
  const[loading,setLoading]=useState(false);
  const[selSku,setSelSku]=useState(null);
  const[settings,setSettings]=useState({totalLeadTime:0,safetyDays:30,fbaCoverDays:30,inclFBA:true,inclFC:true,inclInbound:true,inclTransfer:true});
  const[skuCfg,setSkuCfgRaw]=useState(()=>loadSkuConfig());
  const setSkuCfg=cfg=>{setSkuCfgRaw(cfg);saveSkuConfig(cfg);};
  const[poUnits,setPoUnitsRaw]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("fba_po_units")||"{}");}catch(_){return {};}
  });
  const setPoUnits=(asin,val)=>{
    setPoUnitsRaw(prev=>{
      const next={...prev};
      const n=parseInt(val,10);
      if(!val||isNaN(n)||n<=0) delete next[asin]; else next[asin]=n;
      try{localStorage.setItem("fba_po_units",JSON.stringify(next));}catch(_){}
      return next;
    });
  };

  // Clear any stale adjustment multipliers from previous sessions
  useEffect(()=>{ try { localStorage.removeItem("fba_sales_adj"); } catch(_) {} },[]);

  const onLoaded=useCallback(({invRows,ordRows,ledRows,ltRows,purchRows,fbaInvRows,debug})=>{
    const{inv,warnings:iw}=processInventory(invRows,fbaInvRows);
    const{salesByAsinDay,salesByAsinDayChart,warnings:ow,maxDate,minSalesDate,regionalSales,citySales,lastOrderDate}=processOrders(ordRows);
    const{fcData,ledgerDate}=processLedger(ledRows||[]);
    const ltData=processLeadtime(ltRows||[]);
    const openPoMap=buildOpenPoMap(purchRows||[]);
    setWarnings([...iw,...ow]);
    setParseDebug(debug||null);
    setRawData({inv,salesByAsinDay,salesByAsinDayChart,fcData,ltData,openPoMap,purchRows:purchRows||[],maxDate,minSalesDate,ledgerDate,regionalSales,citySales,lastOrderDate});
  },[]);

  useEffect(()=>{
    if(!rawData) return;
    const activeInv={};
    Object.keys(rawData.inv).forEach(asin=>{
      if(isActive(skuCfg,asin)) activeInv[asin]=rawData.inv[asin];
    });
    setData(computeAll(activeInv,rawData.salesByAsinDay,rawData.fcData,settings,rawData.maxDate,rawData.regionalSales,rawData.citySales,rawData.ltData,poUnits,rawData.lastOrderDate,rawData.salesByAsinDayChart));
    if(tab==="input") setTab("dashboard");
  },[rawData,settings,skuCfg,poUnits]);

  const wc=warnings.filter(w=>w.type.includes("unmapped")).length;
  const fcCrit=data?Object.values(data).filter(d=>
    d.fcPlanning?.fcs?.some(f=>f.status==="stockout"||f.status==="critical")
  ).length:0;
  const critCount=data?Object.values(data).reduce((s,d)=>
    s+(d.fcPlanning?.fcs?.filter(f=>f.status==="stockout"||f.status==="critical").length||0),0
  ):0;
  const inactiveCount=Object.values(skuCfg).filter(c=>c.active===false).length;

  const procCrit=data?Object.values(data).filter(d=>{
    if(!rawData?.ltData) return false;
    const lt=rawData.ltData[d.asin];
    if(!lt) return false;
    const wfAds=d.velocity.demand;
    const totalInv=(d.fbaAvailable||0)+(d.fcSellable||0);
    const doh=wfAds>0?totalInv/wfAds:Infinity;
    return wfAds>0&&(totalInv===0||(lt.air?.total&&doh<lt.air.total)||(lt.sea?.total&&doh<lt.sea.total));
  }).length:0;

  const TITLES={input:"Data Input",dashboard:"Dashboard",allskus:"All SKUs",
    fc:"FC View",lis:"LIS — Send Stock",procurement:"Procurement Forecast",
    skumgr:"SKU Manager",warnings:"Data Quality"};
  const pageTitle = tab==="detail"&&selSku&&data?.[selSku]
    ? data[selSku].finalName
    : (TITLES[tab]||"Dashboard");

  const TABS=[
    {id:"input",ic:"IN",l:"Data Input"},
    {id:"dashboard",ic:"DB",l:"Dashboard"},
    {id:"allskus",ic:"SKU",l:"All SKUs"},
    {id:"fc",ic:"FC",l:"FC View",badge:fcCrit,bc:"b"},
    {id:"lis",ic:"LIS",l:"LIS",badge:critCount||null,bc:"r"},
    {id:"procurement",ic:"PR",l:"Procurement",badge:procCrit,bc:""},
    {id:"skumgr",ic:"MG",l:"SKU Manager",badge:inactiveCount||null,bc:"y"},
    {id:"warnings",ic:"DQ",l:"Data Quality",badge:wc},
  ];

  const goSku=asin=>{setSelSku(asin);setTab("detail");};

  // Anchor date for display
  const anchorLabel = rawData?.maxDate ? `Data: ${fmtDate(rawData.maxDate)}` : fmtDate(getToday());

  return(<>
    <style>{makeCSS(t)}</style>
    <div id="fba-root">
      {/* SIDEBAR */}
      <div className={`sb${col?" col":""}`}>
        <div className="sb-logo">
          {LOGO_ICON}
          <div className="sb-txt"><h1>Inventory Forecast</h1></div>
        </div>
        <div className="sb-nav">
          <div className="sb-sec">
            <div className="sb-lbl">Navigation</div>
            {TABS.map(tb=>{
              const disabled=tb.id!=="input"&&!data&&tb.id!=="warnings";
              return(
                <div key={tb.id}
                  className={`ni${tab===tb.id||(tab==="detail"&&tb.id==="allskus")?" on":""}${disabled?" disabled":""}`}
                  onClick={()=>{if(disabled)return;setSelSku(null);setTab(tb.id);}}>
                  <span className="ni-ic">{NAV_ICONS[tb.id]}</span>
                  <span className="ni-txt">{tb.l}</span>
                  {tb.badge>0&&<span className={`nb${tb.bc?" "+tb.bc:""}`}>{tb.badge}</span>}
                </div>
              );
            })}
          </div>
          {data&&!col&&<div className="sb-sec">
            <div
  style={{
    padding:"5px 8px",
    marginTop:12,
    paddingTop:8,
    borderTop:"1px solid rgba(255,255,255,.06)",
    color:"rgba(186, 170, 255, 0.28)",
    fontSize:8,
    letterSpacing:1.4,
    fontFamily:"'Inter',system-ui,sans-serif",
  }}
>
    Designed for Helett
</div>
          </div>}
        </div>
        <div className="sb-foot" onClick={()=>setCol(c=>!c)}>
          <svg className="sb-foot-icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {col?<polyline points="11,5 7,9 11,13"/>:<polyline points="7,5 11,9 7,13"/>}
          </svg>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <div style={{overflow:"hidden",minWidth:0}}>
            <div className="tb-title">{pageTitle}</div>
            {data&&<div className="tb-sub">
              {Object.keys(data).length} SKUs · Safety {settings.safetyDays}d · +{settings.totalLeadTime}d delay · {anchorLabel}
            </div>}
          </div>
          <div className="tb-r">
            {rawData?.minSalesDate&&rawData?.maxDate&&(
              <span className="tb-badge" style={{
                fontSize:9,background:t.surface2,border:`1px solid ${t.border}`,
                color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"3px 8px",borderRadius:5,
              }}>
                Sales {rawData.minSalesDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})} – {rawData.maxDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
              </span>
            )}
            {rawData?.ledgerDate&&(
              <span className="tb-badge" style={{
                fontSize:9,background:t.surface2,border:`1px solid ${t.border}`,
                color:t.text3,fontFamily:"'Inter',system-ui,sans-serif",padding:"3px 8px",borderRadius:5,
              }}>
                Ledger {rawData.ledgerDate.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
              </span>
            )}
            
            <button className="tb-btn" onClick={()=>dataInputRef.current?.refreshSheets()} disabled={loading} title="Re-fetch data from Google Sheets">{loading?"Refreshing…":"⟳ Refresh"}</button>
            <button className="tb-btn-accent" onClick={()=>setDark(d=>!d)}>{dark?"Light":"Dark"}</button>
          </div>
        </div>
        <div className="content">
          <div style={{display:tab==="input"?"block":"none"}}>
            <DataInput ref={dataInputRef} onLoaded={onLoaded} loading={loading} setLoading={setLoading} t={t} parseDebug={parseDebug}/>
            {loading&&<div className="ld"><div className="sp"/><div style={{fontSize:11,color:t.text3}}>Processing data…</div></div>}
          </div>
          {data&&<div style={{display:tab==="allskus"?"block":"none"}}><AllSKUs data={data} settings={settings} setSettings={setSettings} onSku={goSku} t={t}/></div>}
          {tab==="dashboard"&&data&&<Dashboard data={data} settings={settings} setSettings={setSettings} onSku={goSku} t={t}/>}
          {tab==="fc"&&data&&<FCView data={data} settings={settings} setSettings={setSettings} onSku={goSku} t={t}/>}
          {tab==="lis"&&data&&<LISView data={data} settings={settings} setSettings={setSettings} onSku={goSku} t={t}/>}
          {tab==="procurement"&&data&&<ProcurementForecast data={data} ltData={rawData?.ltData} anchorDate={rawData?.maxDate} openPoMap={rawData?.openPoMap||{}} settings={settings} t={t}/>}
          {tab==="skumgr"&&<SKUManager skuCfg={skuCfg} setSkuCfg={setSkuCfg} data={data} settings={settings} setSettings={setSettings} t={t}/>}
          {tab==="warnings"&&<WarningsPage warnings={warnings} t={t}/>}
          {tab==="detail"&&data&&selSku&&(
            <SKUDetail
              sku={data[selSku]}
              onBack={()=>setTab("allskus")}
              settings={settings}
              setSettings={setSettings}
              t={t}
              poUnits={poUnits}
              setPoUnits={setPoUnits}
              purchRows={rawData?.purchRows||[]}
            />
          )}
          {!data&&tab!=="input"&&tab!=="warnings"&&(
            <div className="empty">
              <div className="empty-ic">📊</div>
              <h3>No Data Loaded</h3>
              <p>Go to Data Input to upload CSVs<br/>or connect your Google Sheets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>);
}
