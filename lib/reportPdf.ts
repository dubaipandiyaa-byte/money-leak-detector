/**
 * Client-side PDF export of the money report, built with pdf-lib.
 * A4, branded, fully self-contained — generated in the browser so the
 * statement data never leaves the device.
 *
 * Visual design only — every field below comes from the same `Report`
 * object the on-screen dashboard uses; nothing here computes or invents
 * new numbers.
 */
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import type { Report } from "./analyzer";

/* ── Palette ────────────────────────────────────────────────────
 * Same brand colors as the app (graphite/emerald/risk/quiet/hairline),
 * plus a warm gold accent for the print-only "premium report" treatment
 * (section markers, the cover page, category chips) and a soft blue used
 * only for the "Routine & essential" bucket bar, mirroring the product's
 * existing amber/emerald/risk system rather than introducing new brand
 * colors.
 */
const NAVY = rgb(0.067, 0.078, 0.098); // cover background / dark cards
const GRAPHITE = rgb(0.08, 0.095, 0.11);
const QUIET = rgb(0.47, 0.51, 0.55);
const QUIET_LIGHT = rgb(0.68, 0.71, 0.74); // muted text on the dark cover
const EMERALD = rgb(0.02, 0.59, 0.41);
const RISK = rgb(0.85, 0.29, 0.18);
const HAIRLINE = rgb(0.89, 0.91, 0.92);
const HAIRLINE_DARK = rgb(0.22, 0.24, 0.27);
const GOLD = rgb(0.72, 0.55, 0.19);
const GOLD_SOFT = rgb(0.97, 0.94, 0.85);
const BLUE = rgb(0.29, 0.46, 0.74);
const PAPER = rgb(0.985, 0.985, 0.98);
const WHITE = rgb(1, 1, 1);

const W = 595.28; // A4 portrait, points
const H = 841.89;
const M = 48;
const CONTENT_W = W - M * 2;

/** Helvetica (WinAnsi) can't encode every glyph — strip what it can't. */
function clean(s: string): string {
  return s.replace(/—/g, "-").replace(/’/g, "'").replace(/[^\x20-\x7E\xA0-\xFF]/g, "").trim();
}

/** Cover-page hero artwork, bundled as a static asset. Returns null (never
 * throws) if it can't be fetched, so a missing/blocked asset never breaks
 * report generation — the caller falls back to the old abstract glow. */
async function loadHeroImage(doc: PDFDocument) {
  try {
    const res = await fetch("/images/report-hero.png");
    if (!res.ok) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    return await doc.embedPng(bytes);
  } catch {
    return null;
  }
}

