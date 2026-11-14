import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import {
  LayoutGrid, ShieldCheck, Activity, TrendingUp, TrendingDown, Minus, Search, ChevronRight,
  ChevronLeft, Moon, BarChart3, Wallet, ArrowUpRight, ArrowDownRight, CircleDot, Filter,
  ShieldAlert, Target, Gauge, Info, AlertTriangle, RefreshCw, Sparkles, ArrowUpDown, Globe,
  CheckCircle2, Star
} from "lucide-react";

// ===========================================================================
// DATA LAYER 
// ===========================================================================

const RAW_CHART_SERIES = [
  { t: "Mon", price: 182.1 }, { t: "Tue", price: 184.6 }, { t: "Wed", price: 183.2 },
  { t: "Thu", price: 188.4 }, { t: "Fri", price: 191.0 }, { t: "Mon", price: 189.3 },
  { t: "Tue", price: 194.8 }, { t: "Wed", price: 198.2 }, { t: "Thu", price: 196.5 },
  { t: "Fri", price: 201.7 },
];

const RAW_INDICES = [
  { name: "Dow Jones Islamic Market", value: "5,412.30", change: 0.84, tag: "Global" },
  { name: "S&P 500 Shariah Index", value: "3,208.11", change: -0.32, tag: "US Market" },
  { name: "FTSE SET Shariah Index", value: "1,124.55", change: 1.12, tag: "Thai SET" },
];

