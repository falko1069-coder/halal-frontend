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

// เพิ่มค่าเริ่มต้น purificationRate (% สัดส่วนรายได้ดอกเบี้ยแฝงโดยประมาณสำหรับคำนวณชำระล้างเงินปันผลตามหลัก AAOIFI)
const RAW_STOCKS = [
  // 🇺🇸 หุ้นสหรัฐอเมริกา (US Market)
  { ticker: "HLAL", companyName: "Wahed FTSE USA Shariah ETF", sector: "ETF", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.5 },
  { ticker: "PCOR", companyName: "Procore Technologies", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.2 },
  { ticker: "SPUS", companyName: "SP Funds S&P 500 Shariah", sector: "ETF", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.4 },
  { ticker: "AAPL", companyName: "Apple Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.8 },
  { ticker: "MSFT", companyName: "Microsoft Corp.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.6 },
  { ticker: "GOOGL", companyName: "Alphabet Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 2.1 },
  { ticker: "ADBE", companyName: "Adobe Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.1 },
  { ticker: "CRM", companyName: "Salesforce Inc.", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.4 },
  { ticker: "AMD", companyName: "Advanced Micro Devices", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.9 },
  { ticker: "CSCO", companyName: "Cisco Systems", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.9 },
  { ticker: "TSLA", companyName: "Tesla Inc.", sector: "Consumer", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.5 },
  { ticker: "CAT", companyName: "Caterpillar Inc.", sector: "Industrials", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 2.5 },
  { ticker: "LLY", companyName: "Eli Lilly and Company", sector: "Healthcare", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.8 },
  { ticker: "JNJ", companyName: "Johnson & Johnson", sector: "Healthcare", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.3 },
  { ticker: "TXN", companyName: "Texas Instruments", sector: "Technology", market: "US", currency: "$", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.4 },
  // 🇹🇭 หุ้นไทย (Thai SET Market)
  { ticker: "BDMS.BK", companyName: "Bangkok Dusit Medical Services", sector: "Healthcare", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.7 },
  { ticker: "BH.BK", companyName: "Bumrungrad Hospital PCL", sector: "Healthcare", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.9 },
  { ticker: "ADVANC.BK", companyName: "Advanced Info Service PCL", sector: "Technology", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.8 },
  { ticker: "HMPRO.BK", companyName: "Home Product Center PCL", sector: "Consumer", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.6 },
  { ticker: "AOT.BK", companyName: "Airports of Thailand PCL", sector: "Industrials", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 2.8 },
  { ticker: "DELTA.BK", companyName: "Delta Electronics (Thailand)", sector: "Technology", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 0.8 },
  { ticker: "PTTEP.BK", companyName: "PTT Exploration & Production", sector: "Energy", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 1.7 },
  { ticker: "GULF.BK", companyName: "Gulf Energy Development", sector: "Utilities", market: "TH", currency: "฿", currentPrice: 0, change: 0, totalAssets: 0, totalDebt: 0, debtRatio: 0, rsi: 50, supportLevel: 0, resistanceLevel: 0, purificationRate: 4.5 },
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
        const cleanName = (realData.name || mockStock.companyName).replace(/^[A-Z0-9]+\s*_/, "");
        return {
          ...mockStock,
          companyName: cleanName,
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
          aiBusiness: realData.aiInsight?.business || "กำลังพัฒนาและขยายฐานรายได้หลักในกลุ่มอุตสาหกรรมอย่างต่อเนื่อง",
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
// BUSINESS LOGIC + POSITION SIZING, RRR, ACTIVE P/L & BUDDY AI COACH ENGINE
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

// 🎯 คำนวณจุดตั้งซื้อที่ดีที่สุด, RRR, ขนาดไม้ลงทุน, กำไร/ขาดทุนหุ้นที่ถือจริง และ "ข้อความเพื่อนคู่หูฟันธง (Buddy Talk)"
function getRiskAndPositionPlan(stock, halal, signalStatus, portfolio, holding) {
  const curr = stock.currency || "$";
  const price = stock.currentPrice || 0;
  const support = stock.supportLevel > 0 ? stock.supportLevel : price * 0.95;
  const resistance = stock.resistanceLevel > price ? stock.resistanceLevel : price * 1.08;
  const rangeSpan = Math.max(0.01, resistance - support);

  // ตำแหน่งราคาปัจจุบันในกรอบ 30 วัน (0% = แนวรับ, 100% = แนวต้าน)
  const rangePos = price > 0
    ? Math.min(100, Math.max(0, Math.round(((price - support) / rangeSpan) * 100)))
    : 50;

  // 1. คำนวณราคาที่ควรตั้งซื้อที่สุด (Optimal Limit Buy Price)
  const idealSupportBuy = support + rangeSpan * 0.12;
  const rawBestBuy = price > 0 ? Math.min(price, idealSupportBuy) : 0;
  const bestBuyPrice = Math.round(rawBestBuy * 100) / 100;
  const entryDiscountPct = price > 0
    ? Math.max(0, Number((((price - bestBuyPrice) / price) * 100).toFixed(1)))
    : 0;

  // 2. คำนวณ Stop-Loss และ Target Price
  const structuralStop = support * 0.985;
  const rawStop = price > 0
    ? Math.min(price * 0.98, Math.max(price * 0.92, structuralStop))
    : 0;
  const cleanStop = Math.round(rawStop * 100) / 100;

  const rawTarget = Math.max(price * 1.03, resistance * 0.995);
  const cleanTarget = Math.round(rawTarget * 100) / 100;

  const upsidePct = price > 0 ? ((cleanTarget - price) / price) * 100 : 0;
  const downsidePct = price > 0 ? ((price - cleanStop) / price) * 100 : 0;

  const cleanUpside = Math.max(0.1, Number(upsidePct.toFixed(1)));
  const cleanDownside = Math.max(0.5, Number(downsidePct.toFixed(1)));

  // 3. คำนวณความคุ้มค่าในการลงทุน (Risk-to-Reward Ratio: RRR)
  const rrr = Number((cleanUpside / cleanDownside).toFixed(2));

  const limitUpside = bestBuyPrice > 0 ? ((cleanTarget - bestBuyPrice) / bestBuyPrice) * 100 : 0;
  const limitStop = Math.round(Math.min(bestBuyPrice * 0.975, support * 0.985) * 100) / 100;
  const limitDownside = bestBuyPrice > 0 ? Math.max(1.5, ((bestBuyPrice - limitStop) / bestBuyPrice) * 100) : 2;
  const bestLimitRrr = Number((Math.max(0.1, limitUpside) / limitDownside).toFixed(2));

  let worthLabel = `คุ้มค่ามาก (1:${rrr})`;
  let worthTone = "excellent";
  if (!halal) {
    worthLabel = "ไม่ผ่านฮาลาล";
    worthTone = "nonhalal";
  } else if (rrr >= 2.2 && stock.rsi <= 50) {
    worthLabel = `คุ้มค่ามาก (RRR 1:${rrr})`;
    worthTone = "excellent";
  } else if (rrr >= 1.4 && stock.rsi < 65) {
    worthLabel = `น่าลงทุน (RRR 1:${rrr})`;
    worthTone = "good";
  } else if (bestLimitRrr >= 1.8) {
    worthLabel = `รอรับจะคุ้มกว่า (1:${bestLimitRrr})`;
    worthTone = "wait";
  } else {
    worthLabel = `ไม่คุ้มเสี่ยง (RRR 1:${rrr})`;
    worthTone = "poor";
  }

  // 4. 🚦 ฟันธงจังหวะเข้าซื้อ: "ซื้อตอนนี้เลย (BUY_NOW)" vs "รอลงกว่านี้ (WAIT_DIP)" vs "อย่าเพิ่งซื้อ (AVOID)"
  let timingState = "WAIT_DIP"; // BUY_NOW | WAIT_DIP | AVOID
  let timingBadge = "";
  let entryAdvice = "";
  let isBuyNowZone = false;

  if (!halal) {
    timingState = "AVOID";
    timingBadge = "🔴 งดลงทุน (หนี้เกินฮาลาล 33%)";
    entryAdvice = "สัดส่วนหนี้สินเกินเกณฑ์ 33%";
    isBuyNowZone = false;
  } else if (signalStatus === "Sell" || stock.rsi >= 70) {
    timingState = "AVOID";
    timingBadge = `🔴 อย่าเพิ่งซื้อ! รอลงมาที่ ${curr}${bestBuyPrice.toFixed(2)}`;
    entryAdvice = `ราคาตึงจัด รอปรับฐานลงอีก -${entryDiscountPct}%`;
    isBuyNowZone = false;
  } else if (
    (entryDiscountPct <= 1.8 || stock.rsi <= 35 || (signalStatus === "Buy" && rrr >= 2.0)) &&
    rrr >= 1.3
  ) {
    timingState = "BUY_NOW";
    timingBadge = "🟢 ซื้อตอนนี้ได้เลย! (ไม่ต้องรอ)";
    entryAdvice = "ราคาอยู่ในโซนได้เปรียบ เคาะซื้อได้ทันที";
    isBuyNowZone = true;
  } else {
    timingState = "WAIT_DIP";
    timingBadge = `🟡 รอลงกว่านี้! (รออีก -${entryDiscountPct}%)`;
    entryAdvice = `ตั้ง Limit รอช้อนที่ ${curr}${bestBuyPrice.toFixed(2)} (ย่อ -${entryDiscountPct}%)`;
    isBuyNowZone = false;
  }

  // 5. คำนวณปริมาณเงินที่ควรลง (Position Sizing) รองรับการใช้เงินข้ามสกุล (บาท/ดอลลาร์)
  const isTH = stock.market === "TH";
  const fxRate = Math.max(1, Number(portfolio?.fxRate || 34.5));
  const rawThCash = Number(portfolio?.thCash || 0);
  const rawUsCash = Number(portfolio?.usCash || 0);

  // หากในพอร์ตฝั่งนั้นเป็น 0 แต่มีเงินอีกสกุล ระบบแปลงค่าเงินมาช่วยคำนวณให้อัตโนมัติ
  const availableCash = isTH
    ? rawThCash > 0
      ? rawThCash
      : Math.round(rawUsCash * fxRate)
    : rawUsCash > 0
    ? rawUsCash
    : Number((rawThCash / fxRate).toFixed(2));

  const basePct = Number(portfolio?.baseAllocPct || 15);

  let allocPct = 0;
  if (halal && signalStatus !== "Sell" && stock.rsi < 68 && price > 0) {
    if (signalStatus === "Strong Buy" && rrr >= 2.0) {
      allocPct = Math.min(40, Math.round(basePct * 1.5));
    } else if (signalStatus === "Strong Buy" || (signalStatus === "Buy" && rrr >= 1.8)) {
      allocPct = Math.min(35, Math.round(basePct * 1.25));
    } else if (signalStatus === "Buy") {
      allocPct = basePct;
    } else if (signalStatus === "Hold" && rrr >= 1.8) {
      allocPct = Math.max(5, Math.round(basePct * 0.75));
    } else {
      allocPct = Math.max(5, Math.round(basePct * 0.5));
    }
  }

  const allocAmount = Math.round((availableCash * allocPct) / 100);
  const executionPrice = bestBuyPrice > 0 ? bestBuyPrice : price;
  const rawShares = executionPrice > 0 ? allocAmount / executionPrice : 0;
  const recommendedShares = rawShares >= 1
    ? Math.floor(rawShares)
    : Number(rawShares.toFixed(2));

  const expectedProfitMoney = Math.round(allocAmount * (cleanUpside / 100));
  const maxLossMoney = Math.round(allocAmount * (cleanDownside / 100));

  // 6. 💼 คำนวณสถานะหุ้นที่ถืออยู่จริง (Active Position P/L Tracker)
  const heldShares = Number(holding?.shares || 0);
  const avgCost = Number(holding?.avgCost || 0);
  const isHeld = heldShares > 0 && avgCost > 0;
  const investedCapital = isHeld ? Number((heldShares * avgCost).toFixed(2)) : 0;
  const currentMarketValue = isHeld ? Number((heldShares * price).toFixed(2)) : 0;
  const pnlAmount = isHeld ? Number((currentMarketValue - investedCapital).toFixed(2)) : 0;
  const pnlPct = isHeld && avgCost > 0 ? Number((((price - avgCost) / avgCost) * 100).toFixed(2)) : 0;

  let holdingAlert = "";
  if (isHeld) {
    if (price >= cleanTarget || pnlPct >= 10) {
      holdingAlert = `🎉 ชนเป้ากำไรแล้ว! (+${pnlPct}%) พิจารณาแบ่งขายล็อกกำไรเข้ากระเป๋าได้เลยเพื่อน!`;
    } else if (price <= cleanStop || pnlPct <= -5) {
      holdingAlert = `🚨 ราคาหลุดแนวรับ/Stop-Loss (${curr}${cleanStop.toFixed(2)}) ระวังความเสี่ยงด้วยนะเพื่อน!`;
    } else if (pnlPct >= 0) {
      holdingAlert = `🟢 พอร์ตบวกอยู่ +${pnlPct}% (+${curr}${pnlAmount.toLocaleString()}) ถือรันรอเป้า ${curr}${cleanTarget.toFixed(2)} ได้เลย`;
    } else {
      holdingAlert = `🛡️ ย่อตัวเล็กน้อย (${pnlPct}%) แต่ยังไม่หลุด Stop-Loss (${curr}${cleanStop.toFixed(2)}) ถือรอลุ้นฟื้นตัวได้`;
    }
  }

  // 7. 🗣️ สร้างข้อความ "เพื่อนคู่หูฟันธง (Buddy AI Talk)" ผสมสตอรี่ธุรกิจ + จังหวะราคา + หุ้นที่ถือจริง
  const cleanName = stock.ticker.replace(".BK", "");
  const bizShort = (stock.aiBusiness || "ธุรกิจหลักกำลังเติบโตได้ดี").replace(/^ธุรกิจ:\s*/i, "").trim();
  let buddyTalk = "";

  if (!halal) {
    buddyTalk = `ข้าม ${cleanName} ไปก่อนเลยเพื่อน! ตอนนี้สัดส่วนหนี้สินอยู่ที่ ${Number(stock.debtRatio).toFixed(1)}% ซึ่งเกินเพดานฮาลาล 33% แม้ธุรกิจจะเกี่ยวกับ${bizShort} แต่เรามีตัวอื่นที่คลีนและคุ้มกว่าเยอะ!`;
  } else if (timingState === "BUY_NOW") {
    buddyTalk = `ซื้อเลยตัวนี้เพื่อน! ${cleanName} ราคา ${curr}${price.toFixed(2)} ย่อลงมาอยู่ในจุดเข้าซื้อที่ได้เปรียบสุดๆ (RSI ${stock.rsi} · ความคุ้มค่า RRR 1:${rrr}) แถมสตอรี่ธุรกิจกำลังมาแรง: ${bizShort} จัดเข้าพอร์ตตอนนี้ได้เลยประมาณ ${curr}${allocAmount.toLocaleString()} (${recommendedShares} หุ้น) ไม่ต้องรอ!`;
  } else if (timingState === "WAIT_DIP") {
    buddyTalk = `อย่าเพิ่งรีบเคาะซื้อ ${cleanName} ที่ราคา ${curr}${price.toFixed(2)} ตอนนี้นะเพื่อน! ถึงข่าวและพื้นฐานธุรกิจจะดีมาก (${bizShort}) แต่ราคานี้วิ่งขึ้นมาสูงกว่าจุดได้เปรียบแล้ว อดใจรอให้มันย่อลงมาแถวๆ ${curr}${bestBuyPrice.toFixed(2)} (รอลงอีก -${entryDiscountPct}%) ค่อยตั้ง Limit ช้อนซื้อด้วยงบ ${curr}${allocAmount.toLocaleString()} จะปลอดภัยกว่าเยอะ!`;
  } else {
    buddyTalk = `เบรกมือด่วนเพื่อน! อย่าเพิ่งไล่ราคา ${cleanName} ตอนนี้เด็ดขาด ถึงธุรกิจจะดูดี (${bizShort}) แต่ราคา ${curr}${price.toFixed(2)} พุ่งขึ้นมาโซนตึงจัด (RSI ${stock.rsi}) เสี่ยงโดนเทขายทำกำไร รอให้มันพักตัวลงมาแถวๆ ${curr}${bestBuyPrice.toFixed(2)} ก่อนค่อยว่ากัน!`;
  }

  if (isHeld) {
    buddyTalk = `[พอร์ตของคุณถืออยู่ ${heldShares} หุ้น ทุน ${curr}${avgCost.toFixed(2)} -> ${holdingAlert}] · ${buddyTalk}`;
  }

  return {
    stopLoss: cleanStop,
    targetPrice: cleanTarget,
    upsidePct: cleanUpside,
    downsidePct: cleanDownside,
    rangePos,
    bestBuyPrice,
    entryDiscountPct,
    entryAdvice,
    isBuyNowZone,
    timingState,
    timingBadge,
    buddyTalk,
    rrr,
    bestLimitRrr,
    worthLabel,
    worthTone,
    availableCash,
    allocPct,
    allocAmount,
    recommendedShares,
    expectedProfitMoney,
    maxLossMoney,
    isHeld,
    heldShares,
    avgCost,
    investedCapital,
    currentMarketValue,
    pnlAmount,
    pnlPct,
    holdingAlert,
  };
}

function analyzeStock(stock, portfolio, holdings) {
  const debtRatio = Number(stock.debtRatio);
  const halalStatus = getHalalStatus(debtRatio);
  const signal = getSignal(stock.rsi);
  const holding = holdings ? holdings[stock.ticker] : null;
  const plan = getRiskAndPositionPlan(stock, halalStatus.halal, signal.status, portfolio, holding);
  return { ...stock, debtRatio, ...halalStatus, ...signal, ...plan };
}

// คงค่า Active Buy Signals ของ App (6).jsx ไว้ครบ พร้อมบอกจำนวนหุ้นที่ถือจริงควบคู่กัน
function buildQuickStats(analyzedStocks, favCount) {
  const halalCount = analyzedStocks.filter((s) => s.halal).length;
  const buyNowCount = analyzedStocks.filter((s) => s.timingState === "BUY_NOW").length;
  const buyCount = analyzedStocks.filter(
    (s) => s.status === "Buy" || s.status === "Strong Buy"
  ).length;
  const heldCount = analyzedStocks.filter((s) => s.isHeld).length;
  const avgDebtRatio =
    analyzedStocks.reduce((sum, s) => sum + s.debtRatio, 0) / analyzedStocks.length;

  return [
    { label: "Halal Universe", value: `${halalCount}/${analyzedStocks.length}`, sub: `Avg. Debt ${avgDebtRatio.toFixed(1)}% (<33%)`, icon: ShieldCheck },
    { label: "Buy Right Now", value: `${buyNowCount}`, sub: "ซื้อตอนนี้ได้เลย ไม่ต้องรอกราฟย่อ", icon: Target },
    { label: "Active Buy Signals", value: `${buyCount}`, sub: heldCount > 0 ? `Strong Buy & Buy · ถือจริง ${heldCount} ตัว` : "Strong Buy & Buy setups", icon: Activity },
    { label: "Pinned Favorites", value: `${favCount}`, sub: "your custom watchlist", icon: Star },
  ];
}

function buildRationale(stock) {
  const curr = stock.currency || "$";
  const rsiState = stock.rsi <= 30 ? "Oversold (โซนขายมากเกินไป)" : stock.rsi >= 70 ? "Overbought (โซนซื้อมากเกินไป)" : "Neutral (แกว่งตัวสะสมพลัง)";

  const sentence1 = `ฟันธงจังหวะเข้าซื้อ: ${stock.timingBadge} (RSI ปัจจุบันอยู่ที่ ${stock.rsi} - ${rsiState})`;
  const sentence2 = `จุดตั้งซื้อที่ดีที่สุด (Optimal Limit Buy) อยู่ที่ ${curr}${stock.bestBuyPrice.toFixed(2)} (${stock.entryAdvice})`;
  const sentence3 = `ความคุ้มค่าในการลงทุนอยู่ที่ RRR 1 : ${stock.rrr} (เป้าทำกำไร ${curr}${stock.targetPrice.toFixed(2)} [+${stock.upsidePct}%] เทียบจุดตัดขาดทุน ${curr}${stock.stopLoss.toFixed(2)} [-${stock.downsidePct}%])`;
  const sentence4 = stock.allocPct > 0
    ? `จากเงินสดในมือ ${curr}${stock.availableCash.toLocaleString()} แนะนำแบ่งเงินลงทุนไม้นี้ ${stock.allocPct}% คิดเป็นเงิน ${curr}${stock.allocAmount.toLocaleString()} (ประมาณ ${stock.recommendedShares} หุ้น)`
    : `ยังไม่แนะนำให้ลงเงินในรอบนี้ เนื่องจากสัญญาณหรือเกณฑ์ฮาลาลยังไม่เอื้ออำนวย`;

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
// 🧠 AI PORTFOLIO ALLOCATION & CROSS-CURRENCY SWITCHING ENGINE
// ===========================================================================

// คำนวณคะแนนความน่าลงทุนของหุ้นแต่ละตัวเพื่อใช้จัดสรรเงินและหาตัวสลับ (Switching)
function scoreStockForAllocation(s) {
  if (!s.halal || s.currentPrice <= 0) return 0;
  let score = s.rrr * 25;
  if (s.timingState === "BUY_NOW") score += 45;
  else if (s.timingState === "WAIT_DIP") score += 15;
  else score -= 40;

  if (s.status === "Strong Buy") score += 30;
  else if (s.status === "Buy") score += 20;
  else if (s.status === "Hold") score += 5;

  score += Math.max(0, 60 - s.rsi);
  return Math.max(5, Math.round(score));
}

// แปลงจำนวนเงินระหว่าง THB (฿) และ USD ($)
function convertCurrencyAmount(amount, fromCurr, toCurr, fxRate = 34.5) {
  const cleanAmt = Number(amount) || 0;
  const rate = Math.max(1, Number(fxRate) || 34.5);
  if (fromCurr === toCurr) return cleanAmt;
  // แปลงจาก บาท (฿ / THB) -> ดอลลาร์ ($ / USD)
  if ((fromCurr === "฿" || fromCurr === "THB") && (toCurr === "$" || toCurr === "USD")) {
    return cleanAmt / rate;
  }
  // แปลงจาก ดอลลาร์ ($ / USD) -> บาท (฿ / THB)
  if ((fromCurr === "$" || fromCurr === "USD") && (toCurr === "฿" || toCurr === "THB")) {
    return cleanAmt * rate;
  }
  return cleanAmt;
}

// วิเคราะห์หุ้นที่ถืออยู่ (หรือหุ้นจำลอง) เทียบกับตัวท็อป (รองรับทั้งตลาดเดียวกันและข้ามตลาด ไทย ↔ อเมริกา)
function buildPositionActionPlan(heldStock, allStocks, allowCrossMarket = true, fxRate = 34.5) {
  const curr = heldStock.currency || "$";
  const candidatePool = allStocks
    .filter(
      (s) =>
        (allowCrossMarket ? true : s.market === heldStock.market) &&
        s.halal &&
        s.ticker !== heldStock.ticker &&
        s.currentPrice > 0 &&
        s.timingState !== "AVOID"
    )
    .sort((a, b) => scoreStockForAllocation(b) - scoreStockForAllocation(a));

  const bestAlt = candidatePool[0] || null;
  const altCurr = bestAlt?.currency || curr;

  const heldShares = heldStock.isHeld ? heldStock.heldShares : Math.max(1, heldStock.recommendedShares || 1);
  const avgCost = heldStock.isHeld ? heldStock.avgCost : heldStock.currentPrice;
  const currentVal = Number((heldShares * heldStock.currentPrice).toFixed(2));
  const investedVal = Number((heldShares * avgCost).toFixed(2));
  const pnlAmt = Number((currentVal - investedVal).toFixed(2));
  const pnlPct = avgCost > 0 ? Number((((heldStock.currentPrice - avgCost) / avgCost) * 100).toFixed(2)) : 0;

  // คำนวณกรณีซื้อถัวเฉลี่ยเพิ่ม (Average Down)
  const addBudget = Math.max(
    heldStock.market === "TH" ? 500 : 10,
    heldStock.allocAmount > 0 ? heldStock.allocAmount : Math.round((heldStock.availableCash || 1000) * 0.15)
  );
  const rawAddShares = heldStock.currentPrice > 0 ? addBudget / heldStock.currentPrice : 0;
  const addShares = rawAddShares >= 1 ? Math.floor(rawAddShares) : Number(rawAddShares.toFixed(4));
  const totalSharesAfterAvg = Number((heldShares + addShares).toFixed(4));
  const newAvgCost =
    totalSharesAfterAvg > 0
      ? Number(((investedVal + addShares * heldStock.currentPrice) / totalSharesAfterAvg).toFixed(2))
      : avgCost;

  // คำนวณกรณีขายตัวเดิมแล้วนำเงินไปสลับซื้อตัวใหม่ (แปลงค่าเงินอัตโนมัติหากสลับข้ามตลาด TH ↔ US)
  const switchSourceMoney = currentVal > 0 ? currentVal : addBudget;
  const switchTargetMoney = Number(
    convertCurrencyAmount(switchSourceMoney, curr, altCurr, fxRate).toFixed(2)
  );
  const rawSwitchShares =
    bestAlt && bestAlt.currentPrice > 0 ? switchTargetMoney / bestAlt.currentPrice : 0;
  const switchShares =
    rawSwitchShares >= 1 ? Math.floor(rawSwitchShares) : Number(rawSwitchShares.toFixed(4));

  const crossNote =
    curr !== altCurr
      ? ` (แปลงค่าเงินเป็น ${altCurr}${switchTargetMoney.toLocaleString()} ที่เรท ${fxRate} ฿/$)`
      : "";

  let actionType = "HOLD"; // CUT_LOSS | SWITCH | AVG_DOWN | TAKE_PROFIT | HOLD
  let actionBadge = "🛡️ ถือรันกำไรต่อ (Hold)";
  let badgeTone = "bg-teal-500/20 text-teal-300 border-teal-500/40";
  let headline = "";
  let detail = "";

  if (!heldStock.halal) {
    actionType = "SWITCH";
    actionBadge = "🔄 แนะนำขายสลับตัว (ไม่ผ่านฮาลาล)";
    badgeTone = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    headline = `สัดส่วนหนี้ของ ${heldStock.ticker} อยู่ที่ ${heldStock.debtRatio.toFixed(1)}% (เกินเกณฑ์ฮาลาล 33%)`;
    detail = bestAlt
      ? `แนะนำขาย ${heldStock.ticker} (ได้เงิน ${curr}${switchSourceMoney.toLocaleString()})${crossNote} แล้วนำเงินไปสลับซื้อ ${bestAlt.ticker} ที่ผ่านฮาลาลและมี RRR 1:${bestAlt.rrr} (${bestAlt.timingBadge}) ซื้อได้ประมาณ ${switchShares} หุ้น`
      : `แนะนำขายออกเพื่อถือเงินสดรอจังหวะหุ้นฮาลาลตัวอื่นย่อตัว`;
  } else if (heldStock.currentPrice <= heldStock.stopLoss || pnlPct <= -6) {
    actionType = bestAlt && bestAlt.timingState === "BUY_NOW" ? "SWITCH" : "CUT_LOSS";
    actionBadge =
      actionType === "SWITCH"
        ? `✂️🔄 คัทลอส & สลับไปเข้า ${bestAlt.ticker}`
        : "✂️ แนะนำคัทลอสจำกัดความเสี่ยง (Cut Loss)";
    badgeTone = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    headline = `ราคาหลุดจุด Stop-Loss (${curr}${heldStock.stopLoss.toFixed(2)}) หรือติดลบ ${pnlPct}%`;
    detail = bestAlt
      ? `เพื่อไม่ให้เงินจม แนะนำคัทลอส ${heldStock.ticker} ดึงเงินสด ${curr}${switchSourceMoney.toLocaleString()}${crossNote} ออกมาสลับเข้าซื้อ ${bestAlt.ticker} (${bestAlt.timingBadge} · RRR 1:${bestAlt.rrr} · เป้า +${bestAlt.upsidePct}%) ได้ประมาณ ${switchShares} หุ้น เพื่อปั้นกำไรคืนไวกว่า!`
      : `แนะนำคัทลอสตามวินัยเพื่อรักษาเงินต้น ${curr}${switchSourceMoney.toLocaleString()} ไว้รอจังหวะรอบใหม่`;
  } else if (heldStock.currentPrice >= heldStock.targetPrice || pnlPct >= 10) {
    actionType = "TAKE_PROFIT";
    actionBadge = "💰 แบ่งขายทำกำไร / สลับตัวต้นรอบ";
    badgeTone = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    headline = `กำไรพุ่งชนเป้าหมายแล้ว (${pnlPct >= 0 ? "+" : ""}${pnlPct}% · กำไร +${curr}${pnlAmt.toLocaleString()})`;
    detail = bestAlt
      ? `แนะนำแบ่งขายล็อกกำไร ${heldStock.ticker} เข้ากระเป๋า แล้วโยกเงินทุน ${curr}${switchSourceMoney.toLocaleString()}${crossNote} ไปเข้าหุ้นต้นรอบอย่าง ${bestAlt.ticker} (RRR 1:${bestAlt.rrr} · ${bestAlt.timingBadge}) ซื้อได้ประมาณ ${switchShares} หุ้น`
      : `แนะนำแบ่งขายล็อกกำไร 50%–100% เข้ากระเป๋าได้เลย และยกระดับ Trailing Stop ขึ้นมาล็อกต้นทุน`;
  } else if (
    bestAlt &&
    bestAlt.timingState === "BUY_NOW" &&
    (heldStock.timingState === "AVOID" ||
      (heldStock.rrr < 1.2 && bestAlt.rrr >= heldStock.rrr * 1.6))
  ) {
    actionType = "SWITCH";
    actionBadge = `🔄 แนะนำสลับตัวเล่นไปเข้า ${bestAlt.ticker}`;
    badgeTone = "bg-amber-500/20 text-yellow-300 border-yellow-400/50";
    headline = `${heldStock.ticker} เริ่มอืด/ความคุ้มค่าต่ำ (RRR 1:${heldStock.rrr}) เทียบกับตัวท็อป`;
    detail = `ต้นทุนเสียโอกาสสูง! แนะนำขาย ${heldStock.ticker} (ได้เงิน ${curr}${switchSourceMoney.toLocaleString()})${crossNote} เพื่อสลับไปเข้า ${bestAlt.ticker} ที่ส่งสัญญาณ "${bestAlt.timingBadge}" และมีความคุ้มค่าสูงถึง RRR 1:${bestAlt.rrr} (เป้ากำไร +${bestAlt.upsidePct}%) ซื้อได้ ${switchShares} หุ้น`;
  } else if (
    pnlPct < -1.0 &&
    heldStock.currentPrice > heldStock.stopLoss &&
    heldStock.rsi <= 45 &&
    heldStock.rrr >= 1.5
  ) {
    actionType = "AVG_DOWN";
    actionBadge = "➕ แนะนำซื้อถัวเฉลี่ยเพิ่ม (Average Down)";
    badgeTone = "bg-sky-500/20 text-sky-300 border-sky-400/50";
    headline = `ราคาย่อลงมาในโซนถูก (RSI ${heldStock.rsi}) แต่ยังไม่หลุดแนวรับ Stop-Loss (${curr}${heldStock.stopLoss.toFixed(2)})`;
    detail = `จังหวะดีในการถัวลดต้นทุน! หากแบ่งงบ ${curr}${addBudget.toLocaleString()} ซื้อถัวเพิ่มอีก ${addShares} หุ้น ที่ราคา ${curr}${heldStock.currentPrice.toFixed(2)} จะทำให้ต้นทุนเฉลี่ยลดลงจาก ${curr}${avgCost.toFixed(2)} เหลือเพียง ${curr}${newAvgCost.toFixed(2)} ต่อหุ้น (รวมเป็น ${totalSharesAfterAvg} หุ้น) เวลาเด้งกลับจะกำไรไวขึ้นมาก!`;
  } else {
    actionType = "HOLD";
    actionBadge = "🛡️ ถือรันต่อตามแผน (Hold & Let Profit Run)";
    badgeTone = "bg-teal-500/20 text-teal-300 border-teal-500/40";
    headline = `โครงสร้างราคายังแข็งแกร่ง (RRR 1:${heldStock.rrr} · ยืนเหนือ Stop-Loss ${curr}${heldStock.stopLoss.toFixed(2)})`;
    detail = `ยังไม่ต้องรีบขายหรือสลับตัว แนะนำถือรันต่อเพื่อรอขายทำกำไรที่เป้าหมาย ${curr}${heldStock.targetPrice.toFixed(2)} (+${heldStock.upsidePct}%) หรือหากราคาย่อลงมาใกล้ ${curr}${heldStock.bestBuyPrice.toFixed(2)} สามารถเก็บสะสมเพิ่มได้`;
  }

  return {
    stock: heldStock,
    curr,
    altCurr,
    heldShares,
    avgCost,
    currentVal,
    investedVal,
    pnlAmt,
    pnlPct,
    actionType,
    actionBadge,
    badgeTone,
    headline,
    detail,
    bestAlt,
    switchSourceMoney,
    switchTargetMoney,
    switchShares,
    addBudget,
    addShares,
    totalSharesAfterAvg,
    newAvgCost,
  };
}

// ===========================================================================
// DESIGN TOKENS + PRESENTATIONAL ATOMS
// ===========================================================================

const EMERALD = "#10B981";
const CRIMSON = "#EF4444";
const SKY = "#38BDF8";
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

// ป้ายฟันธงจังหวะเข้าซื้อ: ซื้อตอนนี้เลย vs รอลงกว่านี้
function ActionTimingBadge({ timingState, timingBadge }) {
  const styleMap = {
    BUY_NOW: "bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    WAIT_DIP: "bg-yellow-500/20 text-yellow-300 border-yellow-400/50",
    AVOID: "bg-rose-500/20 text-rose-300 border-rose-400/50",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold border ${styleMap[timingState] || styleMap.WAIT_DIP}`}>
      {timingBadge}
    </span>
  );
}

// ป้ายแสดงความคุ้มค่าในการลงทุน (RRR Worthiness Badge)
function WorthinessBadge({ worthLabel, worthTone }) {
  const toneMap = {
    excellent: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    good: "bg-teal-500/15 text-teal-300 border-teal-500/30",
    wait: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    poor: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    nonhalal: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold border ${toneMap[worthTone] || toneMap.good}`}>
      {worthTone === "excellent" && "🔥 "}
      {worthTone === "good" && "✅ "}
      {worthTone === "wait" && "⏳ "}
      {worthTone === "poor" && "⚠️ "}
      {worthLabel}
    </span>
  );
}

// 🟡 ป้ายสถานะ HOLD เป็นสีเหลืองชัดเจน
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
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-500/20 border border-yellow-400/50 px-2.5 py-1 text-xs font-bold text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.18)]">
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

// 💼 หน้าต่างป๊อปอัปบันทึก/แก้ไข "หุ้นที่ฉันซื้อถืออยู่จริง (Position Editor Modal)"
function HoldingEditorModal({ stock, allStocks = [], onClose, onSaveHolding, onRemoveHolding }) {
  if (!stock) return null;
  const [activeTicker, setActiveTicker] = useState(stock.ticker);
  const currentStock = useMemo(
    () => allStocks.find((s) => s.ticker === activeTicker) || stock,
    [allStocks, activeTicker, stock]
  );
  const curr = currentStock.currency || "$";

  const [shares, setShares] = useState(
    currentStock.isHeld ? String(currentStock.heldShares) : String(currentStock.recommendedShares || 1)
  );
  const [avgCost, setAvgCost] = useState(
    currentStock.isHeld ? String(currentStock.avgCost) : String(currentStock.currentPrice || 0)
  );

  useEffect(() => {
    setShares(
      currentStock.isHeld ? String(currentStock.heldShares) : String(currentStock.recommendedShares || 1)
    );
    setAvgCost(
      currentStock.isHeld ? String(currentStock.avgCost) : String(currentStock.currentPrice || 0)
    );
  }, [currentStock]);

  const numShares = Math.max(0, Number(shares) || 0);
  const numCost = Math.max(0, Number(avgCost) || 0);
  const totalCost = numShares * numCost;
  const currentVal = numShares * currentStock.currentPrice;
  const estPnl = currentVal - totalCost;
  const estPnlPct = numCost > 0 ? ((currentStock.currentPrice - numCost) / numCost) * 100 : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numShares <= 0 || numCost <= 0) {
      onRemoveHolding(currentStock.ticker);
    } else {
      onSaveHolding(currentStock.ticker, numShares, numCost);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#131824] border border-emerald-500/30 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-white">💼 บันทึกหุ้นที่ถือจริง: {currentStock.ticker}</span>
              <MarketBadge market={currentStock.market} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentStock.companyName} · ราคาตลาดปัจจุบัน {curr}{currentStock.currentPrice.toFixed(2)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs"
          >
            ✕ ปิด
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {allStocks.length > 0 && (
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                เลือกหุ้นที่ต้องการบันทึกเข้าพอร์ต
              </label>
              <select
                value={activeTicker}
                onChange={(e) => setActiveTicker(e.target.value)}
                className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3.5 py-2 text-sm font-bold text-white outline-none focus:border-emerald-500 cursor-pointer"
              >
                {allStocks.map((s) => (
                  <option key={s.ticker} value={s.ticker} className="bg-[#131824]">
                    {s.ticker} - {s.companyName} {s.isHeld ? `[ถืออยู่ ${s.heldShares} หุ้น]` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="text-slate-300 font-semibold">จำนวนหุ้นที่ถืออยู่ (Shares)</label>
              <button
                type="button"
                onClick={() => setShares(String(currentStock.recommendedShares || 1))}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                ใช้จำนวนหุ้นแนะนำ ({currentStock.recommendedShares} หุ้น)
              </button>
            </div>
            <input
              type="number"
              step="any"
              min="0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              placeholder="เช่น 100 หรือ 0.05"
              className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label className="text-slate-300 font-semibold">ราคาต้นทุนเฉลี่ยต่อหุ้น ({curr})</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAvgCost(String(currentStock.currentPrice))}
                  className="text-[11px] text-sky-400 hover:underline"
                >
                  ราคาปัจจุบัน ({curr}{currentStock.currentPrice})
                </button>
                <button
                  type="button"
                  onClick={() => setAvgCost(String(currentStock.bestBuyPrice))}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  จุด Best Buy ({curr}{currentStock.bestBuyPrice})
                </button>
              </div>
            </div>
            <input
              type="number"
              step="any"
              min="0"
              value={avgCost}
              onChange={(e) => setAvgCost(e.target.value)}
              placeholder={`ราคาที่ซื้อมา (${curr})`}
              className="w-full bg-[#090D16] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white outline-none focus:border-emerald-500"
            />
          </div>

          {/* พรีวิวกำไร/ขาดทุนทันที */}
          <div className="rounded-xl bg-[#090D16] border border-white/10 p-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>ต้นทุนรวมทั้งหมด:</span>
              <span className="font-bold text-white">{curr}{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>มูลค่าตลาดปัจจุบัน:</span>
              <span className="font-bold text-white">{curr}{currentVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-slate-300 font-semibold">กำไร / ขาดทุนสุทธิ (P/L):</span>
              <span className={`font-extrabold ${estPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {estPnl >= 0 ? "+" : ""}{curr}{estPnl.toFixed(2)} ({estPnlPct >= 0 ? "+" : ""}{estPnlPct.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 rounded-xl transition-all"
            >
              💾 บันทึกเข้าพอร์ตที่ถือจริง
            </button>
            {currentStock.isHeld && (
              <button
                type="button"
                onClick={() => {
                  onRemoveHolding(currentStock.ticker);
                  onClose();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs transition-all"
              >
                🗑️ ลบออก (ขายแล้ว)
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// 💼 แผงควบคุม "เงินสดในมือของฉัน (My Portfolio Cash)" พร้อมเรทแลกเปลี่ยน THB/USD
function PortfolioCashBar({ portfolio, onUpdatePortfolio, heldCount, onOpenPortfolioTab }) {
  const fxRate = Number(portfolio?.fxRate || 34.5);
  const handleNumChange = (field, val) => {
    const clean = Math.max(0, Number(val) || 0);
    onUpdatePortfolio({ ...portfolio, [field]: clean });
  };

  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-[#131D2B] via-[#131824] to-[#132024] p-4 shadow-lg mb-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Wallet size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-bold text-sm">
                พอร์ตเงินสดในมือ & คำนวณขนาดไม้ลงทุนอัตโนมัติ (รองรับทั้ง ฿ และ $)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Auto-Saved
              </span>
              <button
                type="button"
                onClick={onOpenPortfolioTab}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/40 hover:bg-indigo-500/35 font-semibold transition-all"
              >
                🎯 AI จัดสรรเงินข้ามตลาด & ปรับพอร์ต ({heldCount} ตัวที่ถือ) →
              </button>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              พิมพ์แก้จำนวนเงินในมือและเรทแลกเปลี่ยนได้ตลอดเวลา ใช้เงินบาทหรือดอลลาร์คำนวณซื้อหุ้นได้ทุกตัว
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:w-auto">
          <div className="bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-emerald-500/50 transition-all">
            <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
              <span>🇹🇭 งบเงินบาทในมือ (฿)</span>
              <span className="text-emerald-400 font-semibold">THB</span>
            </label>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-slate-400 font-bold text-sm">฿</span>
              <input
                type="number"
                min="0"
                step="1000"
                value={portfolio.thCash}
                onChange={(e) => handleNumChange("thCash", e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm outline-none"
              />
            </div>
          </div>

          <div className="bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-emerald-500/50 transition-all">
            <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
              <span>🇺🇸 งบดอลลาร์ในมือ ($)</span>
              <span className="text-sky-400 font-semibold">USD</span>
            </label>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-slate-400 font-bold text-sm">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={portfolio.usCash}
                onChange={(e) => handleNumChange("usCash", e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm outline-none"
              />
            </div>
          </div>

          <div className="bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-emerald-500/50 transition-all">
            <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
              <span>💱 เรทแลกเปลี่ยน ($1)</span>
              <span className="text-indigo-400 font-semibold">USD/THB</span>
            </label>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-slate-400 font-bold text-xs">$1 = ฿</span>
              <input
                type="number"
                min="1"
                step="0.1"
                value={fxRate}
                onChange={(e) => handleNumChange("fxRate", e.target.value)}
                className="w-full bg-transparent text-white font-bold text-sm outline-none"
              />
            </div>
          </div>

          <div className="bg-[#090D16] border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-emerald-500/50 transition-all">
            <label className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
              <span>⚖️ ขนาดไม้มาตรฐาน (%)</span>
              <span className="text-yellow-400 font-semibold">{portfolio.baseAllocPct}% / ไม้</span>
            </label>
            <div className="flex items-center gap-1.5 mt-1.5">
              {[10, 15, 20, 25, 33].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleNumChange("baseAllocPct", pct)}
                  className={`flex-1 py-0.5 rounded text-[11px] font-bold border transition-all ${
                    portfolio.baseAllocPct === pct
                      ? "bg-emerald-500/25 border-emerald-500/50 text-emerald-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎯 ฟีเจอร์ที่ 1 (อัปเกรด): AI คำนวณการจัดสรรเงินลงทุน (กำหนดจำนวนตัวได้เอง + เลือกไทย/US/รวมตลาด + ใช้เงิน ฿ หรือ $ ซื้อได้ทุกตัว)
function SmartFocusAllocatorBox({ stocks, portfolio, onSelectStock, onSaveHolding }) {
  const fxRate = Math.max(1, Number(portfolio?.fxRate || 34.5));
  const [marketScope, setMarketScope] = useState("ALL"); // ALL | TH | US
  const [budgetCurrency, setBudgetCurrency] = useState("THB"); // THB | USD
  const [customBudget, setCustomBudget] = useState(
    String(portfolio?.thCash || 1000)
  );
  const [targetCount, setTargetCount] = useState("2");
  const [selectionMode, setSelectionMode] = useState("AUTO"); // AUTO | MANUAL
  const [manualTickers, setManualTickers] = useState([]);

  const budgetCurrSymbol = budgetCurrency === "THB" ? "฿" : "$";
  const budgetNum = Math.max(0, Number(customBudget) || 0);

  // ปุ่มดึงงบด่วนตามสกุลเงินที่เลือก
  const applyPresetBudget = (mode) => {
    const th = Number(portfolio?.thCash || 0);
    const us = Number(portfolio?.usCash || 0);
    if (mode === "TH_ONLY") {
      setBudgetCurrency("THB");
      setCustomBudget(String(th));
    } else if (mode === "US_ONLY") {
      setBudgetCurrency("USD");
      setCustomBudget(String(us));
    } else if (mode === "COMBINED_THB") {
      setBudgetCurrency("THB");
      setCustomBudget(String(Math.round(th + us * fxRate)));
    } else if (mode === "COMBINED_USD") {
      setBudgetCurrency("USD");
      setCustomBudget(String(Number((us + th / fxRate).toFixed(2))));
    }
  };

  // สลับสกุลเงินงบพร้อมแปลงตัวเลขให้อัตโนมัติ
  const handleSwitchBudgetCurrency = (nextCurr) => {
    if (nextCurr === budgetCurrency) return;
    const converted = convertCurrencyAmount(
      budgetNum,
      budgetCurrency === "THB" ? "฿" : "$",
      nextCurr === "THB" ? "฿" : "$",
      fxRate
    );
    setBudgetCurrency(nextCurr);
    setCustomBudget(String(nextCurr === "THB" ? Math.round(converted) : Number(converted.toFixed(2))));
  };

  // กรองหุ้นฮาลาลตามขอบเขตตลาดที่เลือก (ไทยอย่างเดียว / อเมริกาอย่างเดียว / รวมทั้งสองตลาด)
  const eligibleHalalStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        if (!s.halal || s.currentPrice <= 0) return false;
        if (marketScope === "TH" && s.market !== "TH") return false;
        if (marketScope === "US" && s.market !== "US") return false;
        return true;
      })
      .sort((a, b) => scoreStockForAllocation(b) - scoreStockForAllocation(a));
  }, [stocks, marketScope]);

  const maxAvailableCount = eligibleHalalStocks.length || 1;
  const cleanTargetCount = Math.min(
    maxAvailableCount,
    Math.max(1, parseInt(targetCount, 10) || 1)
  );

  const chosenStocks = useMemo(() => {
    if (selectionMode === "MANUAL" && manualTickers.length > 0) {
      return eligibleHalalStocks.filter((s) => manualTickers.includes(s.ticker));
    }
    return eligibleHalalStocks.slice(0, cleanTargetCount);
  }, [eligibleHalalStocks, selectionMode, manualTickers, cleanTargetCount]);

  // คำนวณสัดส่วนเงินและแปลงค่าเงินข้ามตลาด (฿ ↔ $) เพื่อหาจำนวนหุ้นที่ซื้อได้จริงของแต่ละตัว
  const allocationPlan = useMemo(() => {
    if (!chosenStocks.length || budgetNum <= 0) return [];
    const scores = chosenStocks.map((s) => scoreStockForAllocation(s));
    const totalScore = scores.reduce((a, b) => a + b, 0) || 1;

    let runningPct = 0;
    return chosenStocks.map((s, idx) => {
      const weightPct =
        idx === chosenStocks.length - 1
          ? Math.max(1, 100 - runningPct)
          : Math.max(1, Math.round((scores[idx] / totalScore) * 100));
      runningPct += weightPct;

      // เงินที่จัดสรรในสกุลเงินงบที่ผู้ใช้ตั้งไว้ (฿ หรือ $)
      const moneyInBudgetCurr = Number(((budgetNum * weightPct) / 100).toFixed(2));

      // แปลงเป็นสกุลเงินประจำตัวของหุ้นตัวนั้น (เช่น งบ ฿ แต่ซื้อหุ้น US $ หรือ งบ $ แต่ซื้อหุ้นไทย ฿)
      const stockCurr = s.currency || "$";
      const moneyInStockCurr = Number(
        convertCurrencyAmount(moneyInBudgetCurr, budgetCurrSymbol, stockCurr, fxRate).toFixed(2)
      );

      const entryPrice = s.timingState === "BUY_NOW" ? s.currentPrice : s.bestBuyPrice;
      const rawShares = entryPrice > 0 ? moneyInStockCurr / entryPrice : 0;
      const shares = rawShares >= 1 ? Math.floor(rawShares) : Number(rawShares.toFixed(4));

      const estProfitInBudgetCurr = Number((moneyInBudgetCurr * (s.upsidePct / 100)).toFixed(2));
      const estRiskInBudgetCurr = Number((moneyInBudgetCurr * (s.downsidePct / 100)).toFixed(2));

      return {
        stock: s,
        stockCurr,
        weightPct,
        moneyInBudgetCurr,
        moneyInStockCurr,
        isCrossCurrency: budgetCurrSymbol !== stockCurr,
        entryPrice,
        shares,
        estProfitInBudgetCurr,
        estRiskInBudgetCurr,
      };
    });
  }, [chosenStocks, budgetNum, budgetCurrSymbol, fxRate]);

  const totalEstProfit = allocationPlan.reduce((sum, item) => sum + item.estProfitInBudgetCurr, 0);
  const totalEstRisk = allocationPlan.reduce((sum, item) => sum + item.estRiskInBudgetCurr, 0);

  const toggleManualTicker = (ticker) => {
    setManualTickers((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  return (
    <div className="rounded-2xl border border-indigo-500/35 bg-gradient-to-br from-[#141B2D] via-[#131824] to-[#112224] p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            🎯 AI คำนวณการจัดสรรเงินลงทุนอิสระ (Custom Multi-Market & Cross-Currency Allocator)
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            เลือกได้ทั้งหุ้นไทยอย่างเดียว อเมริกาอย่างเดียว หรือรวมกัน · กำหนดจำนวนหุ้นได้เอง · ใช้เงินบาท (฿) หรือดอลลาร์ ($) คำนวณซื้อหุ้นตัวไหนก็ได้
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
          เรทคำนวณ $1 = ฿{fxRate}
        </span>
      </div>

      {/* แถวตั้งค่า 4 กล่อง: 1. ขอบเขตตลาด 2. สกุลเงินและงบลงทุน 3. จำนวนหุ้นที่ต้องการ (กำหนดเองได้) 4. โหมดคัดเลือก */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* 1. เลือกขอบเขตตลาด */}
        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
            1. ขอบเขตตลาดหุ้นที่ต้องการ
          </label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: "ALL", label: "🌐 รวม TH+US" },
              { id: "TH", label: "🇹🇭 ไทยล้วน" },
              { id: "US", label: "🇺🇸 US ล้วน" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMarketScope(m.id)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-all ${
                  marketScope === m.id
                    ? "bg-emerald-500/25 border-emerald-400/50 text-emerald-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            หุ้นผ่านฮาลาลในกลุ่มนี้: <strong className="text-slate-300">{eligibleHalalStocks.length} บริษัท</strong>
          </p>
        </div>

        {/* 2. งบลงทุน & สกุลเงิน (ใช้ ฿ หรือ $ ซื้อได้ทุกตัว) */}
        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">
              2. งบลงทุน & สกุลเงินตั้งต้น
            </label>
            <div className="flex gap-1">
              {["THB", "USD"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleSwitchBudgetCurrency(c)}
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold border transition-all ${
                    budgetCurrency === c
                      ? "bg-sky-500/25 border-sky-400 text-sky-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {c === "THB" ? "฿ THB" : "$ USD"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <span className="text-sky-400 font-extrabold text-sm">{budgetCurrSymbol}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={customBudget}
              onChange={(e) => setCustomBudget(e.target.value)}
              className="w-full bg-transparent text-white font-extrabold text-base outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1 mt-1.5">
            <button
              type="button"
              onClick={() => applyPresetBudget("TH_ONLY")}
              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
            >
              งบไทย (฿{portfolio.thCash})
            </button>
            <button
              type="button"
              onClick={() => applyPresetBudget("US_ONLY")}
              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
            >
              งบ US (${portfolio.usCash})
            </button>
            <button
              type="button"
              onClick={() => applyPresetBudget(budgetCurrency === "THB" ? "COMBINED_THB" : "COMBINED_USD")}
              className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold"
            >
              รวม 2 พอร์ต
            </button>
          </div>
        </div>

        {/* 3. กำหนดจำนวนหุ้นเป้าหมายได้เองอิสระ */}
        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold">
              3. จำนวนหุ้นเป้าหมาย (กำหนดเอง)
            </label>
            <span className="text-[10px] text-indigo-300 font-bold">
              สูงสุด {maxAvailableCount} ตัว
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <input
              type="number"
              min="1"
              max={maxAvailableCount}
              value={targetCount}
              onChange={(e) => {
                setSelectionMode("AUTO");
                setTargetCount(e.target.value);
              }}
              className="w-20 bg-[#131824] border border-indigo-500/40 rounded-lg px-2.5 py-1 text-center text-white font-extrabold text-sm outline-none focus:border-indigo-400"
            />
            <span className="text-xs text-slate-300 font-semibold">บริษัท</span>
          </div>

          <div className="flex items-center gap-1 mt-1.5">
            {[1, 2, 3, 5, maxAvailableCount].map((cnt, i) => (
              <button
                key={`${cnt}-${i}`}
                type="button"
                onClick={() => {
                  setSelectionMode("AUTO");
                  setTargetCount(String(cnt));
                }}
                className={`flex-1 py-0.5 rounded text-[10px] font-bold border transition-all ${
                  selectionMode === "AUTO" && cleanTargetCount === cnt
                    ? "bg-indigo-500/30 border-indigo-400 text-indigo-200"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {cnt === maxAvailableCount && i === 4 ? `ทั้งหมด (${cnt})` : `${cnt} ตัว`}
              </button>
            ))}
          </div>
        </div>

        {/* 4. โหมดการคัดเลือกหุ้น */}
        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3 flex flex-col justify-between">
          <div>
            <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
              4. โหมดเลือกหุ้นเข้าพอร์ต
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setSelectionMode("AUTO")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                  selectionMode === "AUTO"
                    ? "bg-teal-500/25 border-teal-400/50 text-teal-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                🤖 AI คัดตัวท็อป ({cleanTargetCount} ตัว)
              </button>
              <button
                type="button"
                onClick={() => setSelectionMode("MANUAL")}
                className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                  selectionMode === "MANUAL"
                    ? "bg-amber-500/25 border-amber-400/50 text-amber-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                ✋ เลือกเอง ({manualTickers.length || "ไม่จำกัด"})
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            AI ถ่วงน้ำหนักงบตามความคุ้มค่า (RRR) และ RSI
          </p>
        </div>
      </div>

      {/* แถบเลือกหุ้นเองแบบไม่จำกัดจำนวน (เมื่ออยู่ในโหมด MANUAL) */}
      {selectionMode === "MANUAL" && (
        <div className="rounded-xl bg-[#090D16] border border-amber-500/30 p-3 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-amber-300 font-bold">
              ✋ คลิกเลือกหุ้นที่คุณต้องการให้ AI คำนวณแบ่งสัดส่วนเงิน (เลือกกี่ตัวก็ได้ ผสมไทย+US ได้เลย):
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setManualTickers(eligibleHalalStocks.map((s) => s.ticker))}
                className="text-[11px] text-emerald-400 hover:underline font-semibold"
              >
                เลือกทั้งหมด ({eligibleHalalStocks.length})
              </button>
              <button
                type="button"
                onClick={() => setManualTickers([])}
                className="text-[11px] text-rose-400 hover:underline font-semibold"
              >
                ล้างที่เลือก
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {eligibleHalalStocks.map((s) => {
              const active = manualTickers.includes(s.ticker);
              return (
                <button
                  key={s.ticker}
                  type="button"
                  onClick={() => toggleManualTicker(s.ticker)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                    active
                      ? "bg-amber-500/25 border-amber-400 text-amber-200 shadow-sm"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {s.market === "TH" ? "🇹🇭" : "🇺🇸"} {s.ticker.replace(".BK", "")} (RRR 1:{s.rrr})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ตารางการ์ดผลลัพธ์การจัดสรรเงินลงทุน */}
      {allocationPlan.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {allocationPlan.map((item, index) => {
              const s = item.stock;
              return (
                <div
                  key={s.ticker}
                  className="rounded-xl bg-[#090D16] border border-indigo-500/30 p-4 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          อันดับ #{index + 1} · สัดส่วน {item.weightPct}%
                        </span>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <h4
                            onClick={() => onSelectStock(s.ticker)}
                            className="text-base font-extrabold text-white hover:text-emerald-400 cursor-pointer"
                          >
                            {s.ticker}
                          </h4>
                          <MarketBadge market={s.market} />
                          <WorthinessBadge worthLabel={s.worthLabel} worthTone={s.worthTone} />
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{s.companyName}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5 text-xs">
                      <div className="flex justify-between items-baseline">
                        <span className="text-slate-400">งบที่จัดสรรให้:</span>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-300 text-sm">
                            {budgetCurrSymbol}
                            {item.moneyInBudgetCurr.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          {item.isCrossCurrency && (
                            <span className="block text-[11px] text-sky-300 font-semibold">
                              ≈ {item.stockCurr}
                              {item.moneyInStockCurr.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{" "}
                              (แปลงค่าเงินอัตโนมัติ)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">จำนวนหุ้นที่ซื้อได้จริง:</span>
                        <span className="font-extrabold text-white">{item.shares} หุ้น</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">ราคาตั้งซื้อ ({item.stockCurr}):</span>
                        <span className="font-bold text-sky-300">
                          {item.stockCurr}
                          {item.entryPrice.toFixed(2)} ({s.timingState === "BUY_NOW" ? "เคาะซื้อได้เลย" : "ตั้ง Limit รอย่อ"})
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] pt-1 border-t border-white/5">
                        <span className="text-emerald-400">
                          เป้ากำไร: +{budgetCurrSymbol}{item.estProfitInBudgetCurr.toFixed(2)}
                        </span>
                        <span className="text-rose-400">
                          ความเสี่ยง: -{budgetCurrSymbol}{item.estRiskInBudgetCurr.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSaveHolding(s.ticker, item.shares, item.entryPrice)}
                    className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all"
                  >
                    💼 บันทึกซื้อ {s.ticker.replace(".BK", "")} ({item.shares} หุ้น @ {item.stockCurr}{item.entryPrice})
                  </button>
                </div>
              );
            })}
          </div>

          {/* สรุปเหตุผลการจัดสรรจากเพื่อน AI */}
          <div className="rounded-xl bg-indigo-950/30 border border-indigo-500/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-indigo-300 mr-1.5">🤖 เพื่อน AI สรุปแผนจัดสรรเงิน:</strong>
              จากงบทั้งหมด{" "}
              <strong className="text-white">
                {budgetCurrSymbol}
                {budgetNum.toLocaleString()}
              </strong>{" "}
              กระจายลงหุ้นฮาลาล <strong className="text-white">{allocationPlan.length} บริษัท</strong>{" "}
              ({marketScope === "ALL" ? "ผสมทั้งตลาดหุ้นไทยและอเมริกา" : marketScope === "TH" ? "ตลาดหุ้นไทยล้วน" : "ตลาดหุ้นอเมริกาล้วน"})
              โดยให้น้ำหนักสูงสุดที่{" "}
              <strong className="text-emerald-300">
                {allocationPlan[0].stock.ticker} ({allocationPlan[0].weightPct}% = {budgetCurrSymbol}
                {allocationPlan[0].moneyInBudgetCurr.toLocaleString()})
              </strong>{" "}
              เพราะมี RRR 1:{allocationPlan[0].stock.rrr} · พอร์ตชุดนี้มีกำไรคาดหวังรวม{" "}
              <strong className="text-emerald-400">
                +{budgetCurrSymbol}
                {totalEstProfit.toFixed(2)}
              </strong>{" "}
              เทียบความเสี่ยงรวม{" "}
              <strong className="text-rose-400">
                -{budgetCurrSymbol}
                {totalEstRisk.toFixed(2)}
              </strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// 🔄 ฟีเจอร์ที่ 2 (อัปเกรด): AI แนะนำการปรับพอร์ต, ซื้อถัวเฉลี่ย และสลับตัวเล่นข้ามตลาด (TH ↔ US)
function PortfolioActionAdvisorBox({
  stocks,
  heldStocks,
  portfolio,
  onSelectStock,
  onSaveHolding,
  onRemoveHolding,
}) {
  const fxRate = Math.max(1, Number(portfolio?.fxRate || 34.5));
  const [simTicker, setSimTicker] = useState(stocks[0]?.ticker || "AAPL");
  const [allowCrossMarket, setAllowCrossMarket] = useState(true);

  const targetList = useMemo(() => {
    if (heldStocks.length > 0) return heldStocks;
    const simStock = stocks.find((s) => s.ticker === simTicker) || stocks[0];
    return simStock ? [simStock] : [];
  }, [heldStocks, stocks, simTicker]);

  const actionPlans = useMemo(() => {
    return targetList.map((s) =>
      buildPositionActionPlan(s, stocks, allowCrossMarket, fxRate)
    );
  }, [targetList, stocks, allowCrossMarket, fxRate]);

  const handleExecuteSwitch = (plan) => {
    if (!plan.bestAlt) return;
    if (plan.stock.isHeld) {
      onRemoveHolding(plan.stock.ticker);
    }
    onSaveHolding(plan.bestAlt.ticker, plan.switchShares || 1, plan.bestAlt.currentPrice);
  };

  const handleExecuteAvgDown = (plan) => {
    onSaveHolding(plan.stock.ticker, plan.totalSharesAfterAvg, plan.newAvgCost);
  };

  return (
    <div className="rounded-2xl border border-amber-500/35 bg-gradient-to-br from-[#211C15] via-[#131824] to-[#131824] p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            🔄 AI แนะนำการปรับพอร์ต & สลับตัวเล่นข้ามตลาด (Portfolio Action & Cross-Market Switching)
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            วิเคราะห์หุ้นในพอร์ตว่าควร <strong>คัทลอส</strong>, <strong>ซื้อถัวเฉลี่ยลดต้นทุน</strong> หรือ{" "}
            <strong>ขายเพื่อนำเงินไปสลับซื้อหุ้นตัวท็อป (รองรับทั้งสลับข้ามตลาด ไทย ↔ US และตลาดเดียวกัน)</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* ปุ่มเลือกขอบเขตการสลับตัวเล่น (ข้ามตลาด ไทย ↔ US หรือ ตลาดเดียวกัน) */}
          <button
            type="button"
            onClick={() => setAllowCrossMarket((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              allowCrossMarket
                ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                : "bg-white/5 border-white/10 text-slate-300"
            }`}
          >
            {allowCrossMarket ? "🌐 สลับข้ามตลาดได้ (TH ↔ US)" : "🔒 สลับเฉพาะตลาดเดียวกัน"}
          </button>

          {/* หากยังไม่ได้บันทึกหุ้นเข้าพอร์ต สามารถเลือกหุ้นจำลองเพื่อดูแผนสลับตัวเล่นได้ */}
          {heldStocks.length === 0 && (
            <div className="flex items-center gap-2 bg-[#090D16] border border-amber-500/40 rounded-xl px-3 py-1.5">
              <span className="text-[11px] text-amber-300 font-semibold">🔍 จำลองเช็คหุ้นหากถือ:</span>
              <select
                value={simTicker}
                onChange={(e) => setSimTicker(e.target.value)}
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
              >
                {stocks.map((s) => (
                  <option key={s.ticker} value={s.ticker} className="bg-[#131824]">
                    {s.ticker} ({s.companyName})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {actionPlans.map((plan) => {
          const s = plan.stock;
          const alt = plan.bestAlt;
          return (
            <div
              key={s.ticker}
              className="rounded-xl bg-[#090D16] border border-white/10 p-4 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => onSelectStock(s.ticker)}
                        className="text-base font-extrabold text-white hover:text-emerald-400 cursor-pointer"
                      >
                        {s.ticker}
                      </span>
                      <MarketBadge market={s.market} />
                      <span className="text-xs text-slate-400">
                        ({s.isHeld ? `ถือจริง ${plan.heldShares} หุ้น @ ทุน ${plan.curr}${plan.avgCost.toFixed(2)}` : `โหมดจำลอง @ ${plan.curr}${s.currentPrice.toFixed(2)}`})
                      </span>
                    </div>
                    <p className="text-xs text-amber-200 font-semibold mt-1">{plan.headline}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${plan.badgeTone}`}>
                    {plan.actionBadge}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-white/[0.03] border border-white/5 rounded-xl p-3">
                  <strong className="text-teal-300 mr-1">🗣️ คำแนะนำเจาะจง:</strong>
                  {plan.detail}
                </p>

                {/* กล่องเปรียบเทียบตัวเดิม vs ตัวใหม่ที่ AI แนะนำให้สลับไปเข้า */}
                {alt && (
                  <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                    <div className="rounded-lg bg-white/[0.02] border border-white/10 p-2.5">
                      <p className="text-[10px] text-slate-400 uppercase">ตัวที่ถืออยู่ ({s.ticker})</p>
                      <p className="font-bold text-white mt-0.5">
                        {plan.curr}{s.currentPrice.toFixed(2)} · RRR 1:{s.rrr}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        RSI {s.rsi} · เป้า +{s.upsidePct}%
                      </p>
                    </div>

                    <div
                      onClick={() => onSelectStock(alt.ticker)}
                      className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 cursor-pointer hover:border-emerald-400 transition-all"
                    >
                      <p className="text-[10px] text-emerald-300 font-bold uppercase">
                        🌟 ตัวท็อปน่าสลับเข้า ({alt.ticker} · {alt.market})
                      </p>
                      <p className="font-extrabold text-emerald-300 mt-0.5">
                        {plan.altCurr}{alt.currentPrice.toFixed(2)} · RRR 1:{alt.rrr}
                      </p>
                      <p className="text-[11px] text-emerald-200/80">
                        RSI {alt.rsi} · เป้า +{alt.upsidePct}% ({alt.timingState === "BUY_NOW" ? "ซื้อได้เลย" : "รอย่อ"})
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ปุ่มกดดำเนินการตามแผนของ AI ทันที */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                {plan.actionType === "AVG_DOWN" && (
                  <button
                    type="button"
                    onClick={() => handleExecuteAvgDown(plan)}
                    className="flex-1 py-2 px-3 rounded-lg bg-sky-500/25 hover:bg-sky-500/35 border border-sky-400/50 text-sky-200 font-bold text-xs transition-all"
                  >
                    ➕ บันทึกซื้อถัวเพิ่ม (+{plan.addShares} หุ้น → ทุนใหม่ {plan.curr}{plan.newAvgCost})
                  </button>
                )}

                {alt && (
                  <button
                    type="button"
                    onClick={() => handleExecuteSwitch(plan)}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-500/25 hover:bg-amber-500/35 border border-amber-400/50 text-amber-200 font-bold text-xs transition-all"
                  >
                    🔄 สลับพอร์ต: ขาย {s.ticker.replace(".BK", "")} → ซื้อ {alt.ticker.replace(".BK", "")} ({plan.switchShares} หุ้น)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 🕌 คอมโพเนนต์เครื่องคิดเลข "ชำระล้างเงินปันผลฮาลาล (Halal Dividend Purification Calculator)"
function DividendPurificationBox({ stocks, defaultTicker = "AAPL", purificationLogs, onAddLog, onClearLogs }) {
  const [selectedTicker, setSelectedTicker] = useState(defaultTicker);
  const selectedStock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  const curr = selectedStock?.currency || "$";

  const [dividendInput, setDividendInput] = useState("1000");
  const [impurePctInput, setImpurePctInput] = useState(String(selectedStock?.purificationRate ?? 1.5));
  const [taxRatePct, setTaxRatePct] = useState(selectedStock?.market === "TH" ? 10 : 15);

  useEffect(() => {
    if (selectedStock) {
      setImpurePctInput(String(selectedStock.purificationRate ?? 1.5));
      setTaxRatePct(selectedStock.market === "TH" ? 10 : 15);
    }
  }, [selectedTicker, selectedStock]);

  const grossDividend = Math.max(0, Number(dividendInput) || 0);
  const taxAmount = (grossDividend * taxRatePct) / 100;
  const netReceived = grossDividend - taxAmount;
  const impureRate = Math.max(0, Number(impurePctInput) || 0);
  const purifyAmount = (netReceived * impureRate) / 100;
  const pureHalalDividend = netReceived - purifyAmount;

  const handleRecordPurification = () => {
    if (netReceived <= 0) return;
    onAddLog({
      id: Date.now(),
      date: new Date().toLocaleDateString("th-TH"),
      ticker: selectedStock.ticker,
      currency: curr,
      netReceived: Number(netReceived.toFixed(2)),
      impureRate,
      purifyAmount: Number(purifyAmount.toFixed(2)),
      pureHalalDividend: Number(pureHalalDividend.toFixed(2)),
    });
  };

  return (
    <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#112224] via-[#131824] to-[#131824] p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-white font-bold text-base flex items-center gap-2">
            🕌 เครื่องคิดเลขชำระล้างเงินปันผลฮาลาล (Halal Dividend Purification)
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            คำนวณยอดบริจาคชำระล้างรายได้ดอกเบี้ยแฝงตามมาตรฐาน AAOIFI เพื่อให้เงินปันผลสะอาดบริสุทธิ์ 100%
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
          AAOIFI Shariah Standard
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            1. เลือกหุ้นที่ได้รับปันผล
          </label>
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="w-full bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
          >
            {stocks.map((s) => (
              <option key={s.ticker} value={s.ticker} className="bg-[#131824]">
                {s.ticker} ({s.companyName}) {s.isHeld ? `[ถืออยู่ ${s.heldShares} หุ้น]` : ""}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-teal-400 mt-1.5">
            หนี้สินฮาลาล: {selectedStock?.debtRatio.toFixed(1)}% ({selectedStock?.halal ? "ผ่านเกณฑ์" : "เกินเกณฑ์"})
          </p>
        </div>

        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            2. เงินปันผลที่ได้รับ ({curr})
          </label>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-bold text-sm">{curr}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={dividendInput}
              onChange={(e) => setDividendInput(e.target.value)}
              className="w-full bg-transparent text-white font-extrabold text-base outline-none"
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">กรอกยอดก่อนหักภาษี หรือยอดสุทธิก็ได้</p>
        </div>

        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            3. หักภาษี ณ ที่จ่าย (%)
          </label>
          <div className="flex items-center gap-1.5 mt-1">
            {[
              { pct: 0, label: "0% (ยอดสุทธิแล้ว)" },
              { pct: 10, label: "10% (ไทย)" },
              { pct: 15, label: "15% (US)" },
            ].map((t) => (
              <button
                key={t.pct}
                type="button"
                onClick={() => setTaxRatePct(t.pct)}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  taxRatePct === t.pct
                    ? "bg-teal-500/25 border-teal-400/50 text-teal-300"
                    : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 mt-1.5">
            รับจริงหลังภาษี: <strong className="text-slate-300">{curr}{netReceived.toFixed(2)}</strong>
          </p>
        </div>

        <div className="bg-[#090D16] border border-white/10 rounded-xl p-3">
          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
            4. สัดส่วนชำระล้าง (% รายได้แฝง)
          </label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={impurePctInput}
              onChange={(e) => setImpurePctInput(e.target.value)}
              className="w-full bg-transparent text-amber-300 font-extrabold text-base outline-none"
            />
            <span className="text-amber-300 font-bold text-sm">%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            ค่าประมาณการของ {selectedStock?.ticker}: {selectedStock?.purificationRate}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="rounded-xl bg-[#090D16] border border-white/10 p-3.5">
          <p className="text-[11px] text-slate-400">เงินปันผลรับสุทธิ (หลังภาษี)</p>
          <p className="text-xl font-extrabold text-white mt-0.5">
            {curr}{netReceived.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="rounded-xl bg-amber-500/10 border border-amber-400/40 p-3.5">
          <p className="text-[11px] text-amber-300 font-bold">🤲 ยอดที่ต้องแบ่งบริจาคชำระล้าง ({impureRate}%)</p>
          <p className="text-2xl font-extrabold text-amber-300 mt-0.5">
            {curr}{purifyAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-amber-200/70 mt-0.5">นำไปบริจาคสาธารณประโยชน์ (ไม่หวังผลตอบแทน)</p>
        </div>

        <div className="rounded-xl bg-emerald-500/15 border border-emerald-400/40 p-3.5 flex flex-col justify-between">
          <div>
            <p className="text-[11px] text-emerald-300 font-bold">✨ เงินปันผลฮาลาลบริสุทธิ์ 100% (เก็บใช้ได้)</p>
            <p className="text-2xl font-extrabold text-emerald-300 mt-0.5">
              {curr}{pureHalalDividend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRecordPurification}
            className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all"
          >
            + บันทึกประวัติการชำระล้างปันผล
          </button>
        </div>
      </div>

      {purificationLogs && purificationLogs.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300">📜 ประวัติการชำระล้างเงินปันผลที่บันทึกไว้</span>
            <button
              type="button"
              onClick={onClearLogs}
              className="text-[11px] text-rose-400 hover:underline"
            >
              ล้างประวัติทั้งหมด
            </button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {purificationLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-wrap items-center justify-between bg-[#090D16] border border-white/5 rounded-lg px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.date}</span>
                  <span className="font-bold text-white">{log.ticker}</span>
                  <span className="text-slate-400">ปันผลรับ {log.currency}{log.netReceived}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-300 font-semibold">
                    บริจาคชำระล้าง: {log.currency}{log.purifyAmount} ({log.impureRate}%)
                  </span>
                  <span className="text-emerald-400 font-bold">
                    สุทธิฮาลาล: {log.currency}{log.pureHalalDividend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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
  const rsiColor = rsi <= 30 ? "text-emerald-400" : rsi <= 45 ? "text-teal-400" : rsi >= 70 ? "text-rose-400" : "text-yellow-300";
  const rsiLabel = rsi <= 30 ? "Oversold (โซนถูก)" : rsi <= 45 ? "Accumulate (สะสม)" : rsi >= 70 ? "Overbought (โซนตึง)" : "Neutral / Hold (ถือรอดู)";

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center text-xs mb-1.5">
        <span className="text-slate-400 font-medium">RSI (14D): <span className="text-slate-500 font-normal">{rsiLabel}</span></span>
        <span className={`font-bold ${rsiColor}`}>{rsi}</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-slate-800/80 relative border border-white/5">
        <div className="absolute inset-0 flex">
          <div className="bg-emerald-500/30" style={{ width: "30%" }} />
          <div className="bg-teal-500/20" style={{ width: "15%" }} />
          <div className="bg-yellow-500/25" style={{ width: "25%" }} />
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
        <span className="text-yellow-400/80">45 (Hold)</span>
        <span className="text-rose-500/80">70 (Sell)</span>
        <span>100</span>
      </div>
    </div>
  );
}

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
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-yellow-400 transition-all duration-300"
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
        <div className="relative w-full sm:w-60">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ค้นหาชื่อย่อ หรือ บริษัท..."
            className="w-full bg-[#090D16] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

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
        <div className="flex items-center gap-2 bg-[#090D16] border border-white/10 rounded-xl px-3 py-1.5">
          <ArrowUpDown size={14} className="text-emerald-400" />
          <span className="text-xs text-slate-400">เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-transparent text-xs font-medium text-white outline-none cursor-pointer"
          >
            <option value="BUY_NOW_FIRST" className="bg-[#131824]">ซื้อตอนนี้ได้เลยก่อน (Buy Now)</option>
            <option value="HELD_FIRST" className="bg-[#131824]">หุ้นที่ถืออยู่ในพอร์ตก่อน</option>
            <option value="RRR_DESC" className="bg-[#131824]">ความคุ้มค่า (RRR) สูงสุด</option>
            <option value="RSI_ASC" className="bg-[#131824]">RSI ต่ำไปสูง (น่าช้อนซื้อ)</option>
            <option value="UPSIDE_DESC" className="bg-[#131824]">เป้ากำไร (Upside %) สูงสุด</option>
            <option value="CHANGE_DESC" className="bg-[#131824]">ราคาบวกแรงสุดวันนี้</option>
            <option value="DEBT_ASC" className="bg-[#131824]">หนี้สิน (Debt %) ต่ำสุด</option>
          </select>
        </div>

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

// การ์ดหุ้นพร้อมป้าย "ซื้อตอนนี้ vs รอลงกว่านี้" + ปุ่มบันทึกหุ้นถือจริง + กล่อง "🗣️ เพื่อนคู่หูฟันธง"
function StockCard({ stock, onSelect, isFav, onToggleFav, onOpenHoldingModal }) {
  const curr = stock.currency || "$";
  const isPositive = stock.change >= 0;

  let cardToneClasses = "border-white/5 hover:border-emerald-500/40 bg-[#131824]";
  if (stock.status === "Strong Buy") {
    cardToneClasses = "border-emerald-500/40 hover:border-emerald-400 bg-gradient-to-b from-[#132226] via-[#131824] to-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.08)]";
  } else if (stock.status === "Buy") {
    cardToneClasses = "border-emerald-500/25 hover:border-emerald-500/50 bg-gradient-to-b from-[#131D26] to-[#131824]";
  } else if (stock.status === "Hold") {
    cardToneClasses = "border-yellow-500/35 hover:border-yellow-400/70 bg-gradient-to-b from-[#221F14] via-[#131824] to-yellow-950/15 shadow-[0_0_18px_rgba(234,179,8,0.06)]";
  } else if (stock.status === "Sell") {
    cardToneClasses = "border-rose-500/35 hover:border-rose-400/60 bg-gradient-to-b from-[#221520] via-[#131824] to-rose-950/15";
  }

  const buddyBoxTone =
    stock.timingState === "BUY_NOW"
      ? "bg-emerald-950/30 border-emerald-500/35 text-emerald-100"
      : stock.timingState === "WAIT_DIP"
      ? "bg-amber-950/25 border-yellow-500/35 text-amber-100"
      : "bg-rose-950/25 border-rose-500/35 text-rose-100";

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

        {/* แถวที่สอง: ราคาปัจจุบัน + ป้ายความคุ้มค่า (RRR) + สถานะหนี้ฮาลาล */}
        <div className="flex items-end justify-between mt-3.5 pb-3 border-b border-white/5">
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

          <div className="flex flex-col items-end gap-1">
            <WorthinessBadge worthLabel={stock.worthLabel} worthTone={stock.worthTone} />
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
              stock.halal ? "text-emerald-400" : "text-rose-400"
            }`}>
              {stock.halal ? <ShieldCheck size={12} /> : <CircleDot size={12} />}
              หนี้ {stock.debtRatio.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* 💼 แถบแสดงสถานะหุ้นที่ซื้อถืออยู่จริง */}
        {stock.isHeld ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenHoldingModal(stock);
            }}
            className={`mt-3 rounded-xl p-2.5 border transition-all ${
              stock.pnlAmount >= 0
                ? "bg-emerald-500/15 border-emerald-400/50"
                : "bg-rose-500/15 border-rose-400/50"
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1">
                💼 ถือจริง: {stock.heldShares} หุ้น @ {curr}{stock.avgCost.toFixed(2)}
              </span>
              <span className="text-[10px] underline text-slate-300 hover:text-white">แก้ไข</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-300">กำไร/ขาดทุนจริง:</span>
              <span className={`font-extrabold ${stock.pnlAmount >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                {stock.pnlAmount >= 0 ? "+" : ""}{curr}{stock.pnlAmount.toLocaleString()} ({stock.pnlPct >= 0 ? "+" : ""}{stock.pnlPct}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenHoldingModal(stock);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-[11px] font-semibold text-slate-300 hover:text-indigo-200 transition-all flex items-center justify-center gap-1.5"
            >
              💼 บันทึกว่าซื้อถืออยู่จริง (คำนวณกำไร/ขาดทุน)
            </button>
          </div>
        )}

        {/* 🚦 กล่องฟันธงจังหวะซื้อ: ซื้อตอนนี้เลย vs รอลงกว่านี้ + จำนวนเงินที่ควรลง */}
        <div className="mt-2.5 rounded-xl bg-[#090D16]/90 border border-sky-500/25 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">จังหวะเข้าซื้อ:</span>
            <ActionTimingBadge timingState={stock.timingState} timingBadge={stock.timingBadge} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-[10px] text-sky-400 font-bold uppercase tracking-wide">
                🎯 ราคาที่ควรตั้งซื้อ (Best Limit Buy)
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{stock.entryAdvice}</p>
            </div>
            <div className="text-right">
              <span className="text-base font-extrabold text-sky-300">
                {curr}{stock.bestBuyPrice.toFixed(2)}
              </span>
              {stock.entryDiscountPct > 0 && (
                <p className="text-[10px] text-yellow-300 font-semibold">รอลงอีก -{stock.entryDiscountPct}%</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Wallet size={12} className="text-emerald-400" /> งบที่ควรลง ({stock.allocPct}%):
            </span>
            {stock.allocPct > 0 ? (
              <span className="font-bold text-white">
                {curr}{stock.allocAmount.toLocaleString()}{" "}
                <span className="text-emerald-400 font-semibold">({stock.recommendedShares} หุ้น)</span>
              </span>
            ) : (
              <span className="text-rose-400 font-semibold">ไม่แนะนำลงเงินเพิ่ม (0%)</span>
            )}
          </div>
        </div>

        {/* แถบวัด RSI */}
        <RsiGauge rsi={stock.rsi} />

        {/* กล่อง Stop-Loss & Target พร้อมจำลองตัวเงินกำไร/ขาดทุน */}
        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
          <div className="rounded-xl bg-rose-500/[0.07] border border-rose-500/25 px-3 py-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
              <span className="flex items-center gap-1"><ShieldAlert size={11} className="text-rose-400" /> Stop-Loss</span>
              <span className="text-rose-400 font-semibold">-{stock.downsidePct}%</span>
            </div>
            <p className="text-rose-400 font-bold text-sm mt-0.5">{curr}{stock.stopLoss.toFixed(2)}</p>
            {stock.allocAmount > 0 && (
              <p className="text-[10px] text-rose-300/80 mt-0.5">เสี่ยงเสีย -{curr}{stock.maxLossMoney.toLocaleString()}</p>
            )}
          </div>

          <div className="rounded-xl bg-emerald-500/[0.07] border border-emerald-500/25 px-3 py-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
              <span className="flex items-center gap-1"><Target size={11} className="text-emerald-400" /> Target</span>
              <span className="text-emerald-400 font-semibold">+{stock.upsidePct}%</span>
            </div>
            <p className="text-emerald-400 font-bold text-sm mt-0.5">{curr}{stock.targetPrice.toFixed(2)}</p>
            {stock.allocAmount > 0 && (
              <p className="text-[10px] text-emerald-300/80 mt-0.5">เป้ากำไร +{curr}{stock.expectedProfitMoney.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* หลอดวัดตำแหน่งแนวรับ-แนวต้าน */}
        <PriceRangeBar stock={stock} />
      </div>

      {/* 🗣️ กล่องเพื่อนคู่หูฟันธง (AI Buddy Talk) บอกตรงๆ ว่าซื้อเลยหรือรอลงกว่านี้ */}
      <div className={`mt-3.5 p-3 rounded-xl border transition-all ${buddyBoxTone}`}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1.5 text-teal-300">
            <Sparkles size={12} /> 🗣️ เพื่อนคู่หู AI กระซิบบอก
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
            ดูกราฟ <ChevronRight size={12} />
          </span>
        </div>
        <p className="text-[11px] leading-relaxed font-medium">
          {stock.buddyTalk}
        </p>
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

function DashboardView({ stocks, indices, chartSeries, quickStats, onSelectStock, onNavigateSignals, onNavigatePortfolio, favorites, onToggleFav, onOpenHoldingModal }) {
  const [heroTicker, setHeroTicker] = useState("AAPL");
  const hero = stocks.find((s) => s.ticker === heroTicker) || stocks[0];
  const heroCurr = hero?.currency || "$";

  const topSetups = useMemo(() => {
    return [...stocks]
      .filter((s) => s.halal && s.currentPrice > 0)
      .sort((a, b) => {
        const aNow = a.timingState === "BUY_NOW" ? 1 : 0;
        const bNow = b.timingState === "BUY_NOW" ? 1 : 0;
        if (aNow !== bNow) return bNow - aNow;
        return b.rrr - a.rrr || a.rsi - b.rsi;
      })
      .slice(0, 4);
  }, [stocks]);

  const pinnedStocks = useMemo(() => {
    return stocks.filter((s) => favorites.includes(s.ticker));
  }, [stocks, favorites]);

  const heldStocks = useMemo(() => {
    return stocks.filter((s) => s.isHeld);
  }, [stocks]);

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

      {/* 💼 แถวแสดงหุ้นที่คุณซื้อถืออยู่จริง (My Active Positions P/L Banner) */}
      {heldStocks.length > 0 && (
        <div className="rounded-2xl border border-indigo-500/35 bg-gradient-to-r from-indigo-950/30 via-[#131824] to-emerald-950/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
            <h3 className="text-white font-bold text-sm flex items-center gap-2">
              💼 พอร์ตหุ้นที่คุณซื้อถืออยู่จริง (My Active Positions & Real-time P/L)
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-indigo-300">{heldStocks.length} รายการที่ถืออยู่</span>
              <button
                type="button"
                onClick={onNavigatePortfolio}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                🔄 ดูคำแนะนำปรับพอร์ต / สลับตัวเล่น →
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {heldStocks.map((s) => (
              <div
                key={s.ticker}
                onClick={() => onSelectStock(s.ticker)}
                className="p-3.5 rounded-xl bg-[#090D16]/90 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-sm">{s.ticker}</span>
                    <MarketBadge market={s.market} />
                    <span className="text-[11px] text-slate-400">({s.heldShares} หุ้น)</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenHoldingModal(s);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    ✏️ แก้ไข
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">ทุน {s.currency}{s.avgCost.toFixed(2)} → ล่าสุด {s.currency}{s.currentPrice.toFixed(2)}</span>
                  <span className={`font-extrabold ${s.pnlAmount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {s.pnlAmount >= 0 ? "+" : ""}{s.currency}{s.pnlAmount.toLocaleString()} ({s.pnlPct >= 0 ? "+" : ""}{s.pnlPct}%)
                  </span>
                </div>
                <p className="text-[11px] text-teal-300 leading-snug pt-1 border-t border-white/5">
                  {s.holdingAlert}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* แถวพิเศษ: แสดงรายการหุ้นโปรดที่ปักหมุดไว้ */}
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
                className="p-3.5 rounded-xl bg-[#090D16]/90 border border-amber-500/25 hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between gap-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{s.ticker}</span>
                      <MarketBadge market={s.market} />
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      ราคา: <strong>{s.currency}{s.currentPrice.toFixed(2)}</strong> · ตั้งรับ: <strong className="text-sky-400">{s.currency}{s.bestBuyPrice.toFixed(2)}</strong>
                    </p>
                  </div>
                  <FavoriteButton isFav={true} onToggle={() => onToggleFav(s.ticker)} size={13} />
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <ActionTimingBadge timingState={s.timingState} timingBadge={s.timingBadge} />
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* แถวที่ 2: กราฟ Interactive + Top Worthy Setups */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 rounded-2xl border border-white/5 p-5 flex flex-col justify-between" style={{ backgroundColor: CARD }}>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-bold text-base">{hero.companyName}</h3>
                  <MarketBadge market={hero.market} />
                  <ActionTimingBadge timingState={hero.timingState} timingBadge={hero.timingBadge} />
                  <WorthinessBadge worthLabel={hero.worthLabel} worthTone={hero.worthTone} />
                  <FavoriteButton
                    isFav={favorites.includes(hero.ticker)}
                    onToggle={() => onToggleFav(hero.ticker)}
                    size={14}
                  />
                </div>
                <div className="flex flex-wrap items-baseline gap-3 mt-1.5">
                  <span className="text-2xl font-extrabold text-white">{heroCurr}{hero.currentPrice.toFixed(2)}</span>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${hero.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {hero.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {hero.change >= 0 ? "+" : ""}{hero.change}%
                  </span>
                  <span className="text-xs text-sky-400">
                    จุดตั้งซื้อที่ดีที่สุด: <strong>{heroCurr}{hero.bestBuyPrice.toFixed(2)}</strong>
                  </span>
                  <span className="text-xs text-emerald-400">
                    ควรลง: <strong>{heroCurr}{hero.allocAmount.toLocaleString()} ({hero.recommendedShares} หุ้น)</strong>
                  </span>
                </div>
              </div>

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
              height={240}
              gradientId="priceFill"
              currency={heroCurr}
            />
          </div>

          <div className="mt-4 p-3.5 rounded-xl bg-[#090D16] border border-teal-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-teal-400 mr-1.5">🗣️ เพื่อนคู่หูบอก:</strong>
              {hero.buddyTalk}
            </p>
            <button
              onClick={() => onSelectStock(hero.ticker)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 shrink-0"
            >
              ดูแผนเจาะลึก <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* กล่องคัดหุ้นพร้อมลุย & คุ้มค่าที่สุดประจำวัน */}
        <div className="rounded-2xl border border-white/5 p-5 flex flex-col justify-between" style={{ backgroundColor: CARD }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-sm flex items-center gap-1.5">
                  <Sparkles size={15} className="text-emerald-400" /> หุ้นน่าช้อน & คุ้มค่าสูงสุดวันนี้
                </h3>
                <p className="text-slate-500 text-xs">จัดอันดับตัวที่ซื้อได้เลยและ RRR สูงสุด</p>
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
                  className="p-3 rounded-xl bg-[#090D16] border border-white/5 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{s.ticker}</span>
                      <MarketBadge market={s.market} />
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-semibold">
                        RRR 1:{s.rrr}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{s.currency}{s.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <ActionTimingBadge timingState={s.timingState} timingBadge={s.timingBadge} />
                    <span className="text-[11px] text-slate-400">
                      ตั้งรับ <strong className="text-sky-400">{s.currency}{s.bestBuyPrice.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>คำนวณขนาดไม้จากเงินสดในมือของคุณ</span>
            <span className="text-emerald-400">AI Buddy Active</span>
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

// 💼🕌 หน้าใหม่ (แท็บที่ 4): พอร์ตหุ้นที่ถืออยู่จริง + AI จัดสรรเงินอิสระข้ามตลาด + AI แนะนำปรับพอร์ต/สลับตัว + ชำระล้างปันผลฮาลาล
function MyPortfolioAndPurificationView({
  stocks,
  portfolio,
  onSelectStock,
  onOpenHoldingModal,
  onSaveHolding,
  onRemoveHolding,
  purificationLogs,
  onAddPurificationLog,
  onClearPurificationLogs,
}) {
  const heldStocks = useMemo(() => stocks.filter((s) => s.isHeld), [stocks]);

  const summary = useMemo(() => {
    const thHeld = heldStocks.filter((s) => s.market === "TH");
    const usHeld = heldStocks.filter((s) => s.market === "US");

    const thInvested = thHeld.reduce((acc, s) => acc + s.investedCapital, 0);
    const thCurrent = thHeld.reduce((acc, s) => acc + s.currentMarketValue, 0);
    const thPnl = thCurrent - thInvested;
    const thPnlPct = thInvested > 0 ? (thPnl / thInvested) * 100 : 0;

    const usInvested = usHeld.reduce((acc, s) => acc + s.investedCapital, 0);
    const usCurrent = usHeld.reduce((acc, s) => acc + s.currentMarketValue, 0);
    const usPnl = usCurrent - usInvested;
    const usPnlPct = usInvested > 0 ? (usPnl / usInvested) * 100 : 0;

    return { thInvested, thCurrent, thPnl, thPnlPct, usInvested, usCurrent, usPnl, usPnlPct };
  }, [heldStocks]);

  return (
    <div className="space-y-6">
      {/* แถวที่ 1: การ์ดสรุปพอร์ตหุ้นไทย (THB) และอเมริกา (USD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 p-5" style={{ backgroundColor: CARD }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">🇹🇭 พอร์ตหุ้นไทยที่ถือจริง (THB)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300">
              {heldStocks.filter((s) => s.market === "TH").length} บริษัท
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <p className="text-[11px] text-slate-500">มูลค่าตลาดปัจจุบัน</p>
              <p className="text-2xl font-extrabold text-white">฿{summary.thCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-slate-400 mt-0.5">ต้นทุนรวม: ฿{summary.thInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">กำไร/ขาดทุนรวม</p>
              <p className={`text-xl font-extrabold ${summary.thPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {summary.thPnl >= 0 ? "+" : ""}฿{summary.thPnl.toFixed(2)}
              </p>
              <p className={`text-xs font-bold ${summary.thPnlPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                ({summary.thPnlPct >= 0 ? "+" : ""}{summary.thPnlPct.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-5" style={{ backgroundColor: CARD }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">🇺🇸 พอร์ตหุ้นอเมริกาที่ถือจริง (USD)</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300">
              {heldStocks.filter((s) => s.market === "US").length} บริษัท
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div>
              <p className="text-[11px] text-slate-500">มูลค่าตลาดปัจจุบัน</p>
              <p className="text-2xl font-extrabold text-white">${summary.usCurrent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs text-slate-400 mt-0.5">ต้นทุนรวม: ${summary.usInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">กำไร/ขาดทุนรวม</p>
              <p className={`text-xl font-extrabold ${summary.usPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {summary.usPnl >= 0 ? "+" : ""}${summary.usPnl.toFixed(2)}
              </p>
              <p className={`text-xs font-bold ${summary.usPnlPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                ({summary.usPnlPct >= 0 ? "+" : ""}{summary.usPnlPct.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* แถวที่ 2: ตารางรายการหุ้นที่ซื้อถืออยู่จริง */}
      <div className="rounded-2xl border border-white/5 p-5" style={{ backgroundColor: CARD }}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-white font-bold text-base">💼 รายการหุ้นที่คุณซื้อถืออยู่จริง (Active Positions)</h3>
            <p className="text-slate-400 text-xs">คลิกปุ่ม "+ บันทึกหุ้นเข้าพอร์ตเพิ่ม" เพื่ออัปเดตต้นทุนและจำนวนหุ้นของคุณ</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenHoldingModal(stocks[0])}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
          >
            + บันทึกหุ้นเข้าพอร์ตเพิ่ม
          </button>
        </div>

        {heldStocks.length === 0 ? (
          <div className="rounded-xl bg-[#090D16] border border-white/5 p-8 text-center space-y-2">
            <p className="text-slate-300 font-semibold text-sm">ยังไม่มีรายการหุ้นที่บันทึกว่าถืออยู่จริง</p>
            <p className="text-slate-500 text-xs">
              คุณสามารถกดปุ่ม <strong>"💼 บันทึกว่าซื้อถืออยู่จริง"</strong> บนการ์ดหุ้นตัวไหนก็ได้ หรือกดปุ่มจากกล่องจัดสรรเงินด้านล่างเพื่อเริ่มติดตามพอร์ต
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#090D16]/60 text-left text-slate-400 text-xs uppercase">
                  <th className="px-4 py-3 font-semibold">หุ้น</th>
                  <th className="px-4 py-3 font-semibold">จำนวนที่ถือ</th>
                  <th className="px-4 py-3 font-semibold">ทุนเฉลี่ย → ราคาปัจจุบัน</th>
                  <th className="px-4 py-3 font-semibold">มูลค่าปัจจุบัน</th>
                  <th className="px-4 py-3 font-semibold">กำไร / ขาดทุน (P/L)</th>
                  <th className="px-4 py-3 font-semibold">คำแนะนำเพื่อน AI สำหรับคนมีของ</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {heldStocks.map((s) => (
                  <tr
                    key={s.ticker}
                    onClick={() => onSelectStock(s.ticker)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {s.ticker} <MarketBadge market={s.market} />
                      </div>
                      <div className="text-xs text-slate-400">{s.companyName}</div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">{s.heldShares} หุ้น</td>
                    <td className="px-4 py-3.5 text-xs">
                      <span className="text-slate-300">{s.currency}{s.avgCost.toFixed(2)}</span>
                      <span className="mx-1.5 text-slate-500">→</span>
                      <span className="font-bold text-white">{s.currency}{s.currentPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-white">
                      {s.currency}{s.currentMarketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`font-extrabold ${s.pnlAmount >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {s.pnlAmount >= 0 ? "+" : ""}{s.currency}{s.pnlAmount.toLocaleString()} ({s.pnlPct >= 0 ? "+" : ""}{s.pnlPct}%)
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-teal-300 max-w-xs">{s.holdingAlert}</td>
                    <td className="px-4 py-3.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenHoldingModal(s);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                      >
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🎯 แถวที่ 3: AI คำนวณการจัดสรรเงินลงทุนอิสระ (กำหนดจำนวนตัวได้เอง + เลือกตลาด TH/US/รวม + ใช้ ฿ หรือ $ ซื้อได้ทุกตัว) */}
      <SmartFocusAllocatorBox
        stocks={stocks}
        portfolio={portfolio}
        onSelectStock={onSelectStock}
        onSaveHolding={onSaveHolding}
      />

      {/* 🔄 แถวที่ 4: AI แนะนำการปรับพอร์ต, คัทลอส, ซื้อถัวเฉลี่ย และสลับตัวเล่นข้ามตลาด */}
      <PortfolioActionAdvisorBox
        stocks={stocks}
        heldStocks={heldStocks}
        portfolio={portfolio}
        onSelectStock={onSelectStock}
        onSaveHolding={onSaveHolding}
        onRemoveHolding={onRemoveHolding}
      />

      {/* 🕌 แถวที่ 5: เครื่องคิดเลขชำระล้างเงินปันผลฮาลาล */}
      <DividendPurificationBox
        stocks={stocks}
        defaultTicker={heldStocks[0]?.ticker || "AAPL"}
        purificationLogs={purificationLogs}
        onAddLog={onAddPurificationLog}
        onClearLogs={onClearPurificationLogs}
      />
    </div>
  );
}

// หน้าตาราง Screener พร้อมคอลัมน์ "จังหวะซื้อ (ซื้อเลย vs รอย่อ)" + ข้อมูลมูลค่าหนี้ครบถ้วนจาก App (6).jsx
function ScreenerView({ stocks, onSelectStock, favorites, onToggleFav, onOpenHoldingModal }) {
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [query, setQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("BUY_NOW_FIRST");

  const filtered = useMemo(() => {
    const list = stocks.filter((s) => {
      if (onlyHalal && !s.halal) return false;
      if (onlyFav && !favorites.includes(s.ticker)) return false;
      if (marketFilter !== "ALL" && s.market !== marketFilter) return false;
      if (query && !s.ticker.toLowerCase().includes(query.toLowerCase()) && !s.companyName.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });

    return list.sort((a, b) => {
      const aFav = favorites.includes(a.ticker) ? 1 : 0;
      const bFav = favorites.includes(b.ticker) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      if (sortBy === "HELD_FIRST") {
        if (a.isHeld !== b.isHeld) return a.isHeld ? -1 : 1;
      }
      if (sortBy === "BUY_NOW_FIRST") {
        const order = { BUY_NOW: 1, WAIT_DIP: 2, AVOID: 3 };
        if (order[a.timingState] !== order[b.timingState]) {
          return order[a.timingState] - order[b.timingState];
        }
        return b.rrr - a.rrr;
      }
      if (sortBy === "RRR_DESC") return b.rrr - a.rrr;
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
                <th className="px-4 py-3.5 font-semibold">Ticker / หมวดธุรกิจ</th>
                <th className="px-4 py-3.5 font-semibold">ราคาล่าสุด</th>
                <th className="px-4 py-3.5 font-semibold text-sky-400">ซื้อตอนนี้ หรือ รอลงกว่านี้?</th>
                <th className="px-4 py-3.5 font-semibold">ความคุ้มค่า (RRR)</th>
                <th className="px-4 py-3.5 font-semibold text-emerald-400">เงินที่ควรลง (จำนวนหุ้น)</th>
                <th className="px-4 py-3.5 font-semibold">สัญญาณ / RSI</th>
                <th className="px-4 py-3.5 font-semibold">สัดส่วนหนี้ฮาลาล</th>
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
                        <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-white/5 text-slate-400">{s.sector}</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-0.5">{s.companyName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white font-bold">{curr}{s.currentPrice.toFixed(2)}</span>
                      <span className={`ml-2 text-xs font-semibold ${s.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                        {s.change >= 0 ? "+" : ""}{s.change}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ActionTimingBadge timingState={s.timingState} timingBadge={s.timingBadge} />
                      <div className="text-[11px] text-sky-300 font-semibold mt-1">
                        จุดตั้งซื้อ: {curr}{s.bestBuyPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <WorthinessBadge worthLabel={s.worthLabel} worthTone={s.worthTone} />
                      <div className="text-[10px] text-slate-500 mt-1">
                        เป้า +{s.upsidePct}% / เสี่ยง -{s.downsidePct}%
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {s.allocPct > 0 ? (
                        <>
                          <div className="font-bold text-white">
                            {curr}{s.allocAmount.toLocaleString()}{" "}
                            <span className="text-xs text-emerald-400">({s.allocPct}%)</span>
                          </div>
                          <div className="text-[11px] text-slate-400">ซื้อได้ {s.recommendedShares} หุ้น</div>
                        </>
                      ) : (
                        <span className="text-xs text-rose-400 font-medium block">งดลงทุนเพิ่ม (0%)</span>
                      )}
                      {s.isHeld ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenHoldingModal(s);
                          }}
                          className={`mt-1 text-[11px] font-bold underline block ${s.pnlAmount >= 0 ? "text-emerald-300" : "text-rose-300"}`}
                        >
                          💼 ถือ {s.heldShares} หุ้น ({s.pnlPct >= 0 ? "+" : ""}{s.pnlPct}%)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenHoldingModal(s);
                          }}
                          className="mt-1 text-[10px] text-slate-400 hover:text-indigo-300 underline block"
                        >
                          + บันทึกว่าซื้อถืออยู่
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.status} />
                        <span className={`text-xs font-bold ${s.rsi <= 30 ? "text-emerald-400" : s.rsi >= 70 ? "text-rose-400" : "text-yellow-300"}`}>
                          RSI {s.rsi}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${s.halal ? "text-emerald-400" : "text-rose-400"}`}>
                          {s.debtRatio.toFixed(1)}%
                        </span>
                        {s.halal ? (
                          <Pill tone="halal"><CheckCircle2 size={11} /> Pass</Pill>
                        ) : (
                          <Pill tone="nonhalal"><AlertTriangle size={11} /> Fail</Pill>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {s.totalAssets > 0 ? `${curr}${s.totalDebt}M / ${curr}${s.totalAssets}M` : "N/A"} · ชำระปันผล ~{s.purificationRate}%
                      </div>
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
function SignalsView({ stocks, onSelectStock, favorites, onToggleFav, onOpenHoldingModal }) {
  const [filter, setFilter] = useState("All");
  const [marketFilter, setMarketFilter] = useState("ALL");
  const [onlyHalal, setOnlyHalal] = useState(false);
  const [onlyFav, setOnlyFav] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("BUY_NOW_FIRST");

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
      const aFav = favorites.includes(a.ticker) ? 1 : 0;
      const bFav = favorites.includes(b.ticker) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      if (sortBy === "HELD_FIRST") {
        if (a.isHeld !== b.isHeld) return a.isHeld ? -1 : 1;
      }
      if (sortBy === "BUY_NOW_FIRST") {
        const order = { BUY_NOW: 1, WAIT_DIP: 2, AVOID: 3 };
        if (order[a.timingState] !== order[b.timingState]) {
          return order[a.timingState] - order[b.timingState];
        }
        return b.rrr - a.rrr;
      }
      if (sortBy === "RRR_DESC") return b.rrr - a.rrr;
      if (sortBy === "RSI_ASC") return a.rsi - b.rsi;
      if (sortBy === "UPSIDE_DESC") return b.upsidePct - a.upsidePct;
      if (sortBy === "CHANGE_DESC") return b.change - a.change;
      if (sortBy === "DEBT_ASC") return a.debtRatio - b.debtRatio;
      return 0;
    });
  }, [stocks, filter, marketFilter, onlyHalal, onlyFav, favorites, query, sortBy]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {["All", "Strong Buy", "Buy", "Hold", "Sell"].map((f) => {
          const isActive = filter === f;
          let activeBtnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm";
          if (f === "Hold" && isActive) {
            activeBtnStyle = "bg-yellow-500/20 border-yellow-400/60 text-yellow-300 shadow-sm";
          } else if (f === "Sell" && isActive) {
            activeBtnStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-sm";
          }
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isActive
                  ? activeBtnStyle
                  : "bg-[#131824] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <span>{f}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-white/5 text-slate-400"}`}>
                {signalCounts[f]}
              </span>
            </button>
          );
        })}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((sig) => (
          <StockCard
            key={sig.ticker}
            stock={sig}
            onSelect={onSelectStock}
            isFav={favorites.includes(sig.ticker)}
            onToggleFav={() => onToggleFav(sig.ticker)}
            onOpenHoldingModal={onOpenHoldingModal}
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

function StockDetailView({
  stock,
  allStocks,
  onBack,
  isFav,
  onToggleFav,
  onOpenHoldingModal,
  purificationLogs,
  onAddPurificationLog,
  onClearPurificationLogs,
}) {
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
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-white text-xl font-bold">{stock.companyName}</h2>
            <span className="text-slate-400 font-semibold text-sm">({stock.ticker})</span>
            <MarketBadge market={stock.market} />
            <FavoriteButton isFav={isFav} onToggle={onToggleFav} size={16} />
            <button
              type="button"
              onClick={() => onOpenHoldingModal(stock)}
              className="px-3 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-xs font-bold transition-all"
            >
              {stock.isHeld ? `💼 ถืออยู่ ${stock.heldShares} หุ้น (${stock.pnlPct >= 0 ? "+" : ""}{stock.pnlPct}%) · แก้ไข` : "💼 + บันทึกว่าซื้อถืออยู่จริง"}
            </button>
          </div>
          <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
            <span className="text-3xl font-extrabold text-white">{curr}{stock.currentPrice.toFixed(2)}</span>
            <span className={`text-sm font-semibold flex items-center gap-0.5 ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {stock.change >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {stock.change >= 0 ? "+" : ""}{stock.change}%
            </span>
            <ActionTimingBadge timingState={stock.timingState} timingBadge={stock.timingBadge} />
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <WorthinessBadge worthLabel={stock.worthLabel} worthTone={stock.worthTone} />
          <Pill tone={stock.halal ? "halal" : "nonhalal"}>
            <ShieldCheck size={13} /> {stock.label} (หนี้ {stock.debtRatio.toFixed(1)}%)
          </Pill>
          <StatusBadge status={stock.status} />
        </div>
      </div>

      {/* 🗣️ กล่องคำแนะนำจากเพื่อนคู่หู AI (Buddy Verdict Banner) */}
      <div className="rounded-2xl border border-teal-500/40 bg-gradient-to-r from-teal-950/40 via-[#131824] to-emerald-950/30 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-teal-400" />
          <h3 className="text-sm font-extrabold text-teal-300 uppercase tracking-wide">
            🗣️ เพื่อนคู่หูฟันธง (ควรซื้อตอนนี้เลย หรือ รอลงกว่านี้?)
          </h3>
        </div>
        <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
          {stock.buddyTalk}
        </p>
      </div>

      {/* 🧮 กล่องสรุปแผนการตั้งซื้อและขนาดเงินลงทุนรายตัว */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-sky-500/30 bg-sky-500/[0.06] p-4">
          <p className="text-xs font-bold text-sky-400 uppercase">🎯 ราคาที่ควรตั้งซื้อ (Best Limit Buy)</p>
          <p className="text-2xl font-extrabold text-white mt-1">{curr}{stock.bestBuyPrice.toFixed(2)}</p>
          <p className="text-xs text-slate-300 mt-1">{stock.entryAdvice}</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4">
          <p className="text-xs font-bold text-emerald-400 uppercase">⚖️ ความคุ้มค่าในการลงทุน (RRR)</p>
          <p className="text-2xl font-extrabold text-white mt-1">1 : {stock.rrr}</p>
          <p className="text-xs text-slate-300 mt-1">
            หากรับที่จุดตั้งซื้อจะได้ RRR <strong>1 : {stock.bestLimitRrr}</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/[0.06] p-4">
          <p className="text-xs font-bold text-yellow-300 uppercase">💰 ปริมาณเงินที่ควรลงไม้นี้</p>
          <p className="text-2xl font-extrabold text-white mt-1">
            {curr}{stock.allocAmount.toLocaleString()}{" "}
            <span className="text-sm font-bold text-yellow-300">({stock.allocPct}%)</span>
          </p>
          <p className="text-xs text-slate-300 mt-1">
            ตั้งซื้อได้ประมาณ <strong className="text-white">{stock.recommendedShares} หุ้น</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#131824] p-4">
          <p className="text-xs font-bold text-slate-400 uppercase">📊 จำลองกำไร / ความเสี่ยงเป็นตัวเงิน</p>
          <div className="flex items-center justify-between mt-2 text-sm">
            <span className="text-slate-400">ถ้าถึง Target:</span>
            <span className="font-bold text-emerald-400">+{curr}{stock.expectedProfitMoney.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mt-1 text-sm">
            <span className="text-slate-400">ถ้าโดน Stop-Loss:</span>
            <span className="font-bold text-rose-400">-{curr}{stock.maxLossMoney.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 rounded-2xl border border-white/5 p-5" style={{ backgroundColor: CARD }}>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h3 className="text-white text-sm font-bold">กราฟแนวโน้มราคา 30 วัน & จุดตั้งซื้อ</h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Target {curr}{stock.targetPrice.toFixed(2)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-sky-400 inline-block" /> Best Buy {curr}{stock.bestBuyPrice.toFixed(2)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-rose-500 inline-block" /> Stop-Loss {curr}{stock.stopLoss.toFixed(2)}
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
              { y: stock.bestBuyPrice, color: SKY, label: "Best Buy", position: "insideTopLeft" },
              { y: stock.stopLoss, color: CRIMSON, label: "Stop-Loss", position: "insideBottomRight" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-white/5 p-5 flex flex-col" style={{ backgroundColor: CARD }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-lg p-1.5 bg-emerald-500/10"><Gauge size={16} className="text-emerald-400" /></div>
            <h3 className="text-white text-sm font-bold">สรุปแผนเข้าซื้อและบริหารความเสี่ยง</h3>
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

      {/* 🕌 เครื่องคิดเลขชำระล้างเงินปันผลฮาลาลของหุ้นตัวนี้ */}
      <DividendPurificationBox
        stocks={allStocks}
        defaultTicker={stock.ticker}
        purificationLogs={purificationLogs}
        onAddLog={onAddPurificationLog}
        onClearLogs={onClearPurificationLogs}
      />

      {/* กล่องข้อมูลธุรกิจและความเสี่ยงฮาลาลจาก Gemini */}
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
  { key: "myportfolio", label: "Portfolio & Purify", icon: Wallet },
];

export default function HalalDashboard() {
  const [view, setView] = useState("dashboard");
  const [selectedTicker, setSelectedTicker] = useState(null);
  const [editingHoldingTicker, setEditingHoldingTicker] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState(null);

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("halal_fav_tickers");
      return saved ? JSON.parse(saved) : ["AAPL", "BDMS.BK"];
    } catch {
      return ["AAPL", "BDMS.BK"];
    }
  });

  const [portfolio, setPortfolio] = useState(() => {
    try {
      const saved = localStorage.getItem("halal_portfolio_cash");
      return saved
        ? { thCash: 50000, usCash: 1500, baseAllocPct: 15, fxRate: 34.5, ...JSON.parse(saved) }
        : { thCash: 50000, usCash: 1500, baseAllocPct: 15, fxRate: 34.5 };
    } catch {
      return { thCash: 50000, usCash: 1500, baseAllocPct: 15, fxRate: 34.5 };
    }
  });

  // 💼 ระบบบันทึก "หุ้นที่ซื้อถืออยู่จริง" (localStorage)
  const [holdings, setHoldings] = useState(() => {
    try {
      const saved = localStorage.getItem("halal_active_holdings");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // 🕌 ระบบบันทึกประวัติการชำระล้างเงินปันผลฮาลาล (localStorage)
  const [purificationLogs, setPurificationLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("halal_purification_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleUpdatePortfolio = useCallback((nextPortfolio) => {
    setPortfolio(nextPortfolio);
    try {
      localStorage.setItem("halal_portfolio_cash", JSON.stringify(nextPortfolio));
    } catch {}
  }, []);

  const handleSaveHolding = useCallback((ticker, shares, avgCost) => {
    setHoldings((prev) => {
      const next = { ...prev, [ticker]: { shares: Number(shares), avgCost: Number(avgCost) } };
      try {
        localStorage.setItem("halal_active_holdings", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleRemoveHolding = useCallback((ticker) => {
    setHoldings((prev) => {
      const next = { ...prev };
      delete next[ticker];
      try {
        localStorage.setItem("halal_active_holdings", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleAddPurificationLog = useCallback((newLog) => {
    setPurificationLogs((prev) => {
      const next = [newLog, ...prev].slice(0, 30);
      try {
        localStorage.setItem("halal_purification_logs", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleClearPurificationLogs = useCallback(() => {
    setPurificationLogs([]);
    try {
      localStorage.removeItem("halal_purification_logs");
    } catch {}
  }, []);

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
    return marketData.stocks.map((s) => analyzeStock(s, portfolio, holdings));
  }, [marketData, portfolio, holdings]);

  const quickStats = useMemo(() => {
    if (!analyzedStocks.length) return [];
    return buildQuickStats(analyzedStocks, favorites.length);
  }, [analyzedStocks, favorites.length]);

  const heldCount = useMemo(() => analyzedStocks.filter((s) => s.isHeld).length, [analyzedStocks]);

  const liveStatus = getLiveMarketStatus();

  const titleMap = {
    dashboard: "Market Overview & AI Buddy Verdict",
    screener: "Halal Compliance & Buy Timing Screener",
    signals: "Active Trading Signals & Buddy Advice",
    myportfolio: "My Active Positions, Cross-Currency Allocator & Switching Advisor",
  };
  const selectedStock = selectedTicker ? analyzedStocks.find((s) => s.ticker === selectedTicker) : null;
  const editingStock = editingHoldingTicker ? analyzedStocks.find((s) => s.ticker === editingHoldingTicker) : null;

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
              <p className="text-slate-500 text-[11px] leading-tight">AI Buddy & Sizing Desk</p>
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
                <span className="flex items-center gap-2.5">
                  <Icon size={16} />
                  {item.label}
                  {item.key === "myportfolio" && heldCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/30 text-emerald-200">
                      {heldCount}
                    </span>
                  )}
                </span>
                <ChevronRight size={14} className={`hidden lg:block transition-all ${active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0"}`} />
              </button>
            );
          })}
        </nav>

        <div className="hidden lg:block mt-auto rounded-xl border border-white/5 p-3.5 bg-[#090D16]">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
            <Sparkles size={13} /> AI Buddy Coach
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            เพื่อนคู่หู AI ช่วยจัดสรรเงินลงทุนข้ามตลาด (฿/$) กำหนดจำนวนหุ้นเองได้ แนะนำจุดคัทลอส/ซื้อถัว/สลับตัวเล่นครบวงจร
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {!selectedStock && !isLoading && !error && (
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight">{titleMap[view]}</h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                {view === "dashboard" && "เพื่อนคู่หู AI ช่วยชี้เป้าว่าตัวไหนซื้อตอนนี้ได้เลย หรือตัวไหนต้องรอให้ย่อลงมาก่อน"}
                {view === "screener" && "ตารางเทียบจังหวะเข้าซื้อ (ซื้อเลย vs รอย่อ) ความคุ้มค่า (RRR) และจำนวนเงินที่ควรลง"}
                {view === "signals" && "การ์ดสัญญาณเทรดพร้อมคำแนะนำภาษาเพื่อน บอกจุดตั้งรับและขนาดไม้รายตัว"}
                {view === "myportfolio" && "AI คำนวณจัดสรรเงินลงทุนอิสระ (เลือกตลาด TH/US/รวม · ใช้เงิน ฿ หรือ $ ซื้อได้ทุกตัว) และแนะนำการปรับพอร์ต/สลับตัวเล่น"}
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

        {!isLoading && !error && (
          <PortfolioCashBar
            portfolio={portfolio}
            onUpdatePortfolio={handleUpdatePortfolio}
            heldCount={heldCount}
            onOpenPortfolioTab={() => handleNavClick("myportfolio")}
          />
        )}

        {isLoading && !marketData && <DashboardSkeleton />}
        {!isLoading && error && !marketData && <LoadingState message={error} />}
        {marketData && (
          <>
            {selectedStock ? (
              <StockDetailView
                stock={selectedStock}
                allStocks={analyzedStocks}
                onBack={() => setSelectedTicker(null)}
                isFav={favorites.includes(selectedStock.ticker)}
                onToggleFav={() => toggleFavorite(selectedStock.ticker)}
                onOpenHoldingModal={(s) => setEditingHoldingTicker(s.ticker)}
                purificationLogs={purificationLogs}
                onAddPurificationLog={handleAddPurificationLog}
                onClearPurificationLogs={handleClearPurificationLogs}
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
                    onNavigatePortfolio={() => handleNavClick("myportfolio")}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                    onOpenHoldingModal={(s) => setEditingHoldingTicker(s.ticker)}
                  />
                )}
                {view === "screener" && (
                  <ScreenerView
                    stocks={analyzedStocks}
                    onSelectStock={handleSelectStock}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                    onOpenHoldingModal={(s) => setEditingHoldingTicker(s.ticker)}
                  />
                )}
                {view === "signals" && (
                  <SignalsView
                    stocks={analyzedStocks}
                    onSelectStock={handleSelectStock}
                    favorites={favorites}
                    onToggleFav={toggleFavorite}
                    onOpenHoldingModal={(s) => setEditingHoldingTicker(s.ticker)}
                  />
                )}
                {view === "myportfolio" && (
                  <MyPortfolioAndPurificationView
                    stocks={analyzedStocks}
                    portfolio={portfolio}
                    onSelectStock={handleSelectStock}
                    onOpenHoldingModal={(s) => setEditingHoldingTicker(s.ticker)}
                    onSaveHolding={handleSaveHolding}
                    onRemoveHolding={handleRemoveHolding}
                    purificationLogs={purificationLogs}
                    onAddPurificationLog={handleAddPurificationLog}
                    onClearPurificationLogs={handleClearPurificationLogs}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ป๊อปอัปบันทึก/แก้ไขหุ้นที่ถืออยู่จริง */}
        {editingStock && (
          <HoldingEditorModal
            stock={editingStock}
            allStocks={analyzedStocks}
            onClose={() => setEditingHoldingTicker(null)}
            onSaveHolding={handleSaveHolding}
            onRemoveHolding={handleRemoveHolding}
          />
        )}
      </main>
    </div>
  );
}