export async function generateReportPdf(r: Report, fileName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Money Report - Money Leak Detector");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([W, H]);
  let y = H;

  const money = (n: number) => `${r.currency} ${Math.round(n).toLocaleString("en-US")}`;

  const newPage = () => {
    page = doc.addPage([W, H]);
    y = H - M;
  };
  const ensure = (h: number) => {
    if (y - h < M + 20) newPage();
  };

  /** Truncate a string to fit maxW at the given size/font. */
  const fit = (s: string, f: PDFFont, size: number, maxW: number) => {
    let out = clean(s);
    if (f.widthOfTextAtSize(out, size) <= maxW) return out;
    while (out.length > 1 && f.widthOfTextAtSize(`${out}...`, size) > maxW) {
      out = out.slice(0, -1);
    }
    return `${out}...`;
  };
  const draw = (s: string, x: number, size: number, f: PDFFont, color = GRAPHITE) => {
    page.drawText(clean(s), { x, y: y - size, size, font: f, color });
  };
  const drawAt = (s: string, x: number, yPos: number, size: number, f: PDFFont, color = GRAPHITE) => {
    page.drawText(clean(s), { x, y: yPos, size, font: f, color });
  };
  const drawRight = (s: string, xRight: number, size: number, f: PDFFont, color = GRAPHITE) => {
    const t = clean(s);
    page.drawText(t, { x: xRight - f.widthOfTextAtSize(t, size), y: y - size, size, font: f, color });
  };
  const line = (s: string, size = 10, f: PDFFont = font, color = GRAPHITE, gap = 5, x = M) => {
    ensure(size + gap);
    draw(s, x, size, f, color);
    y -= size + gap;
  };
  /** How many lines `s` will wrap to at this width — same greedy algorithm
   *  `para` uses, so a box can be sized to fit before any text is drawn. */
  const wrapLines = (s: string, f: PDFFont, size: number, maxW: number): number => {
    const words = clean(s).split(" ");
    let cur = "";
    let lines = 0;
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) > maxW) {
        lines += 1;
        cur = w;
      } else cur = test;
    }
    if (cur) lines += 1;
    return Math.max(lines, 1);
  };
  /** Word-wrapped paragraph. */
  const para = (s: string, size = 9.5, f: PDFFont = font, color = QUIET, gap = 4, maxW = CONTENT_W, x = M) => {
    const words = clean(s).split(" ");
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) > maxW) {
        line(cur, size, f, color, 3, x);
        cur = w;
      } else cur = test;
    }
    if (cur) line(cur, size, f, color, gap, x);
  };
  const rule = (color = HAIRLINE) => {
    ensure(12);
    page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 0.7, color });
    y -= 12;
  };
  /** Section heading: a short gold accent bar beside a bold title.
   * `keepWith` is the vertical space the section's first few content items
   * need — if heading + that much content can't fit on this page, the whole
   * section moves to the next page so a heading is never orphaned at the
   * bottom. */
  const section = (title: string, keepWith = 60) => {
    ensure(32 + keepWith);
    y -= 8;
    page.drawRectangle({ x: M, y: y - 12, width: 3, height: 13, color: GOLD });
    draw(title, M + 10, 12.5, bold, GRAPHITE);
    y -= 24;
  };
  /** Small pill-style category chip drawn at the current row's y cursor. */
  const chip = (label: string, x: number, size: number) => {
    const padX = 5;
    const w = font.widthOfTextAtSize(label, size) + padX * 2;
    page.drawRectangle({ x, y: y - size - 3, width: w, height: size + 5, color: GOLD_SOFT, borderColor: GOLD, borderWidth: 0.5 });
    draw(label, x + padX, size, font, rgb(0.5, 0.38, 0.12));
  };

  /* ── Cover page ─────────────────────────────────────────────── */
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: NAVY });
  const hero = await loadHeroImage(doc);
  if (hero) {
    // Full-bleed hero band at the top, fitted to the page width so the whole
    // artwork (clock, figure, money) shows uncropped at its native aspect
    // ratio. All cover text starts BELOW the band, so the art stays clean and
    // the type never fights the image — only a whisper of navy on top to tie
    // it into the page.
    const heroH = W * (hero.height / hero.width);
    page.drawImage(hero, { x: 0, y: H - heroH, width: W, height: heroH });
    page.drawRectangle({ x: 0, y: H - heroH, width: W, height: heroH, color: NAVY, opacity: 0.12 });
    y = H - heroH - 34;
  } else {
    // Fallback if the hero asset fails to load — soft abstract glow, echoing
    // the app's own "Aurora" gradient-blur motif, so the cover never breaks.
    page.drawEllipse({ x: 120, y: H - 110, xScale: 190, yScale: 130, color: GOLD, opacity: 0.14 });
    page.drawEllipse({ x: W - 90, y: H - 60, xScale: 160, yScale: 120, color: EMERALD, opacity: 0.16 });
    y = H - 110;
  }
  line("MONEY LEAK DETECTOR  ·  AI FINANCIAL INTELLIGENCE REPORT", 9, bold, GOLD, 14);
  para("Where did your money go?", 30, bold, WHITE, 14, CONTENT_W);

  {
    const parts: string[] = [];
    if (r.accountName) parts.push(`Prepared for ${r.accountName}`);
    parts.push(fileName, r.monthLabels.join("-"), `currency: ${r.currency}`);
    draw(parts.join("  |  "), M, 10, font, QUIET_LIGHT);
    y -= 26;
  }

  {
    const stats: [string, string, ReturnType<typeof rgb>][] = [
      ["MONEY IN", money(r.totalIncome), EMERALD],
      ["MONEY OUT", money(r.totalSpend), RISK],
      ["KEPT", money(r.net), WHITE],
      ["SAVINGS RATE", `${r.savingsRate}%`, GOLD],
    ];
    const gap = 10;
    const cardW = (CONTENT_W - gap * 3) / 4;
    const cardH = 56;
    const yTop = y;
    for (let i = 0; i < stats.length; i++) {
      const [label, value, color] = stats[i];
      const x = M + i * (cardW + gap);
      page.drawRectangle({
        x, y: yTop - cardH, width: cardW, height: cardH,
        color: rgb(0.11, 0.125, 0.15), borderColor: HAIRLINE_DARK, borderWidth: 0.7,
      });
      drawAt(label, x + 10, yTop - 18, 6.5, bold, QUIET_LIGHT);
      drawAt(fit(value, bold, 15, cardW - 20), x + 10, yTop - 40, 15, bold, color);
    }
    y = yTop - cardH - 20;
  }

  draw(
    `Averages over ${r.months} month${r.months > 1 ? "s" : ""} - income ${money(r.avgMonthlyIncome)}/month, spending ${money(r.avgMonthlySpend)}/month.`,
    M, 9, font, QUIET_LIGHT
  );
  y -= 20;
  rule(HAIRLINE_DARK);
  draw(
    `${r.txnCount} transactions analyzed on-device on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} - nothing was uploaded.`,
    M, 9, font, QUIET_LIGHT
  );
  y -= 14;
  if (r.refundedTotal > 0) {
    line(
      `Money out includes ${money(r.refundedTotal)} that was later refunded - real spending ${money(r.totalSpend - r.refundedTotal)}.`,
      9, font, EMERALD, 5
    );
  }

  /* ── Derived views of the report data (presentation-layer only —
   * every number below is re-aggregated from r.transactions and fields
   * already computed by the analyzer; nothing new is measured or
   * invented) ─────────────────────────────────────────────────── */
  const spendTxns = r.transactions.filter((t) => t.amount < 0);
  const dShort = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  const dFull = (d: Date) => d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const pctSpend = (n: number) => Math.round((n / Math.max(r.totalSpend, 1)) * 100);
  const pctStr = (n: number, of: number) => {
    const p = (n / Math.max(of, 1)) * 100;
    return p >= 1 ? `${Math.round(p)}%` : `${p.toFixed(2)}%`;
  };
  const feesTotal = Math.round(r.fees.reduce((s, f) => s + f.amount, 0));
  const dupTotal = Math.round(r.duplicates.reduce((s, d) => s + d.amount, 0));

  interface MDetail {
    visits: number;
    total: number;
    first: Date;
    last: Date;
    amounts: Map<number, number>; // exact amount -> how many times it occurred
  }
  const mDetails = new Map<string, MDetail>();
  for (const t of spendTxns) {
    const amt = Math.round(Math.abs(t.amount) * 100) / 100;
    const d = mDetails.get(t.merchant);
    if (!d) {
      mDetails.set(t.merchant, { visits: 1, total: amt, first: t.date, last: t.date, amounts: new Map([[amt, 1]]) });
    } else {
      d.visits += 1;
      d.total += amt;
      if (t.date < d.first) d.first = t.date;
      if (t.date > d.last) d.last = t.date;
      d.amounts.set(amt, (d.amounts.get(amt) ?? 0) + 1);
    }
  }
  /** Exact-amount groups for a merchant, most frequent first — amounts are
   * only ever ×N-grouped when they are exactly equal. */
  const amountGroups = (d: MDetail) =>
    [...d.amounts.entries()]
      .map(([amount, count]) => ({ amount, count }))
      .sort((a, b) => b.count - a.count || b.amount - a.amount);

  /* ── Monthly cash flow — new page, white background ─────────── */
  newPage();

  section("Monthly cash flow - income vs spending", 90);
  {
    const series = r.monthlySpendSeries;
    const maxFlow = Math.max(...series.map((mo) => Math.max(mo.income, mo.spend)), 1);
    const barX = M + 30;
    const barW = CONTENT_W - 30 - 95;
    for (const mo of series) {
      ensure(48);
      const kept = mo.income - mo.spend;
      draw(mo.label, M, 9.5, bold);
      drawRight(
        kept >= 0 ? `kept ${money(kept)}` : `overspent ${money(-kept)}`,
        W - M, 9, bold, kept >= 0 ? EMERALD : RISK
      );
      y -= 14;
      draw("IN", M, 6.5, bold, QUIET);
      page.drawRectangle({ x: barX, y: y - 6, width: barW, height: 5, color: HAIRLINE });
      page.drawRectangle({ x: barX, y: y - 6, width: barW * Math.min(1, mo.income / maxFlow), height: 5, color: EMERALD });
      drawRight(money(mo.income), W - M, 7.5, font, EMERALD);
      y -= 11;
      draw("OUT", M, 6.5, bold, QUIET);
      page.drawRectangle({ x: barX, y: y - 6, width: barW, height: 5, color: HAIRLINE });
      page.drawRectangle({ x: barX, y: y - 6, width: barW * Math.min(1, mo.spend / maxFlow), height: 5, color: RISK });
      drawRight(money(mo.spend), W - M, 7.5, font, RISK);
      y -= 17;
    }
    if (series.length >= 2) {
      const top = [...series].sort((a, b) => b.spend - a.spend)[0];
      para(`${top.label} was your heaviest spending month at ${money(top.spend)}.`, 8.5, font, QUIET, 3);
      const first = series[0];
      const last = series[series.length - 1];
      if (first.spend > 0) {
        const chg = Math.round(((last.spend - first.spend) / first.spend) * 100);
        para(
          chg === 0
            ? `Spending was flat between ${first.label} and ${last.label}.`
            : `Spending ${chg > 0 ? "rose" : "fell"} ${Math.abs(chg)}% from ${first.label} to ${last.label}.`,
          8.5, font, QUIET, 6
        );
      }
    }
  }

  section("Where money came from", 85);
  {
    const maxIncome = Math.max(...r.incomeSources.map((s) => s.total), 1);
    for (const s of r.incomeSources) {
      ensure(26);
      draw(s.name, M, 9.5, font);
      drawRight(money(s.total), W - M, 9.5, bold, EMERALD);
      y -= 13;
      const trackH = 6;
      page.drawRectangle({ x: M, y: y - trackH, width: CONTENT_W, height: trackH, color: HAIRLINE });
      page.drawRectangle({
        x: M, y: y - trackH, width: CONTENT_W * Math.min(1, s.total / maxIncome), height: trackH, color: EMERALD,
      });
      y -= trackH + 10;
    }
  }

  section("Where money went - category analysis", 95);
  {
    const buckets: [string, number, ReturnType<typeof rgb>][] = [
      ["Lifestyle & choices", r.lifestyleTotal, GOLD],
      ["Routine & essential", r.routineTotal, BLUE],
      ["Unwanted & leaking", r.unwantedTotal, RISK],
    ];
    for (const [label, total, color] of buckets) {
      ensure(28);
      const pct = Math.round((total / Math.max(r.totalSpend, 1)) * 100);
      draw(label, M, 9.5, bold);
      draw(`${pct}% of spending`, M + bold.widthOfTextAtSize(label, 9.5) + 10, 9.5, font, QUIET);
      drawRight(money(total), W - M, 9.5, bold);
      y -= 13;
      const trackH = 6;
      page.drawRectangle({ x: M, y: y - trackH, width: CONTENT_W, height: trackH, color: HAIRLINE });
      page.drawRectangle({ x: M, y: y - trackH, width: CONTENT_W * Math.min(1, pct / 100), height: trackH, color });
      y -= trackH + 12;
    }

    // category cards, 3 per row — with avg per transaction and share of spend
    const cats = r.categories.slice(0, 10);
    const gap = 10;
    const cardW = (CONTENT_W - gap * 2) / 3;
    const cardH = 62;
    y -= 6;
    for (let i = 0; i < cats.length; i++) {
      const col = i % 3;
      if (col === 0) ensure(cardH + 10);
      const x = M + col * (cardW + gap);
      const yTop = y;
      page.drawRectangle({ x, y: yTop - cardH, width: cardW, height: cardH, color: PAPER, borderColor: HAIRLINE, borderWidth: 0.7 });
      drawAt(fit(cats[i].category, font, 7.5, cardW - 16), x + 8, yTop - 15, 7.5, font, QUIET);
      drawAt(fit(money(cats[i].total), bold, 11, cardW - 16), x + 8, yTop - 30, 11, bold, GRAPHITE);
      drawAt(fit(`${cats[i].count} txn${cats[i].count > 1 ? "s" : ""} · avg ${money(cats[i].total / cats[i].count)}`, font, 7, cardW - 16), x + 8, yTop - 43, 7, font, QUIET);
      drawAt(`${pctStr(cats[i].total, r.totalSpend)} of spending`, x + 8, yTop - 54, 7, bold, GOLD);
      if (col === 2 || i === cats.length - 1) y -= cardH + 10;
    }
    y -= 2;
    const top3 = r.categories.slice(0, 3);
    if (top3.length === 3) {
      para(
        `Your top 3 categories - ${top3.map((c) => c.category).join(", ")} - absorbed ${pctSpend(top3.reduce((s, c) => s + c.total, 0))}% of all spending.`,
        8.5, font, QUIET, 6
      );
    }
  }

  /* ── Biggest spending drivers ───────────────────────────────── */
  section("Biggest spending drivers", 75);
  {
    const colW = (CONTENT_W - 20) / 2;
    const leftX = M;
    const rightX = M + colW + 20;
    const topCats = r.categories.slice(0, 3);
    const topMerch = r.merchants.slice(0, 3);
    const rows = Math.max(topCats.length, topMerch.length);
    ensure(18 + rows * 15);
    draw("TOP CATEGORIES", leftX, 7, bold, QUIET);
    draw("TOP MERCHANTS", rightX, 7, bold, QUIET);
    y -= 14;
    for (let i = 0; i < rows; i++) {
      const c = topCats[i];
      const m = topMerch[i];
      if (c) {
        draw(fit(`${i + 1}. ${c.category}`, font, 8.5, colW - 110), leftX, 8.5, font, GRAPHITE);
        drawRight(`${money(c.total)} · ${pctStr(c.total, r.totalSpend)}`, leftX + colW, 8.5, bold, GRAPHITE);
      }
      if (m) {
        draw(fit(`${i + 1}. ${m.merchant}`, font, 8.5, colW - 110), rightX, 8.5, font, GRAPHITE);
        drawRight(`${money(m.total)} · ${pctStr(m.total, r.totalSpend)}`, rightX + colW, 8.5, bold, GRAPHITE);
      }
      y -= 15;
    }
    y -= 4;
  }

  /* ── Merchant intelligence — detailed blocks for the important
   * relationships. ×N grouping is ONLY applied to exactly-equal amounts;
   * different amounts to the same merchant are always listed separately. ── */
  section("Merchant intelligence - your important relationships", 95);
  {
    const repeat = r.merchants.filter((m) => m.count > 1).length;
    const top5Share = pctSpend(r.merchants.slice(0, 5).reduce((s, m) => s + m.total, 0));
    para(
      `You paid ${r.merchants.length} different merchants; ${repeat} of them more than once. Your top 5 relationships absorbed ${top5Share}% of all spending.`,
      8.5, font, QUIET, 10
    );

    const important = r.merchants.filter((m) => m.count >= 3 || m.total >= r.totalSpend * 0.05).slice(0, 12);
    const shown = important.length >= 3 ? important : r.merchants.slice(0, Math.min(5, r.merchants.length));

    for (const m of shown) {
      const det = mDetails.get(m.merchant);
      if (!det) continue;
      const groups = amountGroups(det);
      const amountsStr =
        groups.slice(0, 6).map((g) => `${money(g.amount)} ×${g.count}`).join("   ·   ") +
        (groups.length > 6 ? `   ·   +${groups.length - 6} more amounts` : "");

      // Rule-based observation — only states patterns actually present in
      // the data; empty when nothing noteworthy is true.
      let obs = "";
      const minA = Math.min(...groups.map((g) => g.amount));
      const maxA = Math.max(...groups.map((g) => g.amount));
      if (groups.length === 1 && det.visits >= 3)
        obs = `All ${det.visits} payments are the identical ${money(groups[0].amount)} - behaves like a fixed commitment.`;
      else if (m.total >= r.totalSpend * 0.1)
        obs = `This relationship alone absorbed ${pctSpend(m.total)}% of everything you spent.`;
      else if (det.visits >= 8)
        obs = `${det.visits} separate payments - one of your most frequent relationships.`;
      else if (groups.length >= 3 && minA > 0 && maxA / minA >= 5)
        obs = `Payment sizes range from ${money(minA)} to ${money(maxA)} - ad-hoc transfers rather than a fixed bill.`;
      else if (det.visits === 1 && m.total >= r.totalSpend * 0.05)
        obs = `A single payment that is ${pctSpend(m.total)}% of total spending on its own.`;

      const innerW = CONTENT_W - 24;
      const amtLines = wrapLines(amountsStr, bold, 8.5, innerW);
      const obsLines = obs ? wrapLines(`AI note: ${obs}`, font, 8.5, innerW) : 0;
      const blockH =
        12 + 15 + 14 +
        (amtLines * 8.5 + (amtLines - 1) * 3 + 6) +
        (obsLines > 0 ? obsLines * 8.5 + (obsLines - 1) * 3 + 6 : 0) + 6;
      ensure(blockH + 8);
      const yTop = y;
      page.drawRectangle({ x: M, y: yTop - blockH, width: CONTENT_W, height: blockH, color: PAPER, borderColor: HAIRLINE, borderWidth: 0.7 });
      y = yTop - 12;
      draw(fit(m.merchant, bold, 10.5, 300), M + 12, 10.5, bold, GRAPHITE);
      drawRight(money(m.total), W - M - 12, 10.5, bold, GRAPHITE);
      y -= 15;
      chip(fit(m.category, font, 7, 110), M + 12, 7);
      draw(
        `${det.visits} visit${det.visits > 1 ? "s" : ""}  ·  ${dFull(det.first)} -> ${dFull(det.last)}`,
        M + 140, 8, font, QUIET
      );
      y -= 14;
      para(amountsStr, 8.5, bold, GRAPHITE, 6, innerW, M + 12);
      if (obs) para(`AI note: ${obs}`, 8.5, font, rgb(0.5, 0.38, 0.12), 6, innerW, M + 12);
      y = yTop - blockH - 8;
    }
  }

  /* ── All merchants — complete table ─────────────────────────── */
  section("All merchants - complete list", 95);
  para(
    `Every one of the ${r.merchants.length} merchant${r.merchants.length === 1 ? "" : "s"} in the statement, ranked by total amount.`,
    8.5, font, QUIET, 8
  );

  const mCols = { rank: M, merchant: M + 22, cat: M + 175, visits: M + 302, first: M + 372, last: M + 440, total: W - M };
  const tableHeader = (cols: { x: number; label: string; right?: boolean }[]) => {
    ensure(20);
    page.drawRectangle({ x: M, y: y - 16, width: CONTENT_W, height: 16, color: GRAPHITE });
    for (const c of cols) {
      if (c.right) drawRight(c.label, c.x, 7, bold, WHITE);
      else draw(c.label, c.x, 7, bold, WHITE);
    }
    y -= 16;
  };
  const merchantHeader = () =>
    tableHeader([
      { x: mCols.rank, label: "#" },
      { x: mCols.merchant, label: "MERCHANT" },
      { x: mCols.cat, label: "CATEGORY" },
      { x: mCols.visits, label: "VISITS", right: true },
      { x: mCols.first, label: "FIRST", right: true },
      { x: mCols.last, label: "LAST", right: true },
      { x: mCols.total, label: "TOTAL", right: true },
    ]);
  merchantHeader();
  const maxMerchantTotal = Math.max(...r.merchants.map((m) => m.total), 1);
  r.merchants.forEach((m, i) => {
    if (y - 20 < M + 20) {
      newPage();
      merchantHeader();
    }
    const det = mDetails.get(m.merchant);
    const rowH = 18;
    if (i % 2 === 0) page.drawRectangle({ x: M, y: y - rowH, width: CONTENT_W, height: rowH, color: PAPER });
    draw(`${i + 1}`, mCols.rank, 8.5, font, QUIET);
    draw(fit(m.merchant, bold, 8.5, 140), mCols.merchant, 8.5, bold);
    chip(fit(m.category, font, 7, 100), mCols.cat, 7);
    drawRight(`${m.count}`, mCols.visits, 8.5, font, QUIET);
    if (det) {
      drawRight(dShort(det.first), mCols.first, 8, font, QUIET);
      drawRight(dShort(det.last), mCols.last, 8, font, QUIET);
    }
    drawRight(money(m.total), mCols.total, 8.5, bold);
    y -= 12;
    const barW = (CONTENT_W - 20) * Math.min(1, m.total / maxMerchantTotal);
    page.drawRectangle({ x: mCols.merchant, y: y - 2, width: barW, height: 2.5, color: GOLD, opacity: 0.6 });
    y -= rowH - 12;
  });

  /* ── Recurring / committed ──────────────────────────────────── */
  if (r.recurring.length > 0) {
    section("Recurring payment analysis", 75);
    const gap = 10;
    const cardW = (CONTENT_W - gap * 2) / 3;
    const cardH = 52;
    for (let i = 0; i < r.recurring.length; i++) {
      const col = i % 3;
      if (col === 0) ensure(cardH + 10);
      const rc = r.recurring[i];
      const x = M + col * (cardW + gap);
      const yTop = y;
      page.drawRectangle({ x, y: yTop - cardH, width: cardW, height: cardH, borderColor: HAIRLINE, borderWidth: 0.7 });
      drawAt(fit(rc.category, font, 7, cardW - 16), x + 8, yTop - 14, 7, font, QUIET);
      drawAt(fit(rc.merchant, bold, 9.5, cardW - 16), x + 8, yTop - 27, 9.5, bold, GRAPHITE);
      drawAt(`${money(rc.monthly)}/mo`, x + 8, yTop - 40, 10, bold, GOLD);
      drawAt(`-> ${money(rc.yearly)}/yr`, x + 8, yTop - 49, 7, font, QUIET);
      if (col === 2 || i === r.recurring.length - 1) y -= cardH + 10;
    }
    y -= 2;
    const recurringMonthly = r.recurring.reduce((s, c) => s + c.monthly, 0);
    if (r.avgMonthlyIncome > 0) {
      para(
        `These commitments total ${money(recurringMonthly)}/month - ${pctStr(recurringMonthly, r.avgMonthlyIncome)} of your average monthly income, spoken for before you spend a single ${r.currency} by choice.`,
        8.5, font, QUIET, 6
      );
    }
    y -= 4;
  }

  /* ── Subscription analysis ──────────────────────────────────── */
  {
    const subsRec = r.recurring.filter((c) => c.category === "Subscriptions" || c.category === "Gym & Memberships");
    const subCat = r.categories.find((c) => c.category === "Subscriptions");
    if (subsRec.length > 0 || subCat) {
      section("Subscription analysis", 70);
      if (subsRec.length > 0) {
        const mo = subsRec.reduce((s, c) => s + c.monthly, 0);
        para(
          `${subsRec.length} confirmed recurring subscription${subsRec.length > 1 ? "s" : ""}: ${money(mo)}/month -> ${money(mo * 12)}/year if nothing changes.`,
          9, font, GRAPHITE, 8
        );
        for (const s of subsRec) {
          ensure(16);
          draw(fit(s.merchant, bold, 9, 240), M, 9, bold);
          drawRight(`${money(s.monthly)}/mo  ->  ${money(s.yearly)}/yr`, W - M, 8.5, font, QUIET);
          y -= 14;
        }
        y -= 4;
      }
      if (subCat) {
        para(
          `Total subscription-category spending this statement: ${money(subCat.total)} across ${subCat.count} payment${subCat.count > 1 ? "s" : ""} (${pctStr(subCat.total, r.totalSpend)} of all spending).`,
          8.5, font, QUIET, 6
        );
      }
    }
  }

  /* ── Duplicate payment analysis ─────────────────────────────── */
  if (r.duplicates.length > 0) {
    section("Duplicate payment analysis", 85);
    para(
      `${r.duplicates.length} pair${r.duplicates.length > 1 ? "s" : ""} of identical charges hit the same merchant within days - ${money(dupTotal)} in total. These are usually billing errors, and usually refundable: contact the merchant with the two dates shown.`,
      8.5, font, QUIET, 8
    );
    for (const d of r.duplicates) {
      ensure(20);
      draw(fit(d.merchant, bold, 9.5, 240), M, 9.5, bold);
      draw(
        `charged twice: ${d.dates[0].toLocaleDateString("en-GB")} & ${d.dates[1].toLocaleDateString("en-GB")}`,
        M + 250, 8.5, font, QUIET
      );
      drawRight(`-${money(d.amount)}`, W - M, 9.5, bold, RISK);
      y -= 12;
      rule();
    }
  }

  /* ── Bank fee analysis ──────────────────────────────────────── */
  if (r.fees.length > 0) {
    section("Bank fee analysis", 85);
    para(
      `${r.fees.length} fee charge${r.fees.length > 1 ? "s" : ""} cost you ${money(feesTotal)} this statement - about ${money(feesTotal / r.months)}/month, ${pctStr(feesTotal, r.totalSpend)} of all spending. Money that bought you nothing.`,
      8.5, font, QUIET, 8
    );
    for (const f of r.fees.slice(0, 15)) {
      ensure(18);
      draw(fit(f.desc, font, 9, 330), M, 9, font);
      draw(f.date.toLocaleDateString("en-GB"), M + 340, 8.5, font, QUIET);
      drawRight(`-${money(f.amount)}`, W - M, 9, font, RISK);
      y -= 10;
      rule();
    }
    if (r.fees.length > 15) line(`...and ${r.fees.length - 15} more fee entries.`, 8.5, font, QUIET, 6);
  }

  /* ── Cash flow behaviour ────────────────────────────────────── */
  if (spendTxns.length > 0) {
    section("Cash flow behaviour", 90);
    const allDates = r.transactions.map((t) => t.date.getTime());
    const spanDays = Math.max(1, Math.round((Math.max(...allDates) - Math.min(...allDates)) / 86_400_000) + 1);
    const byDay = new Map<string, number>();
    let weekend = 0;
    for (const t of spendTxns) {
      const k = t.date.toDateString();
      byDay.set(k, (byDay.get(k) ?? 0) + Math.abs(t.amount));
      if (t.date.getDay() === 0 || t.date.getDay() === 6) weekend += Math.abs(t.amount);
    }
    const [bigDayKey, bigDayAmt] = [...byDay.entries()].sort((a, b) => b[1] - a[1])[0];
    const largest = spendTxns.reduce((a, b) => (Math.abs(b.amount) > Math.abs(a.amount) ? b : a));
    const stats: [string, string][] = [
      ["Average daily spend", `${money(r.totalSpend / spanDays)} across the ${spanDays}-day statement window`],
      ["Days with spending", `${byDay.size} of ${spanDays} days (${Math.round((byDay.size / spanDays) * 100)}%)`],
      ["Weekend share", `${pctSpend(weekend)}% of spending happened on weekends`],
      ["Heaviest day", `${dFull(new Date(bigDayKey))} - ${money(bigDayAmt)} went out`],
      ["Largest single payment", `${money(Math.abs(largest.amount))} to ${largest.merchant} on ${dShort(largest.date)}`],
    ];
    for (const [label, value] of stats) {
      ensure(16);
      draw(label, M, 9, bold, GRAPHITE);
      draw(fit(value, font, 9, CONTENT_W - 155), M + 150, 9, font, QUIET);
      y -= 15;
    }
    y -= 4;
  }

  /* ── Financial health score — a transparent formula over the same
   * numbers shown above; every component's input is stated next to it ── */
  section("Financial health score", 110);
  {
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const feePct = (feesTotal / Math.max(r.totalSpend, 1)) * 100;
    const dupPct = (dupTotal / Math.max(r.totalSpend, 1)) * 100;
    const recurringMonthly = r.recurring.reduce((s, c) => s + c.monthly, 0);
    const commitPct = r.avgMonthlyIncome > 0 ? (recurringMonthly / r.avgMonthlyIncome) * 100 : 0;
    const leakPct = (r.unwantedTotal / Math.max(r.totalSpend, 1)) * 100;
    const comps: { name: string; why: string; pts: number; max: number }[] = [
      { name: "Savings rate", why: `you keep ${r.savingsRate}% of what you earn`, pts: clamp(r.savingsRate * 2, 0, 40), max: 40 },
      { name: "Fee discipline", why: feesTotal > 0 ? `${money(feesTotal)} lost to bank fees` : "zero bank fees paid", pts: clamp(15 - (feePct / 2) * 15, 0, 15), max: 15 },
      { name: "Duplicate control", why: r.duplicates.length > 0 ? `${r.duplicates.length} duplicate pair${r.duplicates.length > 1 ? "s" : ""} worth ${money(dupTotal)}` : "no duplicate charges found", pts: clamp(15 - (dupPct / 2) * 15, 0, 15), max: 15 },
      { name: "Commitment load", why: recurringMonthly > 0 ? `recurring bills take ${pctStr(recurringMonthly, Math.max(r.avgMonthlyIncome, 1))} of monthly income` : "no fixed commitments detected", pts: commitPct <= 10 ? 15 : clamp(15 - ((commitPct - 10) / 30) * 15, 0, 15), max: 15 },
      { name: "Leak control", why: `${pctStr(r.unwantedTotal, r.totalSpend)} of spending was unwanted or avoidable`, pts: leakPct <= 5 ? 15 : clamp(15 - ((leakPct - 5) / 20) * 15, 0, 15), max: 15 },
    ];
    const score = Math.round(comps.reduce((s, c) => s + c.pts, 0));
    const verdict = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Stable" : "Needs attention";
    ensure(60);
    const yTop = y;
    page.drawRectangle({ x: M, y: yTop - 48, width: CONTENT_W, height: 48, color: NAVY });
    drawAt(`${score} / 100`, M + 14, yTop - 30, 22, bold, GOLD);
    drawAt(verdict.toUpperCase(), M + 14, yTop - 42, 8, bold, QUIET_LIGHT);
    drawAt("Scored on savings, fees, duplicates, commitments and leaks -", M + 160, yTop - 22, 8, font, QUIET_LIGHT);
    drawAt("every point traces to a number in this statement.", M + 160, yTop - 33, 8, font, QUIET_LIGHT);
    y = yTop - 48 - 12;
    for (const c of comps) {
      ensure(20);
      draw(c.name, M, 9, bold, GRAPHITE);
      draw(fit(c.why, font, 8.5, 245), M + 118, 8.5, font, QUIET);
      drawRight(`${Math.round(c.pts)}/${c.max}`, W - M - 60, 8.5, bold, GRAPHITE);
      const trackX = W - M - 52;
      const frac = c.pts / c.max;
      page.drawRectangle({ x: trackX, y: y - 8, width: 52, height: 5, color: HAIRLINE });
      page.drawRectangle({ x: trackX, y: y - 8, width: 52 * frac, height: 5, color: frac >= 0.66 ? EMERALD : frac >= 0.33 ? GOLD : RISK });
      y -= 18;
    }
    y -= 4;
  }

  /* ── Positive financial habits — only habits actually visible in the
   * data are listed; the section is skipped entirely if none apply ── */
  {
    const dining = r.categories.find((c) => c.category === "Dining & Delivery");
    const subsMonthly = r.recurring
      .filter((c) => c.category === "Subscriptions" || c.category === "Gym & Memberships")
      .reduce((s, c) => s + c.monthly, 0);
    const habits: string[] = [];
    if (r.savingsRate >= 20) habits.push(`You keep ${r.savingsRate}% of your income - at or above the classic 20% guideline.`);
    else if (r.net > 0) habits.push(`You finished the period in the green - ${money(r.net)} of your income stayed with you.`);
    if (feesTotal === 0) habits.push("Zero bank fees in the entire statement - your banking costs you nothing.");
    if (r.duplicates.length === 0) habits.push("No duplicate charges found - every merchant billed you cleanly.");
    if (dining && dining.total <= r.totalSpend * 0.05) habits.push(`Dining & delivery is just ${pctStr(dining.total, r.totalSpend)} of your spending (${money(dining.total)}) - well under control.`);
    if (r.refundedTotal > 0) habits.push(`You recovered ${money(r.refundedTotal)} in refunds - money that found its way back.`);
    if (subsMonthly > 0 && r.avgMonthlyIncome > 0 && subsMonthly <= r.avgMonthlyIncome * 0.02) habits.push(`Subscriptions cost you only ${money(subsMonthly)}/month - a very light footprint for your income.`);
    if (habits.length > 0) {
      section("Positive financial habits", 70);
      para("Not everything is a leak - these habits, visible in your own numbers, are worth keeping.", 8.5, font, QUIET, 8);
      for (const h of habits.slice(0, 5)) {
        ensure(16);
        page.drawCircle({ x: M + 3, y: y - 6, size: 2.5, color: EMERALD });
        para(h, 9, font, GRAPHITE, 6, CONTENT_W - 14, M + 12);
      }
      y -= 4;
    }
  }

  /* ── Money leak opportunities ───────────────────────────────── */
  {
    const leaks: { name: string; amount: number; note: string }[] = [];
    if (dupTotal > 0) leaks.push({ name: "Duplicate charges", amount: dupTotal, note: "refundable - see the pairs listed above" });
    if (feesTotal > 0) leaks.push({ name: "Bank fees", amount: feesTotal, note: "avoidable with autopay and the right card" });
    if (r.unwantedTotal > 0) leaks.push({ name: "Unwanted & leaking spending", amount: r.unwantedTotal, note: "the bucket flagged unwanted in the category analysis" });
    if (leaks.length > 0) {
      section("Money leak opportunities", 80);
      para(
        `DONRITHIK AI identified about ${money(r.potentialMonthlySaving)}/month of recoverable leaks in this statement - here is where they live.`,
        8.5, font, QUIET, 8
      );
      const maxLeak = Math.max(...leaks.map((l) => l.amount), 1);
      for (const l of leaks.sort((a, b) => b.amount - a.amount)) {
        ensure(26);
        draw(l.name, M, 9.5, bold, GRAPHITE);
        draw(fit(l.note, font, 8, 215), M + 200, 8, font, QUIET);
        drawRight(money(l.amount), W - M, 9.5, bold, RISK);
        y -= 13;
        page.drawRectangle({ x: M, y: y - 5, width: CONTENT_W, height: 4, color: HAIRLINE });
        page.drawRectangle({ x: M, y: y - 5, width: CONTENT_W * Math.min(1, l.amount / maxLeak), height: 4, color: RISK, opacity: 0.75 });
        y -= 15;
      }
    }
  }

  /* ── Advice / savings plan ────────────────────────────────────── */
  section("Your savings plan - personalized AI recommendations", 95);
  {
    const summaryText = `Follow this plan and you keep about ${money(r.potentialMonthlySaving)} more every month - roughly ${money(r.potentialMonthlySaving * 12)} per year, with no lifestyle change.`;
    const innerW = CONTENT_W - 24;
    const lines = wrapLines(summaryText, bold, 9.5, innerW);
    const lineH = 9.5 + 4;
    const boxH = lines * lineH + 24;
    ensure(boxH + 10);
    const yTop = y;
    page.drawRectangle({ x: M, y: yTop - boxH, width: CONTENT_W, height: boxH, color: NAVY });
    y = yTop - 16;
    para(summaryText, 9.5, bold, WHITE, 4, innerW, M + 12);
    y = yTop - boxH - 16;
  }
  r.advice.forEach((a, i) => {
    ensure(34);
    const badgeSize = 16;
    const badgeLabel = `${i + 1}`;
    page.drawCircle({ x: M + badgeSize / 2, y: y - badgeSize / 2 - 1, size: badgeSize / 2, color: NAVY });
    drawAt(
      badgeLabel,
      M + (badgeSize - bold.widthOfTextAtSize(badgeLabel, 8.5)) / 2,
      y - badgeSize / 2 + 3, 8.5, bold, WHITE
    );
    const titleX = M + badgeSize + 8;
    draw(a.title, titleX, 10, bold, GRAPHITE);
    if (a.monthlySaving > 0) {
      const titleW = bold.widthOfTextAtSize(clean(a.title), 10);
      drawAt(`  (+${money(a.monthlySaving)}/mo)`, titleX + titleW, y - 10, 9.5, bold, EMERALD);
    }
    y -= 15;
    para(a.detail, 9, font, QUIET, 10, CONTENT_W - badgeSize - 8, titleX);
  });

  /* ── Future savings projection — plain arithmetic on the plan above,
   * clearly labeled a projection, never a promise ─────────────── */
  if (r.potentialMonthlySaving > 0) {
    section("Future savings projection", 90);
    para(
      "A projection, not a promise: if you apply the plan above and nothing else changes, the leaks already found in this statement add up like this.",
      8.5, font, QUIET, 10
    );
    const maxProj = r.potentialMonthlySaving * 12;
    for (const h of [3, 6, 12]) {
      ensure(26);
      const v = r.potentialMonthlySaving * h;
      draw(`In ${h} months`, M, 9.5, bold, GRAPHITE);
      drawRight(`+${money(v)}`, W - M, 9.5, bold, EMERALD);
      y -= 13;
      page.drawRectangle({ x: M, y: y - 5, width: CONTENT_W, height: 5, color: HAIRLINE });
      page.drawRectangle({ x: M, y: y - 5, width: CONTENT_W * (v / maxProj), height: 5, color: EMERALD });
      y -= 15;
    }
    if (r.avgMonthlyIncome > 0) {
      const projRate = Math.round(((r.avgMonthlyIncome - (r.avgMonthlySpend - r.potentialMonthlySaving)) / r.avgMonthlyIncome) * 100);
      para(
        `Your savings rate would move from ${r.savingsRate}% to roughly ${projRate}% - computed only from the leaks itemized above.`,
        8.5, font, QUIET, 6
      );
    }
  }

  /* ── Friend to friend — always its own final page ───────────── */
  newPage();
  {
    const intro = "Not a bank talking. Just your AI, being honest with you.";
    const innerW = CONTENT_W - 40;
    const paraHeight = (s: string, f: PDFFont, size: number, gap: number) => {
      const lines = wrapLines(s, f, size, innerW);
      return lines * size + (lines - 1) * 3 + gap;
    };
    // Measure the whole letter before drawing anything, so the card can be
    // sized to fit it exactly. `friendNotes` is AI-generated and its length
    // varies per statement, so this can't be a fixed guess — if it turns out
    // too tall for one page even with the box removed, that's the fallback
    // below: same content, no enclosing card, using the document's normal
    // multi-page flow so nothing is ever cut off regardless of length.
    const topPad = 26;
    const badgeSpace = 26;
    const headingSpace = 24;
    const bottomPad = 22;
    const contentHeight =
      topPad + badgeSpace + headingSpace + paraHeight(intro, font, 9, 12) +
      r.friendNotes.reduce((s, note) => s + paraHeight(note, font, 10, 12), 0) + bottomPad;

    // 24pt at the bottom of this final page is reserved for the closing
    // "all N transactions analyzed" note drawn after the letter.
    const noteReserve = 24;

    // Same hero artwork as the cover, as a banner above the AI's note — the
    // report's consistent branding. Drawn only when the letter still fits on
    // this page below it; skipped otherwise so pagination never changes.
    if (hero) {
      const bannerH = CONTENT_W * (hero.height / hero.width);
      if (contentHeight + bannerH + 18 <= y - M - noteReserve) {
        page.drawImage(hero, { x: M, y: y - bannerH, width: CONTENT_W, height: bannerH });
        y -= bannerH + 18;
      }
    }

    const boxTop = y;
    const fitsAsCard = contentHeight <= boxTop - M - noteReserve;

    if (fitsAsCard) {
      page.drawRectangle({
        x: M, y: boxTop - contentHeight, width: CONTENT_W, height: contentHeight,
        color: GOLD_SOFT, borderColor: GOLD, borderWidth: 0.8,
      });
      y = boxTop - topPad;
    } else {
      // Fallback for an unusually long letter: no card, just the section
      // accent bar, and normal pagination takes over from here.
      page.drawRectangle({ x: M, y: y - 12, width: 3, height: 13, color: GOLD });
      y -= 4;
    }

    const badgeX = fitsAsCard ? M + 20 : M + 10;
    const textW = CONTENT_W - (badgeX - M) * 2;
    {
      const label = "A NOTE FROM YOUR DONRITHIK AI";
      const padX = 8;
      const w = bold.widthOfTextAtSize(label, 7.5) + padX * 2;
      page.drawRectangle({ x: badgeX, y: y - 14, width: w, height: 16, color: GOLD });
      drawAt(label, badgeX + padX, y - 10, 7.5, bold, WHITE);
      y -= 26;
    }
    draw("Friend to Friend", badgeX, 18, bold, rgb(0.5, 0.38, 0.12));
    y -= 24;
    para(intro, 9, font, QUIET, 12, textW, badgeX);
    for (const note of r.friendNotes) {
      para(note, 10, font, GRAPHITE, 12, textW, badgeX);
    }

    // Closing note — the report's last line, replacing the old full
    // transaction ledger (the merchant activity summary carries the same
    // insight). On the normal single-page card it sits anchored just above
    // the footer, in the space reserved via `noteReserve`; on the rare
    // multi-page fallback it simply flows after the letter.
    const closing = `All ${r.txnCount} transactions were analyzed by DONRITHIK AI. The complete transaction history is available inside the app.`;
    const closingSize = font.widthOfTextAtSize(clean(closing), 9) <= CONTENT_W ? 9 : 8;
    const closingW = font.widthOfTextAtSize(clean(closing), closingSize);
    const closingX = M + Math.max(0, (CONTENT_W - closingW) / 2);
    if (fitsAsCard) {
      drawAt(closing, closingX, 42, closingSize, font, QUIET);
    } else {
      ensure(24);
      y -= 8;
      draw(closing, closingX, closingSize, font, QUIET);
      y -= 14;
    }
  }

  /* ── Footer on every page (dark cover gets a lighter footer color) ── */
  const pages = doc.getPages();
  const namePrefix = r.accountName ? `${clean(r.accountName)}  ·  ` : "";
  pages.forEach((p, i) => {
    p.drawText(
      `${namePrefix}Money Leak Detector by DONRITHIK LABS  ·  not financial advice  ·  page ${i + 1} of ${pages.length}`,
      { x: M, y: 26, size: 7.5, font, color: i === 0 ? QUIET_LIGHT : QUIET }
    );
  });

  return doc.save();
}