const RAW_STOCKS = [
  // 🇺🇸 หุ้นสหรัฐอเมริกา (US Market)
  { ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF", sector: "ETF", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "PCOR", companyName: "Procore Technologies", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "SPUS", companyName: "SP Funds S&P 500 Shariah", sector: "ETF", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "AAPL", companyName: "Apple Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "MSFT", companyName: "Microsoft Corp.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "GOOGL", companyName: "Alphabet Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "ADBE", companyName: "Adobe Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "CRM", companyName: "Salesforce Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "AMD", companyName: "Advanced Micro Devices", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "CSCO", companyName: "Cisco Systems", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "TSLA", companyName: "Tesla Inc.", sector: "Consumer", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "CAT", companyName: "Caterpillar Inc.", sector: "Industrials", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "LLY", companyName: "Eli Lilly and Company", sector: "Healthcare", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "JNJ", companyName: "Johnson & Johnson", sector: "Healthcare", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "TXN", companyName: "Texas Instruments", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  // 🇹🇭 หุ้นไทย (Thai SET Market)
  { ticker: "BDMS.BK", companyName: "Bangkok Dusit Medical Services", sector: "Healthcare", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "BH.BK", companyName: "Bumrungrad Hospital PCL", sector: "Healthcare", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "ADVANC.BK", companyName: "Advanced Info Service PCL", sector: "Technology", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "HMPRO.BK", companyName: "Home Product Center PCL", sector: "Consumer", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "AOT.BK", companyName: "Airports of Thailand PCL", sector: "Industrials", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "DELTA.BK", companyName: "Delta Electronics (Thailand)", sector: "Technology", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "PTTEP.BK", companyName: "PTT Exploration & Production", sector: "Energy", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
  { ticker: "GULF.BK", companyName: "Gulf Energy Development", sector: "Utilities", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0 },
];

async function fetchMarketData() {
  try {
    const res = await fetch(`https://halal-stock-backend.onrender.com/api/stocks`);
    if (!res.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    const responseData = await res.json();
    
    if (!responseData.isReady) {
       throw new Error(`กำลังสแกนงบการเงินและกราฟเข้าคลัง (${responseData.progress}/${responseData.total}) กรุณารอสักครู่...`);
    }

    const realDataArray = responseData.data;
    const updatedStocks = RAW_STOCKS.map((mockStock) => {
      const realData = realDataArray.find(d => d.symbol === mockStock.ticker);
      if (realData && realData.price > 0) {
        const isTH = mockStock.ticker.endsWith(".BK");
        return {
          ...mockStock,
          companyName: realData.name || mockStock.companyName,
          market: realData.market || (isTH ? "TH" : "US"),
          currency: realData.currency || (isTH ? "฿" : "$"),
          currentPrice: realData.price,
          change: realData.change ? Number((realData.change).toFixed(2)) : 0,
          chartSeries: realData.chartSeries || [],
          supportLevel: realData.supportLevel || 0,
          resistanceLevel: realData.resistanceLevel || 0,
          rsi: realData.rsi || 50,
          debtRatio: realData.debtRatio || 0,
          totalDebt: realData.totalDebt || 0,
          totalAssets: realData.totalAssets || 0,
          aiBusiness: realData.aiInsight?.business || "ระบบกำลังรวบรวมข้อมูลธุรกิจ โปรดรอสักครู่...",
          aiRisk: realData.aiInsight?.halalRisk || "กำลังให้ AI ประเมินความเสี่ยงฮาลาล...",
        };
      }
      return { 
        ...mockStock, 
        aiBusiness: "กำลังรอข้อมูลจากฐานข้อมูล...", 
        aiRisk: "กำลังรอการประเมิน..." 
      };
    });

    return { stocks: updatedStocks, indices: RAW_INDICES, chartSeries: RAW_CHART_SERIES };
  } catch (error) {
    throw new Error(error.message || "กำลังเชื่อมต่อ...");
  }
}

// ===========================================================================
// BUSINESS LOGIC
// ===========================================================================

const HALAL_DEBT_THRESHOLD = 33;

function getHalalStatus(debtRatio) {
  return debtRatio <= HALAL_DEBT_THRESHOLD
    ? { halal: true, label: "Halal Pass" }
    : { halal: false, label: "Non-Halal" };
}

function getSignal(rsi) {
  if (rsi <= 30) return { status: "Strong Buy", tone: "strongbuy", rank: 1 };
  if (rsi <= 45) return { status: "Buy", tone: "buy", rank: 2 };
  if (rsi < 70) return { status: "Hold", tone: "hold", rank: 3 };
  return { status: "Sell", tone: "sell", rank: 4 };
}

function getRiskLevels(stock) {
  const pctStop = stock.currentPrice * 0.98;
  const supportStop = stock.supportLevel * 0.995;
  const stopLoss = Math.max(pctStop, supportStop);
  const targetPrice = stock.resistanceLevel * 0.99;

  const cleanStop = Math.round(stopLoss * 100) / 100;
  const cleanTarget = Math.round(targetPrice * 100) / 100;

  const upsidePct = stock.currentPrice > 0 ? ((cleanTarget - stock.currentPrice) / stock.currentPrice) * 100 : 0;
  const downsidePct = stock.currentPrice > 0 ? ((stock.currentPrice - cleanStop) / stock.currentPrice) * 100 : 0;

  // คำนวณตำแหน่งของราคาปัจจุบันระหว่างแนวรับ (0%) และแนวต้าน (100%)
  const rangeSpan = stock.resistanceLevel - stock.supportLevel;
  const rangePos = rangeSpan > 0
    ? Math.min(100, Math.max(0, Math.round(((stock.currentPrice - stock.supportLevel) / rangeSpan) * 100)))
    : 50;

  return {
    stopLoss: cleanStop,
    targetPrice: cleanTarget,
    upsidePct: Math.max(0, Number(upsidePct.toFixed(1))),
    downsidePct: Math.max(0, Number(downsidePct.toFixed(1))),
    rangePos,
  };
}

function analyzeStock(stock) {
  const debtRatio = Number(stock.debtRatio);
  const halalStatus = getHalalStatus(debtRatio);
  const signal = getSignal(stock.rsi);
  const risk = getRiskLevels(stock);
  return { ...stock, debtRatio, ...halalStatus, ...signal, ...risk };
}

function buildQuickStats(analyzedStocks, favCount) {
  const halalCount = analyzedStocks.filter((s) => s.halal).length;
  const buyCount = analyzedStocks.filter(
    (s) => s.status === "Buy" || s.status === "Strong Buy"
  ).length;
  const avgDebtRatio =
    analyzedStocks.reduce((sum, s) => sum + s.debtRatio, 0) / analyzedStocks.length;

  return [
    { label: "Halal Universe", value: `${halalCount}/${analyzedStocks.length}`, sub: "US & TH tickers passed", icon: ShieldCheck },
    { label: "Active Buy Signals", value: `${buyCount}`, sub: "Strong Buy & Buy setups", icon: Activity },
    { label: "Avg. Debt Ratio", value: `${avgDebtRatio.toFixed(1)}%`, sub: "benchmark under 33%", icon: Wallet },
    { label: "Pinned Favorites", value: `${favCount}`, sub: "your custom watchlist", icon: Star },
  ];
}

function buildRationale(stock) {
  const curr = stock.currency || "$";
  const rsiState = stock.rsi <= 30 ? "oversold" : stock.rsi >= 70 ? "overbought" : "neutral";
  const nearSupport = stock.currentPrice > 0 && (stock.currentPrice - stock.supportLevel) / stock.currentPrice < 0.06;
  const nearResistance = stock.currentPrice > 0 && (stock.resistanceLevel - stock.currentPrice) / stock.currentPrice < 0.06;

  const sentence1 = `RSI is currently at ${stock.rsi}, indicating ${rsiState} momentum.`;
  let sentence2;
  if (nearSupport) {
    sentence2 = `Price is nearing 30-day support at ${curr}${stock.supportLevel.toFixed(2)}, offering a favorable risk/reward entry zone.`;
  } else if (nearResistance) {
    sentence2 = `Price is approaching resistance at ${curr}${stock.resistanceLevel.toFixed(2)}, where short-term upside may face selling pressure.`;
  } else {
    sentence2 = `Price is trading mid-range between support (${curr}${stock.supportLevel.toFixed(2)}) and resistance (${curr}${stock.resistanceLevel.toFixed(2)}).`;
  }
  const sentence3 = `The ${stock.status} setup pairs a protective stop-loss at ${curr}${stock.stopLoss.toFixed(2)} (-${stock.downsidePct}%) with a target at ${curr}${stock.targetPrice.toFixed(2)} (+${stock.upsidePct}%).`;
  const sentence4 = stock.halal
    ? `Debt-to-Market Cap sits at ${stock.debtRatio.toFixed(1)}%, safely below the 33% Shariah limit.`
    : `Debt-to-Market Cap sits at ${stock.debtRatio.toFixed(1)}%, exceeding the 33% Shariah ceiling.`;

  return [sentence1, sentence2, sentence3, sentence4];
}

function getLiveMarketStatus() {
  const now = new Date();
  const day = now.getUTCDay();
  const time = now.getUTCHours() + now.getUTCMinutes() / 60;
  if (day === 0 || day === 6) return { isOpen: false, label: "Markets Closed (Weekend)" };

  const isTHOpen = (time >= 3.0 && time <= 5.5) || (time >= 7.0 && time <= 9.5);
  const isUSOpen = time >= 14.5 && time < 20.0;

  if (isTHOpen) return { isOpen: true, label: "🇹🇭 SET Market Open" };
  if (isUSOpen) return { isOpen: true, label: "🇺🇸 US Market Open" };
  return { isOpen: false, label: "Markets Standby" };
}

// ===========================================================================
// DESIGN TOKENS + PRESENTATIONAL ATOMS
// ===========================================================================

const EMERALD = "#10B981";
const CRIMSON = "#EF4444";
const CARD = "#131824";
const BG = "#090D16";

function Pill({ children, tone = "neutral" }) {
  const styles = {
    halal: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30",
    nonhalal: "text-rose-400 bg-rose-500/10 border border-rose-500/30",
    neutral: "text-slate-300 bg-white/5 border border-white/10",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "Strong Buy") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 px-2.5 py-1 text-xs font-bold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
        <TrendingUp size={13} /> STRONG BUY
      </span>
    );
  }
  if (status === "Buy") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-400">
        <TrendingUp size={13} /> BUY
      </span>
    );
  }
  if (status === "Sell") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 text-xs font-semibold text-rose-400">
        <TrendingDown size={13} /> SELL
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-semibold text-amber-400">
      <Minus size={13} /> HOLD
    </span>
  );
}

function MarketBadge({ market }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
      {market === "TH" ? "🇹🇭 TH" : "🇺🇸 US"}
    </span>
  );
}

