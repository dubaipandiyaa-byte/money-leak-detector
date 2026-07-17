/**
 * Client-side PDF export of the money report, built with pdf-lib.
 * A4, branded, fully self-contained — generated in the browser so the
 * statement data never leaves the device.
 */
import { PDFDocument, PDFFont, StandardFonts, rgb } from "pdf-lib";
import type { Report } from "./analyzer";

const GRAPHITE = rgb(0.08, 0.095, 0.11);
const QUIET = rgb(0.47, 0.51, 0.55);
const EMERALD = rgb(0.02, 0.59, 0.41);
const RISK = rgb(0.94, 0.4, 0.25);
const HAIRLINE = rgb(0.89, 0.91, 0.92);

const W = 595.28; // A4 portrait, points
const H = 841.89;
const M = 48;

/** Helvetica (WinAnsi) can't encode every glyph — strip what it can't. */
function clean(s: string): string {
  return s.replace(/—/g, "-").replace(/’/g, "'").replace(/[^\x20-\x7E\xA0-\xFF]/g, "").trim();
}

export async function generateReportPdf(r: Report, fileName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle("Money Report - Money Leak Detector");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page = doc.addPage([W, H]);
  let y = H - M;

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
    while (out.length > 1 && f.widthOfTextAtSize(`${out}…`.replace("…", "..."), size) > maxW) {
      out = out.slice(0, -1);
    }
    return `${out}...`;
  };
  const draw = (s: string, x: number, size: number, f: PDFFont, color = GRAPHITE) => {
    page.drawText(clean(s), { x, y: y - size, size, font: f, color });
  };
  const drawRight = (s: string, xRight: number, size: number, f: PDFFont, color = GRAPHITE) => {
    const t = clean(s);
    page.drawText(t, { x: xRight - f.widthOfTextAtSize(t, size), y: y - size, size, font: f, color });
  };
  const line = (s: string, size = 10, f: PDFFont = font, color = GRAPHITE, gap = 5) => {
    ensure(size + gap);
    draw(s, M, size, f, color);
    y -= size + gap;
  };
  /** Word-wrapped paragraph. */
  const para = (s: string, size = 9.5, f: PDFFont = font, color = QUIET, gap = 4) => {
    const words = clean(s).split(" ");
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) > W - M * 2) {
        line(cur, size, f, color, 3);
        cur = w;
      } else cur = test;
    }
    if (cur) line(cur, size, f, color, gap);
  };
  const rule = () => {
    ensure(12);
    page.drawLine({
      start: { x: M, y: y - 4 },
      end: { x: W - M, y: y - 4 },
      thickness: 0.7,
      color: HAIRLINE,
    });
    y -= 12;
  };
  const section = (title: string) => {
    ensure(34);
    y -= 10;
    line(title.toUpperCase(), 9, bold, EMERALD, 7);
  };

  /* ── Header ─────────────────────────────────────────────────── */
  line("MONEY LEAK DETECTOR  ·  DONRITHIK AI", 24, bold, EMERALD, 8);
  if (r.accountName) line(`Prepared for ${r.accountName}`, 11, bold, GRAPHITE, 5);
  line(`${fileName}  ·  ${r.monthLabels.join(" - ")}  ·  currency: ${r.currency}`, 9.5, font, QUIET, 4);
  line(
    `${r.txnCount} transactions analyzed on-device on ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} - nothing was uploaded.`,
    9.5, font, QUIET, 6
  );
  rule();

  /* ── Summary ────────────────────────────────────────────────── */
  section("Summary");
  line(
    `Money in ${money(r.totalIncome)}     Money out ${money(r.totalSpend)}     Kept ${money(r.net)}     Savings rate ${r.savingsRate}%`,
    11.5, bold, GRAPHITE, 6
  );
  if (r.refundedTotal > 0) {
    line(
      `Money out includes ${money(r.refundedTotal)} that was later refunded - real spending ${money(r.totalSpend - r.refundedTotal)}.`,
      9.5, font, EMERALD, 5
    );
  }
  line(
    `Averages over ${r.months} month${r.months > 1 ? "s" : ""}: income ${money(r.avgMonthlyIncome)}/month, spending ${money(r.avgMonthlySpend)}/month.`,
    9.5, font, QUIET, 4
  );

  /* ── Income ─────────────────────────────────────────────────── */
  section("Where money came from");
  for (const s of r.incomeSources) {
    ensure(16);
    draw(s.name, M, 10, font);
    drawRight(money(s.total), W - M, 10, bold, EMERALD);
    y -= 16;
  }

  /* ── Buckets ────────────────────────────────────────────────── */
  section("Where money went");
  const buckets: [string, number][] = [
    ["Routine & essential", r.routineTotal],
    ["Lifestyle & choices", r.lifestyleTotal],
    ["Unwanted & leaking", r.unwantedTotal],
  ];
  for (const [label, total] of buckets) {
    ensure(16);
    draw(label, M, 10, bold);
    draw(`${Math.round((total / Math.max(r.totalSpend, 1)) * 100)}% of spending`, M + 170, 10, font, QUIET);
    drawRight(money(total), W - M, 10, bold);
    y -= 16;
  }
  y -= 2;
  for (const c of r.categories.slice(0, 10)) {
    ensure(14);
    draw(`- ${c.category}`, M + 10, 9, font, QUIET);
    draw(`${c.count} txn${c.count > 1 ? "s" : ""}`, M + 220, 9, font, QUIET);
    drawRight(money(c.total), W - M, 9, font);
    y -= 14;
  }

  /* ── Merchants ──────────────────────────────────────────────── */
  section("Merchant breakdown - every merchant, ranked");
  const mCols = { merchant: M, cat: M + 190, visits: M + 330, avg: W - M - 90, total: W - M };
  ensure(15);
  draw("MERCHANT", mCols.merchant, 8, bold, QUIET);
  draw("CATEGORY", mCols.cat, 8, bold, QUIET);
  drawRight("VISITS", mCols.visits, 8, bold, QUIET);
  drawRight("AVG", mCols.avg, 8, bold, QUIET);
  drawRight("TOTAL", mCols.total, 8, bold, QUIET);
  y -= 14;
  for (const m of r.merchants) {
    ensure(14);
    draw(fit(m.merchant, font, 9, 180), mCols.merchant, 9, font);
    draw(fit(m.category, font, 9, 130), mCols.cat, 9, font, QUIET);
    drawRight(`${m.count}x`, mCols.visits, 9, font, QUIET);
    drawRight(money(m.total / m.count), mCols.avg, 9, font, QUIET);
    drawRight(money(m.total), mCols.total, 9, bold);
    y -= 14;
  }

  /* ── Recurring / committed ──────────────────────────────────── */
  if (r.recurring.length > 0) {
    section("Recurring & committed monthly costs");
    for (const rc of r.recurring) {
      ensure(15);
      draw(fit(`${rc.merchant}  (${rc.category})`, font, 9.5, 300), M, 9.5, font);
      drawRight(`${money(rc.monthly)}/mo   ->   ${money(rc.yearly)}/yr`, W - M, 9.5, bold);
      y -= 15;
    }
  }

  /* ── Duplicates & fees ──────────────────────────────────────── */
  if (r.duplicates.length > 0 || r.fees.length > 0) {
    section("Duplicates & fees - money you got nothing for");
    for (const d of r.duplicates) {
      ensure(15);
      draw(
        `${fit(d.merchant, font, 9.5, 300)} charged twice (${d.dates[0].toLocaleDateString("en-GB")} & ${d.dates[1].toLocaleDateString("en-GB")}) - refundable`,
        M, 9.5, font
      );
      drawRight(`-${money(d.amount)}`, W - M, 9.5, bold, RISK);
      y -= 15;
    }
    for (const f of r.fees.slice(0, 15)) {
      ensure(14);
      draw(fit(f.desc, font, 9, 340), M, 9, font, QUIET);
      draw(f.date.toLocaleDateString("en-GB"), M + 350, 9, font, QUIET);
      drawRight(`-${money(f.amount)}`, W - M, 9, font, RISK);
      y -= 14;
    }
    if (r.fees.length > 15) line(`...and ${r.fees.length - 15} more fee entries.`, 9, font, QUIET);
  }

  /* ── Advice ─────────────────────────────────────────────────── */
  section("Your savings plan");
  para(
    `Follow this plan and you keep about ${money(r.potentialMonthlySaving)} more every month - roughly ${money(r.potentialMonthlySaving * 12)} per year, with no lifestyle change.`,
    10.5, bold, GRAPHITE, 8
  );
  r.advice.forEach((a, i) => {
    ensure(30);
    const chip = a.monthlySaving > 0 ? `  (+${money(a.monthlySaving)}/mo)` : "";
    line(`${i + 1}. ${a.title}${chip}`, 10.5, bold, GRAPHITE, 4);
    para(a.detail, 9.5, font, QUIET, 8);
  });

  /* ── Ledger ─────────────────────────────────────────────────── */
  section(`Complete transaction ledger - all ${r.txnCount} transactions`);
  const lCols = { date: M, merchant: M + 55, cat: M + 265, amount: W - M };
  const ledgerHeader = () => {
    ensure(14);
    draw("DATE", lCols.date, 7.5, bold, QUIET);
    draw("MERCHANT", lCols.merchant, 7.5, bold, QUIET);
    draw("CATEGORY", lCols.cat, 7.5, bold, QUIET);
    drawRight("AMOUNT", lCols.amount, 7.5, bold, QUIET);
    y -= 13;
  };
  ledgerHeader();
  for (const t of r.transactions) {
    if (y - 13 < M + 20) {
      newPage();
      ledgerHeader();
    }
    draw(t.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), lCols.date, 8.5, font, QUIET);
    draw(fit(t.merchant, font, 8.5, 200), lCols.merchant, 8.5, font);
    draw(fit(t.category, font, 8.5, 140), lCols.cat, 8.5, font, QUIET);
    drawRight(
      `${t.amount > 0 ? "+" : "-"}${money(Math.abs(t.amount))}`,
      lCols.amount, 8.5, t.amount > 0 ? bold : font, t.amount > 0 ? EMERALD : GRAPHITE
    );
    y -= 13;
  }

  /* ── Friend to friend — always its own final page ───────────── */
  newPage();
  line("FRIEND TO FRIEND", 9, bold, EMERALD, 7);
  line(`A note from your DONRITHIK AI${r.accountName ? ` for ${r.accountName.split(" ")[0]}` : ""}`, 18, bold, GRAPHITE, 6);
  line("Not a bank talking. Just your AI, being honest with you.", 9.5, font, QUIET, 10);
  rule();
  y -= 4;
  for (const note of r.friendNotes) {
    para(note, 10.5, font, GRAPHITE, 12);
  }

  /* ── Footer on every page ───────────────────────────────────── */
  const pages = doc.getPages();
  const namePrefix = r.accountName ? `${clean(r.accountName)}  ·  ` : "";
  pages.forEach((p, i) => {
    p.drawText(
      `${namePrefix}Money Leak Detector by DONRITHIK LABS  ·  not financial advice  ·  page ${i + 1} of ${pages.length}`,
      { x: M, y: 26, size: 7.5, font, color: QUIET }
    );
  });

  return doc.save();
}