// ปุ่มกดติดดาวปักหมุดหุ้นโปรด
function FavoriteButton({ isFav, onToggle, size = 15 }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={isFav ? "เอาออกจากหุ้นโปรด" : "ปักหมุดเป็นหุ้นโปรด"}
      className={`p-1.5 rounded-lg border transition-all duration-200 ${
        isFav
          ? "bg-amber-500/20 border-amber-400/50 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.25)]"
          : "bg-white/[0.03] border-white/10 text-slate-500 hover:text-amber-300 hover:border-amber-400/30"
      }`}
    >
      <Star size={size} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
    </button>
  );
}

function ChartTooltip({ active, payload, label, currency = "$" }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1B2234] px-3.5 py-2 shadow-2xl">
      <p className="text-slate-400 text-[11px]">{label}</p>
      <p className="text-white font-bold text-sm mt-0.5">{currency}{payload[0].value.toFixed(2)}</p>
    </div>
  );
}

function RsiGauge({ rsi }) {
  const rsiColor = rsi <= 30 ? "text-emerald-400" : rsi <= 45 ? "text-teal-400" : rsi >= 70 ? "text-rose-400" : "text-amber-400";
  const rsiLabel = rsi <= 30 ? "Oversold (โซนถูก)" : rsi <= 45 ? "Accumulate (สะสม)" : rsi >= 70 ? "Overbought (โซนตึง)" : "Neutral (แกว่งตัว)";

  return (
    <div className="mt-3.5">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="text-slate-400 font-medium">RSI (14D): <span className="text-slate-500 font-normal">{rsiLabel}</span></span>
        <span className={`font-bold ${rsiColor}`}>{rsi}</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/80 relative border border-white/5">
        <div className="absolute inset-0 flex">
          <div className="bg-emerald-500/30" style={{ width: "30%" }} />
          <div className="bg-teal-500/20" style={{ width: "15%" }} />
          <div className="bg-amber-500/15" style={{ width: "25%" }} />
          <div className="bg-rose-500/30" style={{ width: "30%" }} />
        </div>
        <div
          className="absolute top-0 h-full w-1.5 bg-white rounded-full shadow-[0_0_6px_#fff] transition-all duration-300"
          style={{ left: `calc(${Math.min(Math.max(rsi, 2), 98)}% - 3px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>0</span>
        <span className="text-emerald-500/80">30 (Buy)</span>
        <span>45</span>
        <span className="text-rose-500/80">70 (Sell)</span>
        <span>100</span>
      </div>
    </div>
  );
}

// หลอดวัดตำแหน่งราคาเทียบแนวรับ-แนวต้านบนการ์ดหุ้น
function PriceRangeBar({ stock }) {
  const curr = stock.currency || "$";
  return (
    <div className="mt-3 pt-2.5 border-t border-white/5">
      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
        <span>แนวรับ <strong className="text-slate-300">{curr}{stock.supportLevel.toFixed(2)}</strong></span>
        <span className="text-slate-500">กรอบราคา 30 วัน ({stock.rangePos}%)</span>
        <span>แนวต้าน <strong className="text-slate-300">{curr}{stock.resistanceLevel.toFixed(2)}</strong></span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-800/90 overflow-hidden relative">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300"
          style={{ width: `${stock.rangePos}%` }}
        />
      </div>
    </div>
  );
}

function InteractiveChart({ data, xKey, yKey, height = 256, gradientId, referenceLines = [], domain, currency = "$" }) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={EMERALD} stopOpacity={0.32} />
              <stop offset="100%" stopColor={EMERALD} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1E2638" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xKey} stroke="#4B5563" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} interval={data && data.length > 15 ? 4 : 0} />
          <YAxis domain={domain || ["dataMin - 2", "dataMax + 2"]} stroke="#4B5563" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
          <Tooltip content={<ChartTooltip currency={currency} />} />
          {referenceLines.map((rl) => (
            <ReferenceLine key={rl.label} y={rl.y} stroke={rl.color} strokeDasharray="5 5" strokeWidth={1.5} label={{ value: rl.label, position: rl.position || "insideTopRight", fill: rl.color, fontSize: 11 }} />
          ))}
          <Area type="monotone" dataKey={yKey} stroke={EMERALD} strokeWidth={2.5} fill={`url(#${gradientId})`} activeDot={{ r: 5 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// แผงควบคุมการค้นหา กรองตลาด กรองหุ้นโปรด และเรียงลำดับ
function ControlToolbar({
  query, onQueryChange,
  marketFilter, onMarketFilterChange,
  onlyHalal, onToggleHalal,
  onlyFav, onToggleFav,
  favCount,
  sortBy, onSortChange
}) {
  return (
    <div className="rounded-2xl border border-white/5 p-4 flex flex-col xl:flex-row xl:items-center gap-3 justify-between shadow-lg" style={{ backgroundColor: CARD }}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 flex-wrap">
        {/* ช่องค้นหา */}
        <div className="relative w-full sm:w-60">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาชื่อย่อ หรือ บริษัท..."
            className="w-full bg-[#090D16] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* ปุ่มสลับตลาด US / TH */}
        <div className="flex items-center gap-1 bg-[#090D16] p-1 rounded-xl border border-white/10 self-start">
          {[
            { id: "ALL", label: "ทั้งหมด" },
            { id: "US", label: "🇺🇸 US" },
            { id: "TH", label: "🇹🇭 TH" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => onMarketFilterChange(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                marketFilter === m.id
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* ปุ่มกรองเฉพาะหุ้นโปรดที่ติดดาว */}
        <button
          onClick={onToggleFav}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all self-start ${
            onlyFav
              ? "bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              : "bg-[#090D16] border-white/10 text-slate-300 hover:border-amber-400/30"
          }`}
        >
          <Star size={13} className={onlyFav ? "fill-amber-400 text-amber-400" : "text-amber-400"} />
          <span>หุ้นโปรด ({favCount})</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {/* ตัวเลือกการเรียงลำดับ (Sort) */}
        <div className="flex items-center gap-2 bg-[#090D16] border border-white/10 rounded-xl px-3 py-1.5">
          <ArrowUpDown size={14} className="text-emerald-400" />
          <span className="text-xs text-slate-400">เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-medium text-white outline-none cursor-pointer"
          >
            <option value="RSI_ASC" className="bg-[#131824]">RSI ต่ำไปสูง (น่าช้อนซื้อ)</option>
            <option value="UPSIDE_DESC" className="bg-[#131824]">เป้ากำไร (Upside %) สูงสุด</option>
            <option value="CHANGE_DESC" className="bg-[#131824]">ราคาบวกแรงสุดวันนี้</option>
            <option value="DEBT_ASC" className="bg-[#131824]">หนี้สิน (Debt %) ต่ำสุด</option>
          </select>
        </div>

        {/* สวิตช์กรองเฉพาะหุ้นฮาลาล */}
        <button
          onClick={onToggleHalal}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium border transition-all ${
            onlyHalal
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
              : "bg-[#090D16] border-white/10 text-slate-300 hover:border-white/20"
          }`}
        >
          <ShieldCheck size={14} className={onlyHalal ? "text-emerald-400" : "text-slate-500"} />
          เฉพาะฮาลาล
          <span className={`ml-1 w-8 h-4 rounded-full relative transition-colors ${onlyHalal ? "bg-emerald-500" : "bg-slate-700"}`}>
            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${onlyHalal ? "left-4" : "left-0.5"}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

// การ์ดสัญญาณเทรดดีไซน์ใหม่: แยกโทนสีตามสัญญาณ + ปุ่มติดดาว + หลอดวัดแนวรับแนวต้าน
function StockCard({ stock, onSelect, isFav, onToggleFav }) {
  const curr = stock.currency || "$";
  const isPositive = stock.change >= 0;

  // แยกโทนสีพื้นหลังและขอบการ์ดตามสัญญาณซื้อขายและสถานะติดดาว
  let cardToneClasses = "border-white/5 hover:border-emerald-500/40 bg-[#131824]";
  if (isFav) {
    cardToneClasses = "border-amber-400/40 hover:border-amber-400/70 bg-gradient-to-b from-[#171C2B] via-[#131824] to-amber-950/15 shadow-[0_0_20px_rgba(245,158,11,0.07)]";
  } else if (stock.status === "Strong Buy") {
    cardToneClasses = "border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-b from-[#132226] via-[#131824] to-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]";
  } else if (stock.status === "Buy") {
    cardToneClasses = "border-emerald-500/20 hover:border-emerald-500/50 bg-gradient-to-b from-[#131D26] to-[#131824]";
  } else if (stock.status === "Sell") {
    cardToneClasses = "border-rose-500/30 hover:border-rose-400/60 bg-gradient-to-b from-[#221520] via-[#131824] to-rose-950/15";
  }

  return (
    <div
      onClick={() => onSelect(stock.ticker)}
      className={`group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col justify-between ${cardToneClasses}`}
    >
      <div>
        {/* แถวบนสุด: ชื่อหุ้น + ตลาด + ปุ่มติดดาว + ป้ายสัญญาณ */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-bold text-lg tracking-tight group-hover:text-emerald-400 transition-colors">
                {stock.ticker}
              </h4>
              <MarketBadge market={stock.market} />
              <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-white/[0.04]">
                {stock.sector}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[200px]">{stock.companyName}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <FavoriteButton isFav={isFav} onToggle={onToggleFav} />
            <StatusBadge status={stock.status} />
          </div>
        </div>

        {/* แถวที่สอง: ราคาปัจจุบัน + การเปลี่ยนแปลง + สถานะหนี้ฮาลาล */}
        <div className="flex items-end justify-between mt-4 pb-3 border-b border-white/5">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Current Price</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">{curr}{stock.currentPrice.toFixed(2)}</span>
              <span className={`text-xs font-semibold flex items-center ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {isPositive ? "+" : ""}{stock.change}%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border ${
              stock.halal
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}>
              {stock.halal ? <ShieldCheck size={13} /> : <CircleDot size={13} />}
              หนี้ {stock.debtRatio.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* แถบวัด RSI */}
        <RsiGauge rsi={stock.rsi} />

        {/* กล่อง Stop-Loss & Target */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="rounded-xl bg-rose-500/[0.07] border border-rose-500/25 px-3.5 py-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
              <span className="flex items-center gap-1"><ShieldAlert size={11} className="text-rose-400" /> Stop-Loss</span>
              <span className="text-rose-400 font-semibold">-{stock.downsidePct}%</span>
            </div>
            <p className="text-rose-400 font-bold text-sm mt-1">{curr}{stock.stopLoss.toFixed(2)}</p>
          </div>

          <div className="rounded-xl bg-emerald-500/[0.07] border border-emerald-500/25 px-3.5 py-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
              <span className="flex items-center gap-1"><Target size={11} className="text-emerald-400" /> Target</span>
              <span className="text-emerald-400 font-semibold">+{stock.upsidePct}%</span>
            </div>
            <p className="text-emerald-400 font-bold text-sm mt-1">{curr}{stock.targetPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* หลอดวัดตำแหน่งแนวรับ-แนวต้าน */}
        <PriceRangeBar stock={stock} />
      </div>

      {/* กล่องพรีวิวสรุป AI ด้านล่างการ์ด */}
      <div className="mt-3.5 pt-3 border-t border-white/5 flex items-start justify-between gap-2">
        <div className="flex items-start gap-1.5 min-w-0">
          <Sparkles size={13} className="text-teal-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 truncate">
            {stock.aiBusiness}
          </p>
        </div>
        <span className="text-[11px] text-emerald-400 font-medium shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
          ดูกราฟ <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
}

function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-white/5 border border-white/5 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}</div>
      <SkeletonBlock className="h-80" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)}</div>
      <p className="text-center text-slate-500 text-xs pt-2">กำลังเชื่อมต่อฐานข้อมูลหุ้น US และ TH...</p>
    </div>
  );
}

function LoadingState({ message }) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 p-10 flex flex-col items-center text-center gap-3" style={{ backgroundColor: CARD }}>
      <div className="rounded-full bg-emerald-500/10 p-3.5">
        <RefreshCw size={24} className="text-emerald-400 animate-spin" />
      </div>
      <h3 className="text-white font-semibold text-base">ระบบกำลังซิงค์ข้อมูล...</h3>
      <p className="text-emerald-400/80 text-sm max-w-md">{message || "กำลังโหลดข้อมูลอัตโนมัติ"}</p>
      <p className="text-slate-500 text-xs mt-1">หน้านี้จะอัปเดตเองอัตโนมัติเมื่อหลังบ้านสแกนเสร็จครับ</p>
    </div>
  );
}

// ===========================================================================
// VIEWS
// ===========================================================================

function DashboardView({ stocks, indices, chartSeries, quickStats, onSelectStock, onNavigateSignals, favorites, onToggleFav }) {
  const [heroTicker, setHeroTicker] = useState("AAPL");
  const hero = stocks.find((s) => s.ticker === heroTicker) || stocks[0];
  const heroCurr = hero?.currency || "$";

  // คัดหุ้นที่ผ่านฮาลาลและมีสัญญาณน่าสนใจที่สุด 4 อันดับแรก
  const topSetups = useMemo(() => {
    return [...stocks]
      .filter((s) => s.halal && s.currentPrice > 0)
      .sort((a, b) => a.rsi - b.rsi)
      .slice(0, 4);
  }, [stocks]);

  // รายการหุ้นที่ผู้ใช้ปักหมุดไว้
  const pinnedStocks = useMemo(() => {
    return stocks.filter((s) => favorites.includes(s.ticker));
  }, [stocks, favorites]);

  const quickChartTickers = ["AAPL", "SPUS", "TSLA", "BDMS.BK", "ADVANC.BK", "AOT.BK"].filter((t) =>
    stocks.some((s) => s.ticker === t)
  );

  return (
    <div className="space-y-6">
      {/* แถวที่ 1: 4 กล่องสถิติภาพรวม */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {quickStats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-2xl p-4 border border-white/5 transition-all duration-200 hover:border-emerald-500/30" style={{ backgroundColor: CARD }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">{s.label}</p>
                  <p className="text-2xl font-bold text-white mt-1.5">{s.value}</p>
                  <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
                </div>
                <div className="rounded-xl p-2.5 bg-emerald-500/10 border border-emerald-500/20">
                  <Icon size={18} className="text-emerald-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* แถวพิเศษ: แสดงรายการหุ้นโปรดที่ปักหมุดไว้ (ถ้ามี) */}
      {pinnedStocks.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-[#131824] to-[#131824] p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              รายการหุ้นโปรดที่ปักหมุดไว้ (Pinned Watchlist)
            </h3>
            <span className="text-xs text-amber-300/80">{pinnedStocks.length} รายการ</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pinnedStocks.map((s) => (
              <div
                key={s.ticker}
                onClick={() => onSelectStock(s.ticker)}
                className="p-3.5 rounded-xl bg-[#090D16]/90 border border-amber-500/25 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{s.ticker}</span>
                    <MarketBadge market={s.market} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.currency}{s.currentPrice.toFixed(2)}{" "}
                    <span className={s.change >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      ({s.change >= 0 ? "+" : ""}{s.change}%)
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <FavoriteButton isFav={true} onToggle={() => onToggleFav(s.ticker)} size={13} />
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* แถวที่ 2: กราฟ Interactive + Top Halal Buy Setups */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* กล่องกราฟหลัก */}
        <div className="xl:col-span-2 rounded-2xl border border-white/5 p-5 flex flex-col justify-between" style={{ backgroundColor: CARD }}>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-base">{hero.companyName}</h3>
                  <MarketBadge market={hero.market} />
                  <Pill tone={hero.halal ? "halal" : "nonhalal"}>
                    <ShieldCheck size={12} /> {hero.label}
                  </Pill>
                  <FavoriteButton
                    isFav={favorites.includes(hero.ticker)}
                    onToggle={() => onToggleFav(hero.ticker)}
                    size={14}
                  />
                </div>
                <div className="flex items-baseline gap-2.5 mt-1.5">
                  <span className="text-2xl font-extrabold text-white">{heroCurr}{hero.currentPrice.toFixed(2)}</span>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${hero.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {hero.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {hero.change >= 0 ? "+" : ""}{hero.change}%
                  </span>
                  <span className="text-xs text-slate-500">RSI: <strong className="text-slate-300">{hero.rsi}</strong></span>
                </div>
              </div>

              {/* ปุ่มสลับหุ้นบนกราฟหน้าแรก */}
              <div className="flex items-center gap-1.5 flex-wrap bg-[#090D16] p-1 rounded-xl border border-white/10">
                {quickChartTickers.map((t) => (
                  <button
                    key={t}
                    onClick={() => setHeroTicker(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      hero.ticker === t
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {t.replace(".BK", "")}
                  </button>
                ))}
              </div>
            </div>

            <InteractiveChart
              data={hero.chartSeries && hero.chartSeries.length > 0 ? hero.chartSeries : chartSeries}
              xKey="t"
              yKey="price"
              height={250}
              gradientId="priceFill"
              currency={heroCurr}
            />
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-md"><strong className="text-teal-400">AI สรุป:</strong> {hero.aiBusiness}</span>
            <button
              onClick={() => onSelectStock(hero.ticker)}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 shrink-0"
            >
              วิเคราะห์เจาะลึก <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* กล่องคัดหุ้นเด่นประจำวัน (Top Halal Setups) */}
        <div className="rounded-2xl border border-white/5 p-5 flex flex-col justify-between" style={{ backgroundColor: CARD }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Sparkles size={15} className="text-emerald-400" /> Top Halal Setups
                </h3>
                <p className="text-slate-500 text-xs">หุ้นผ่านเกณฑ์ฮาลาลที่ RSI ต่ำสุดตอนนี้</p>
              </div>
              <button
                onClick={onNavigateSignals}
                className="text-xs text-emerald-400 hover:underline flex items-center gap-0.5"
              >
                ดูทั้งหมด <ChevronRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {topSetups.map((s) => (
                <div
                  key={s.ticker}
                  onClick={() => onSelectStock(s.ticker)}
                  className="p-3 rounded-xl bg-[#090D16] border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{s.ticker}</span>
                      <MarketBadge market={s.market} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      RSI <strong className="text-emerald-400">{s.rsi}</strong> · เป้า +{s.upsidePct}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{s.currency}{s.currentPrice.toFixed(2)}</p>
                    <div className="mt-1">
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>คัดกรองจากหนี้สินน้อยกว่า 33%</span>
            <span className="text-emerald-400">Real-time Screened</span>
          </div>
        </div>
      </div>

      {/* แถวที่ 3: ดัชนีตลาดอิสลามโลก */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {indices.map((idx) => (
          <div key={idx.name} className="rounded-2xl border border-white/5 p-4 transition-all duration-200 hover:border-white/15" style={{ backgroundColor: CARD }}>
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-xs font-medium">{idx.name}</p>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">{idx.tag}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-white">{idx.value}</span>
              <span className={`text-sm font-semibold flex items-center gap-0.5 ${idx.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {idx.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {Math.abs(idx.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// หน้าตาราง Screener
function ScreenerView({ stocks, onSelectStock, favorites, onToggleFav }) {
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [query, setQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("RSI_ASC");

  const filtered = useMemo(() => {
    const list = stocks.filter((s) => {
      if (onlyHalal && !s.halal) return false;
      if (onlyFav && !favorites.includes(s.ticker)) return false;
      if (marketFilter !== "ALL" && s.market !== marketFilter) return false;
      if (query && !s.ticker.toLowerCase().includes(query.toLowerCase()) && !s.companyName.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    return list.sort((a, b) => {
      // ดันหุ้นติดดาวขึ้นบนสุดเสมอ
      const aFav = favorites.includes(a.ticker) ? 1 : 0;
      const bFav = favorites.includes(b.ticker) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      if (sortBy === "RSI_ASC") return a.rsi - b.rsi;
      if (sortBy === "UPSIDE_DESC") return b.upsidePct - a.upsidePct;
      if (sortBy === "CHANGE_DESC") return b.change - a.change;
      if (sortBy === "DEBT_ASC") return a.debtRatio - b.debtRatio;
      return 0;
    });
  }, [stocks, onlyHalal, onlyFav, favorites, query, marketFilter, sortBy]);

  return (
    <div className="space-y-5">
      <ControlToolbar
        query={query}
        onQueryChange={setQuery}
        marketFilter={marketFilter}
        onMarketFilterChange={setMarketFilter}
        onlyHalal={onlyHalal}
        onToggleHalal={() => setOnlyHalal((v) => !v)}
        onlyFav={onlyFav}
        onToggleFav={() => setOnlyFav((v) => !v)}
        favCount={favorites.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="rounded-2xl border border-white/5 overflow-hidden shadow-xl" style={{ backgroundColor: CARD }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-[#090D16]/60 text-left text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3.5 font-semibold w-10"></th>
                <th className="px-4 py-3.5 font-semibold">Ticker / บริษัท</th>
                <th className="px-4 py-3.5 font-semibold">หมวดธุรกิจ</th>
                <th className="px-4 py-3.5 font-semibold">ราคาล่าสุด</th>
                <th className="px-4 py-3.5 font-semibold">RSI (14D)</th>
                <th className="px-4 py-3.5 font-semibold">สัญญาณเทรด</th>
                <th className="px-4 py-3.5 font-semibold">สัดส่วนหนี้สิน</th>
                <th className="px-4 py-3.5 font-semibold">สถานะฮาลาล</th>
                <th className="px-4 py-3.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const curr = s.currency || "$";
                const isFav = favorites.includes(s.ticker);
                return (
                  <tr
                    key={s.ticker}
                    onClick={() => onSelectStock(s.ticker)}
                    className={`border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-all cursor-pointer ${
                      isFav ? "bg-amber-500/[0.04]" : ""
                    }`}
                  >
                    <td className="pl-4 pr-1 py-3.5">
                      <FavoriteButton isFav={isFav} onToggle={() => onToggleFav(s.ticker)} size={14} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 font-bold text-white">
                        {s.ticker}
                        <MarketBadge market={s.market} />
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{s.companyName}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-300 text-xs">{s.sector}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-white font-bold">{curr}{s.currentPrice.toFixed(2)}</span>
                      <span className={`ml-2 text-xs font-semibold ${s.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {s.change >= 0 ? "+" : ""}{s.change}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-bold ${s.rsi <= 30 ? "text-emerald-400" : s.rsi >= 70 ? "text-rose-400" : "text-slate-200"}`}>
                        {s.rsi}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${s.halal ? "text-emerald-400" : "text-rose-400"}`}>
                          {s.debtRatio.toFixed(1)}%
                        </span>
                        <span className="text-slate-600 text-xs">/ 33%</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {s.totalAssets > 0 ? `${curr}${s.totalDebt}M / ${curr}${s.totalAssets}M` : "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {s.halal ? (
                        <Pill tone="halal"><CheckCircle2 size={12} /> Halal Pass</Pill>
                      ) : (
                        <Pill tone="nonhalal"><AlertTriangle size={12} /> Non-Halal</Pill>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500 text-sm">
                    ไม่พบหุ้นที่ตรงกับเงื่อนไขการค้นหาในขณะนี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// หน้าสัญญาณซื้อขาย (Trading Signals)
function SignalsView({ stocks, onSelectStock, favorites, onToggleFav }) {
  const [filter, setFilter] = useState("All");
  const [marketFilter, setMarketFilter] = useState("ALL");
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("RSI_ASC");

  const signalCounts = useMemo(() => {
    return {
      All: stocks.length,
      "Strong Buy": stocks.filter((s) => s.status === "Strong Buy").length,
      Buy: stocks.filter((s) => s.status === "Buy").length,
      Hold: stocks.filter((s) => s.status === "Hold").length,
      Sell: stocks.filter((s) => s.status === "Sell").length,
    };
  }, [stocks]);

  const filtered = useMemo(() => {
    const list = stocks.filter((s) => {
      if (filter !== "All" && s.status !== filter) return false;
      if (marketFilter !== "ALL" && s.market !== marketFilter) return false;
      if (onlyHalal && !s.halal) return false;
      if (onlyFav && !favorites.includes(s.ticker)) return false;
      if (query && !s.ticker.toLowerCase().includes(query.toLowerCase()) && !s.companyName.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    return list.sort((a, b) => {
      // ดันหุ้นที่ปักหมุดไว้ขึ้นแถวบนสุดเสมอ
      const aFav = favorites.includes(a.ticker) ? 1 : 0;
      const bFav = favorites.includes(b.ticker) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      if (sortBy === "RSI_ASC") return a.rsi - b.rsi;
      if (sortBy === "UPSIDE_DESC") return b.upsidePct - a.upsidePct;
      if (sortBy === "CHANGE_DESC") return b.change - a.change;
      if (sortBy === "DEBT_ASC") return a.debtRatio - b.debtRatio;
      return 0;
    });
  }, [stocks, filter, marketFilter, onlyHalal, onlyFav, favorites, query, sortBy]);

  return (
    <div className="space-y-5">
      {/* แถบปุ่มเลือกสถานะสัญญาณ */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Strong Buy", "Buy", "Hold", "Sell"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
              filter === f
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm"
                : "bg-[#131824] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
            }`}
          >
            <span>{f}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${filter === f ? "bg-emerald-500/30 text-white" : "bg-white/5 text-slate-400"}`}>
              {signalCounts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* แผงค้นหา กรองตลาด กรองหุ้นโปรด และเรียงลำดับ */}
      <ControlToolbar
        query={query}
        onQueryChange={setQuery}
        marketFilter={marketFilter}
        onMarketFilterChange={setMarketFilter}
        onlyHalal={onlyHalal}
        onToggleHalal={() => setOnlyHalal((v) => !v)}
        onlyFav={onlyFav}
        onToggleFav={() => setOnlyFav((v) => !v)}
        favCount={favorites.length}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* ตารางการ์ดหุ้น */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((sig) => (
          <StockCard
            key={sig.ticker}
            stock={sig}
            onSelect={onSelectStock}
            isFav={favorites.includes(sig.ticker)}
            onToggleFav={() => onToggleFav(sig.ticker)}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/5 p-12 text-center text-slate-500" style={{ backgroundColor: CARD }}>
            ไม่พบสัญญาณหุ้นที่ตรงกับตัวกรองที่เลือก
          </div>
        )}
      </div>
    </div>
  );
}

function StockDetailView({ stock, onBack, isFav, onToggleFav }) {
  const series = stock.chartSeries || [];
  const rationale = useMemo(() => buildRationale(stock), [stock]);
  const curr = stock.currency || "$";

  const yMin = series.length > 0 ? Math.min(stock.stopLoss, ...series.map((p) => p.price)) * 0.985 : 0;
  const yMax = series.length > 0 ? Math.max(stock.targetPrice, ...series.map((p) => p.price)) * 1.015 : 100;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
      >
        <ChevronLeft size={15} /> กลับไปหน้าภาพรวม
      </button>

      <div className="rounded-2xl border border-white/5 p-5 flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: CARD }}>
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-white text-xl font-bold">{stock.companyName}</h2>
            <span className="text-slate-400 font-semibold text-sm">({stock.ticker})</span>
            <MarketBadge market={stock.market} />
            <FavoriteButton isFav={isFav} onToggle={onToggleFav} size={16} />
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-3xl font-extrabold text-white">{curr}{stock.currentPrice.toFixed(2)}</span>
            <span className={`text-sm font-semibold flex items-center gap-0.5 ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stock.change >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {stock.change >= 0 ? "+" : ""}{stock.change}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Pill tone={stock.halal ? "halal" : "nonhalal"}>
            <ShieldCheck size={13} /> {stock.label} (หนี้ {stock.debtRatio.toFixed(1)}%)
          </Pill>
          <StatusBadge status={stock.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-white/5 p-5" style={{ backgroundColor: CARD }}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-white text-sm font-bold">กราฟแนวโน้มราคา 30 วันย้อนหลัง</h3>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Target {curr}{stock.targetPrice.toFixed(2)} (+{stock.upsidePct}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Stop-Loss {curr}{stock.stopLoss.toFixed(2)} (-{stock.downsidePct}%)
              </span>
            </div>
          </div>
          <InteractiveChart
            data={series}
            xKey="dateLabel"
            yKey="price"
            height={320}
            gradientId="detailFill"
            domain={[yMin, yMax]}
            currency={curr}
            referenceLines={[
              { y: stock.targetPrice, color: EMERALD, label: "Target", position: "insideTopRight" },
              { y: stock.stopLoss, color: CRIMSON, label: "Stop-Loss", position: "insideBottomRight" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-white/5 p-5 flex flex-col" style={{ backgroundColor: CARD }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-lg p-1.5 bg-emerald-500/10"><Gauge size={16} className="text-emerald-400" /></div>
            <h3 className="text-white text-sm font-bold">สรุปจุดเข้าซื้อและบริหารความเสี่ยง</h3>
          </div>
          <RsiGauge rsi={stock.rsi} />
          <PriceRangeBar stock={stock} />
          <div className="mt-4 space-y-2.5">
            {rationale.map((line, i) => <p key={i} className="text-xs text-slate-300 leading-relaxed">{line}</p>)}
          </div>
          <div className="mt-auto pt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#090D16] border border-white/5 px-3 py-2.5">
              <p className="text-slate-500 text-[10px] uppercase">แนวรับ (Support)</p>
              <p className="text-slate-200 font-bold text-xs mt-0.5">{curr}{stock.supportLevel.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-[#090D16] border border-white/5 px-3 py-2.5">
              <p className="text-slate-500 text-[10px] uppercase">แนวต้าน (Resistance)</p>
              <p className="text-slate-200 font-bold text-xs mt-0.5">{curr}{stock.resistanceLevel.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2.5">
              <p className="text-rose-300/80 text-[10px] uppercase flex items-center justify-between">
                <span>Stop-Loss</span><span>-{stock.downsidePct}%</span>
              </p>
              <p className="text-rose-400 font-bold text-sm mt-0.5">{curr}{stock.stopLoss.toFixed(2)}</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2.5">
              <p className="text-emerald-300/80 text-[10px] uppercase flex items-center justify-between">
                <span>Target Price</span><span>+{stock.upsidePct}%</span>
              </p>
              <p className="text-emerald-400 font-bold text-sm mt-0.5">{curr}{stock.targetPrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* กล่องความฉลาด AI จาก Gemini */}
      <div className="rounded-2xl border border-teal-500/25 bg-gradient-to-r from-teal-900/20 to-emerald-900/10 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg p-1.5 bg-teal-500/20">
              <Sparkles size={16} className="text-teal-400" />
            </div>
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              AI Business & Halal Insight
              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30">Gemini Powered</span>
            </h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-black/30 border border-white/5 p-4">
            <p className="text-teal-400 text-xs font-bold uppercase mb-2">🏢 ภาพรวมธุรกิจและรายได้หลัก (Business)</p>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{stock.aiBusiness}</p>
          </div>
          <div className="rounded-xl bg-black/30 border border-white/5 p-4">
            <p className="text-amber-400 text-xs font-bold uppercase mb-2">⚖️ การประเมินความเสี่ยงฮาลาล (Halal Risk)</p>
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{stock.aiRisk}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// CONTAINER 
// ===========================================================================

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "signals", label: "Trading Signals", icon: Activity },
  { key: "screener", label: "Halal Screener", icon: ShieldCheck },
];

export default function HalalDashboard() {
  const [view, setView] = useState("dashboard");
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState(null);

  // ⭐ ระบบบันทึกหุ้นโปรดลงในเครื่อง (localStorage)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("halal_fav_tickers");
      return saved ? JSON.parse(saved) : ["AAPL", "BDMS.BK"];
    } catch {
      return ["AAPL", "BDMS.BK"];
    }
  });

  const toggleFavorite = useCallback((ticker) => {
    setFavorites((prev) => {
      const next = prev.includes(ticker)
        ? prev.filter((t) => t !== ticker)
        : [...prev, ticker];
      try {
        localStorage.setItem("halal_fav_tickers", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent && !marketData) setIsLoading(true);
    setIsRefreshing(true);
    try {
      const data = await fetchMarketData();
      setMarketData(data);
      setLastUpdated(new Date().toLocaleTimeString("th-TH"));
      setError(null);
    } catch (err) {
      setError(err.message || "กำลังเชื่อมต่อ...");
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, [marketData]);

  useEffect(() => { 
    loadData(); 
    const delay = marketData ? 60000 : 4000;
    const interval = setInterval(() => {
      loadData(true);
    }, delay);
    return () => clearInterval(interval);
  }, [loadData, marketData]);

  const analyzedStocks = useMemo(() => {
    if (!marketData) return [];
    return marketData.stocks.map(analyzeStock);
  }, [marketData]);

  const quickStats = useMemo(() => {
    if (!analyzedStocks.length) return [];
    return buildQuickStats(analyzedStocks, favorites.length);
  }, [analyzedStocks, favorites.length]);

  const liveStatus = getLiveMarketStatus();

  const titleMap = {
    dashboard: "Market Overview & Top Setups",
    screener: "Halal Compliance & Technical Screener",
    signals: "Active Trading Signals (US & TH)",
  };
  const selectedStock = selectedTicker ? analyzedStocks.find((s) => s.ticker === selectedTicker) : null;
  const handleSelectStock = (ticker) => setSelectedTicker(ticker);
  const handleNavClick = (key) => { setSelectedTicker(null); setView(key); };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row text-slate-200" style={{ backgroundColor: BG, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col p-4" style={{ backgroundColor: "#0D121F" }}>
        <div className="flex items-center justify-between lg:justify-start gap-2.5 px-2 py-1.5 mb-3 lg:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Moon size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Halal Markets PRO</p>
              <p className="text-slate-500 text-[11px] leading-tight">US & Thai SET Desk</p>
            </div>
          </div>
          <div className="flex lg:hidden items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 bg-white/5">
            <span className={`w-2 h-2 rounded-full ${liveStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            <span className="text-[11px] text-slate-300">{liveStatus.label}</span>
          </div>
        </div>

        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.key && !selectedStock;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2.5"><Icon size={16} />{item.label}</span>
                <ChevronRight size={14} className={`hidden lg:block transition-all ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0"}`} />
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block mt-auto rounded-xl border border-white/5 p-3.5 bg-[#090D16]">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <Globe size={13} /> Dual-Market Engine
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            กดปุ่มรูปดาว ⭐ บนการ์ดหุ้นเพื่อปักหมุดหุ้นโปรดไว้ดูบนสุดได้ทันที
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {!selectedStock && !isLoading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">{titleMap[view]}</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                {view === "dashboard" && "ภาพรวมตลาดหุ้นฮาลาล รายการปักหมุด และสัญญาณเด่นประจำวัน"}
                {view === "screener" && "ตารางคัดกรองสัดส่วนหนี้สินฮาลาล (น้อยกว่า 33%) คู่กับสัญญาณ RSI"}
                {view === "signals" && "จุดเข้าซื้อ-ขาย จุดตัดขาดทุน (Stop-Loss) และเป้าทำกำไรรายตัว"}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => loadData(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 bg-[#131824] hover:border-emerald-500/40 text-xs text-slate-300 transition-all"
                title="อัปเดตข้อมูลเดี๋ยวนี้"
              >
                <RefreshCw size={13} className={isRefreshing ? "animate-spin text-emerald-400" : "text-slate-400"} />
                <span>{lastUpdated ? `อัปเดต ${lastUpdated}` : "รีเฟรช"}</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2 bg-[#131824]">
                <span className={`w-2 h-2 rounded-full ${liveStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                <span className="text-xs font-medium text-slate-300">{liveStatus.label}</span>
              </div>
            </div>
          </div>
        )}

        {isLoading && !marketData && <DashboardSkeleton />}
        {!isLoading && error && !marketData && <LoadingState message={error} />}
        {marketData && (
          <>
            {selectedStock ? (
              <StockDetailView
                stock={selectedStock}
                onBack={() => setSelectedTicker(null)}
                isFav={favorites.includes(selectedStock.ticker)}
                onToggleFav={() => toggleFavorite(selectedStock.ticker)}
              />
            ) : (
              <>
                {view === "dashboard" && (
                  <DashboardView
                    stocks={analyzedStocks}
                    indices={marketData.indices}
                    chartSeries={marketData.chartSeries}
                    quickStats={quickStats}
                    onSelectStock={handleSelectStock}
                    onNavigateSignals={() => handleNavClick("signals")}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                  />
                )}
                {view === "screener" && (
                  <ScreenerView
                    stocks={analyzedStocks}
                    onSelectStock={handleSelectStock}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                  />
                )}
                {view === "signals" && (
                  <SignalsView
                    stocks={analyzedStocks}
                    onSelectStock={handleSelectStock}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}