/**
 * DONRITHIK AI statement analyzer.
 *
 * Parses a CSV bank statement, categorizes every transaction, separates
 * routine / lifestyle / unwanted spending, detects recurring charges,
 * duplicates and fees, and generates personalized savings advice.
 * Everything runs client-side — the statement never leaves the browser.
 */

export interface Txn {
  date: Date;
  desc: string;
  merchant: string;
  amount: number; // positive = money in, negative = money out
  category: string;
  kind: TxnKind;
}

export type TxnKind = "income" | "routine" | "lifestyle" | "unwanted";

export interface RecurringCharge {
  merchant: string;
  category: string;
  monthly: number;
  count: number;
  total: number;
  yearly: number;
}

export interface DuplicatePair {
  merchant: string;
  amount: number;
  dates: [Date, Date];
}

export interface Advice {
  title: string;
  detail: string;
  monthlySaving: number;
}

export interface Report {
  currency: string;
  months: number;
  monthLabels: string[];
  totalIncome: number;
  totalSpend: number;
  net: number;
  savingsRate: number;
  avgMonthlyIncome: number;
  avgMonthlySpend: number;
  incomeSources: { name: string; total: number }[];
  categories: { category: string; kind: TxnKind; total: number; count: number }[];
  routineTotal: number;
  lifestyleTotal: number;
  unwantedTotal: number;
  monthlySpendSeries: { label: string; spend: number; income: number }[];
  recurring: RecurringCharge[];
  duplicates: DuplicatePair[];
  fees: { desc: string; amount: number; date: Date }[];
  advice: Advice[];
  potentialMonthlySaving: number;
  txnCount: number;
}

/* ── Currency detection ───────────────────────────────────────── */

/** ISO 4217 codes the detector looks for, most-specific symbols first. */
export const WORLD_CURRENCIES: { code: string; symbol: string; name: string }[] = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "Mex$", name: "Mexican Peso" },
  { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  { code: "COP", symbol: "CO$", name: "Colombian Peso" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
];

const UNIQUE_SYMBOLS: Record<string, string> = {
  "€": "EUR",
  "£": "GBP",
  "₹": "INR",
  "₩": "KRW",
  "฿": "THB",
  "₫": "VND",
  "₱": "PHP",
  "₺": "TRY",
  "₪": "ILS",
  "₦": "NGN",
  "₵": "GHS",
  "₽": "RUB",
  "₴": "UAH",
  "৳": "BDT",
};

/**
 * Detect the statement's currency: explicit ISO codes win (most frequent),
 * then unambiguous symbols, then $ → USD. Falls back to AED.
 */
export function detectCurrency(text: string): string {
  const counts = new Map<string, number>();
  for (const c of WORLD_CURRENCIES) {
    const m = text.match(new RegExp(`\\b${c.code}\\b`, "g"));
    if (m) counts.set(c.code, m.length);
  }
  if (counts.size > 0) {
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }
  for (const [sym, code] of Object.entries(UNIQUE_SYMBOLS)) {
    if (text.includes(sym)) return code;
  }
  if (text.includes("$")) return "USD";
  return "AED";
}

/* ── Categorization rules ─────────────────────────────────────── */

const RULES: { category: string; kind: TxnKind; pattern: RegExp }[] = [
  // income
  { category: "Salary", kind: "income", pattern: /salary|payroll|wages/i },
  { category: "Freelance & Side Income", kind: "income", pattern: /freelance|invoice|upwork|consult/i },
  { category: "Refunds", kind: "income", pattern: /refund|reversal|cashback/i },
  { category: "Other Income", kind: "income", pattern: /deposit|transfer in|credit interest|dividend/i },
  // routine (essential)
  { category: "Housing & Rent", kind: "routine", pattern: /rent|landlord|ejari|mortgage/i },
  { category: "Utilities", kind: "routine", pattern: /dewa|sewa|addc|electricity|water|gas bill/i },
  { category: "Telecom & Internet", kind: "routine", pattern: /etisalat|\bdu\b|virgin mobile|fiber|internet|mobile bill/i },
  { category: "Groceries", kind: "routine", pattern: /carrefour|lulu|spinneys|union coop|grocery|supermarket|viva\b/i },
  { category: "Transport & Fuel", kind: "routine", pattern: /enoc|adnoc|eppco|petrol|salik|rta|metro|parking|careem|uber/i },
  { category: "Health & Pharmacy", kind: "routine", pattern: /pharmacy|clinic|hospital|aster|medcare|dental/i },
  { category: "Education", kind: "routine", pattern: /school|tuition|nursery|udemy|coursera/i },
  { category: "Insurance", kind: "routine", pattern: /insurance|takaful|axa|shield/i },
  // unwanted (leaks) — checked before lifestyle so fees/subs win
  { category: "Bank Fees & Charges", kind: "unwanted", pattern: /fee|charge|penalt|late payment|atm wd chg|intl txn|commission/i },
  { category: "Subscriptions", kind: "unwanted", pattern: /netflix|spotify|adobe|icloud|apple\.com|prime|osn|shahid|anghami|youtube premium|google one|dropbox|canva/i },
  { category: "Gym & Memberships", kind: "unwanted", pattern: /gym|fitlab|fitness first|golds/i },
  // lifestyle (discretionary)
  { category: "Dining & Delivery", kind: "lifestyle", pattern: /talabat|zomato|deliveroo|restaurant|cafe|coffee|starbucks|mcdonald|kfc|shake shack|eatery/i },
  { category: "Shopping", kind: "lifestyle", pattern: /amazon|noon\.com|noon\b|zara|h&m|ikea|sharaf dg|mall|shein/i },
  { category: "Entertainment", kind: "lifestyle", pattern: /vox|cinema|reel|theme park|playstation|steam|game/i },
  { category: "Travel", kind: "lifestyle", pattern: /emirates air|flydubai|etihad|airbnb|booking\.com|hotel/i },
];

function categorize(desc: string, amount: number): { category: string; kind: TxnKind } {
  for (const r of RULES) if (r.pattern.test(desc)) return { category: r.category, kind: r.kind };
  if (amount > 0) return { category: "Other Income", kind: "income" };
  return { category: "Other Spending", kind: "lifestyle" };
}

/** Human-friendly merchant name from a raw statement description. */
function merchantOf(desc: string): string {
  const cleaned = desc
    .replace(/pos |pur |txn |payment to |card \d+|ref[:# ]\S+|\d{4,}/gi, "")
    .replace(/[*_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = cleaned.split(" ").slice(0, 4).join(" ");
  return words
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Unknown";
}

/* ── CSV parsing ──────────────────────────────────────────────── */

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function parseDate(raw: string): Date | null {
  const s = raw.trim().replace(/"/g, "");
  // ISO: 2026-05-01
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]);
  // dd/mm/yyyy, dd-mm-yy, dd.mm.yyyy
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/.exec(s);
  if (dmy) {
    const y = +dmy[3] < 100 ? 2000 + +dmy[3] : +dmy[3];
    return new Date(y, +dmy[2] - 1, +dmy[1]);
  }
  // 01 Jan 2026 / 01-Jan-26 / 1 January 2026
  const dMon = /^(\d{1,2})[\s/.-]*([A-Za-z]{3,9})[\s/.,-]*(\d{2,4})/.exec(s);
  if (dMon) {
    const m = MONTHS[dMon[2].slice(0, 3).toLowerCase()];
    if (m !== undefined) {
      const y = +dMon[3] < 100 ? 2000 + +dMon[3] : +dMon[3];
      return new Date(y, m, +dMon[1]);
    }
  }
  // Jan 01, 2026
  const monD = /^([A-Za-z]{3,9})[\s/.-]*(\d{1,2})[\s,]+(\d{2,4})/.exec(s);
  if (monD) {
    const m = MONTHS[monD[1].slice(0, 3).toLowerCase()];
    if (m !== undefined) {
      const y = +monD[3] < 100 ? 2000 + +monD[3] : +monD[3];
      return new Date(y, m, +monD[2]);
    }
  }
  const t = Date.parse(s);
  return Number.isNaN(t) ? null : new Date(t);
}

/** Matches a date token at the start of a string; returns [matchedLength, Date]. */
function leadingDate(s: string): [number, Date] | null {
  const m =
    /^(\d{4}-\d{2}-\d{2}|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}|\d{1,2}[\s/.-]*[A-Za-z]{3,9}[\s/.,-]*\d{2,4}|[A-Za-z]{3,9}[\s/.-]*\d{1,2}[\s,]+\d{2,4})/.exec(
      s
    );
  if (!m) return null;
  const d = parseDate(m[1]);
  return d ? [m[0].length, d] : null;
}

function parseNumber(raw: string): number {
  const n = parseFloat(raw.replace(/[",\s]|AED/gi, ""));
  return Number.isNaN(n) ? 0 : n;
}

/** Split one CSV line respecting quoted fields. */
function splitLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') inQ = !inQ;
    else if (ch === delim && !inQ) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/**
 * Parse a CSV statement. Understands headers with either a single signed
 * Amount column or separate Debit/Credit columns.
 */
export function parseStatement(text: string): Txn[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const delim = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";

  const headerIdx = lines.findIndex((l) => /date/i.test(l));
  if (headerIdx === -1) return [];
  const header = splitLine(lines[headerIdx], delim).map((h) => h.toLowerCase());

  const col = (...names: string[]) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const iDate = col("date");
  const iDesc = col("description", "narration", "details", "particulars", "merchant");
  const iAmount = col("amount");
  const iDebit = col("debit", "withdrawal");
  const iCredit = col("credit", "deposit");
  if (iDate === -1 || iDesc === -1 || (iAmount === -1 && iDebit === -1)) return [];

  const txns: Txn[] = [];
  for (const line of lines.slice(headerIdx + 1)) {
    const cells = splitLine(line, delim);
    const date = parseDate(cells[iDate] ?? "");
    const desc = (cells[iDesc] ?? "").replace(/"/g, "").trim();
    if (!date || !desc) continue;

    let amount = 0;
    if (iAmount !== -1) amount = parseNumber(cells[iAmount] ?? "");
    else {
      const debit = parseNumber(cells[iDebit] ?? "");
      const credit = iCredit !== -1 ? parseNumber(cells[iCredit] ?? "") : 0;
      amount = credit > 0 ? credit : -Math.abs(debit);
    }
    if (amount === 0) continue;

    const { category, kind } = categorize(desc, amount);
    txns.push({ date, desc, merchant: merchantOf(desc), amount, category, kind });
  }
  return txns.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/* ── Text-line parsing (PDF statements) ───────────────────────── */

const INCOME_HINT = /salary|payroll|credit interest|refund|reversal|cashback|deposit|transfer in|invoice|freelance|dividend/i;

/**
 * Money token: handles 1,234.56 · 1.234,56 (EU) · 1,23,456.78 (Indian lakh) ·
 * 3-decimal currencies (KWD/BHD) · trimmed trailing zero (59.8) ·
 * (parentheses) negatives · CR/DR markers.
 */
const MONEY_RE = /(?<![\d/.,-])(-?)(\()?(\d[\d.,]*[.,]\d{1,3})(\))?(?![\d/.-])\s*(CR|DR)?/gi;

/** Normalize a money token: the last separator is the decimal point. */
function normMoney(tok: string): number {
  const lastSep = Math.max(tok.lastIndexOf("."), tok.lastIndexOf(","));
  if (lastSep === -1) return parseFloat(tok.replace(/,/g, ""));
  const intPart = tok.slice(0, lastSep).replace(/[.,]/g, "");
  return parseFloat(`${intPart}.${tok.slice(lastSep + 1)}`);
}

interface MoneyToken {
  index: number;
  value: number;
  negative: boolean;
  marker: "CR" | "DR" | "";
}

function moneyTokens(s: string): MoneyToken[] {
  return [...s.matchAll(MONEY_RE)].map((m) => ({
    index: m.index ?? 0,
    value: normMoney(m[3]),
    negative: m[1] === "-" || (m[2] === "(" && m[4] === ")"),
    marker: (m[5] ?? "").toUpperCase() as MoneyToken["marker"],
  }));
}

/** A whitespace-delimited word that looks like a plain number: decimal,
 * bare integer, comma-grouped, parenthesized or minus-signed. Never
 * contains a slash (dates) or letters. */
const PURE_NUM_WORD = /^\(?-?\d[\d,.]*\)?$/;

/**
 * Some statements print debit/credit/balance columns without a decimal
 * point at all when the amount is a whole number (e.g. "16" instead of
 * "16.00"), which MONEY_RE can't see since there's no separator to anchor
 * on. Those columns are always the last 1-3 whitespace-separated words on
 * the transaction line (reference/auth-code numbers always sit further
 * left, inside the description). This scans from the end of the line and
 * picks up to `max` trailing numeric-looking words, stopping at the first
 * word that isn't one — so it recovers whole-number columns without
 * mistaking reference numbers deeper in the description for amounts.
 */
function trailingMoneyTokens(s: string, max = 3): MoneyToken[] {
  const words: { text: string; index: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) words.push({ text: m[0], index: m.index });

  const toks: MoneyToken[] = [];
  let marker: "CR" | "DR" | "" = "";
  for (let i = words.length - 1; i >= 0 && toks.length < max; i--) {
    const w = words[i];
    if (/^(CR|DR)$/i.test(w.text)) {
      marker = w.text.toUpperCase() as "CR" | "DR";
      continue;
    }
    if (!PURE_NUM_WORD.test(w.text)) break;
    const negative = w.text.startsWith("-") || /^\(.*\)$/.test(w.text);
    const bare = w.text.replace(/^\(|\)$|^-/g, "");
    toks.unshift({ index: w.index, value: normMoney(bare), negative, marker });
    marker = "";
  }
  return toks;
}

/**
 * Parse statement lines extracted from a PDF. Tolerates serial-number columns,
 * value dates, month-name dates, regional number formats and Cr/Dr markers.
 * When a running balance column exists, the balance delta decides each sign;
 * otherwise markers, minus signs or income keywords do.
 */
export function parseTextStatement(lines: string[]): Txn[] {
  const txns: Txn[] = [];
  let prevBalance: number | null = null;

  // Many banks print statements newest-transaction-first. The running-balance
  // delta trick below only works walking forward in time, so detect the
  // overall direction from the first and last dated rows and, if the
  // statement is newest-first, walk it in reverse (the final sort() at the
  // end re-establishes ascending order for the returned list either way).
  let firstDate: Date | null = null;
  let lastDate: Date | null = null;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || /opening balance|balance brought forward|previous balance/i.test(line)) continue;
    const led = leadingDate(line);
    if (!led) continue;
    if (!firstDate) firstDate = led[1];
    lastDate = led[1];
  }
  const orderedLines =
    firstDate && lastDate && firstDate.getTime() > lastDate.getTime() ? [...lines].reverse() : lines;

  for (const raw of orderedLines) {
    let line = raw.trim();
    if (!line) continue;

    // opening balance rows seed the running balance even without a date
    if (/opening balance|balance brought forward|previous balance/i.test(line)) {
      const toks = moneyTokens(line);
      if (toks.length > 0) prevBalance = toks[toks.length - 1].value;
      continue;
    }

    // optional leading serial number column: "12  01 Jan 2026 …"
    let led = leadingDate(line);
    if (!led) {
      const serial = /^\d{1,5}[.)]?\s+/.exec(line);
      if (serial) {
        led = leadingDate(line.slice(serial[0].length));
        if (led) line = line.slice(serial[0].length);
      }
    }
    if (!led) continue;
    const [dateLen, date] = led;

    let rest = line.slice(dateLen).replace(/^[\s|:-]+/, "");
    // optional value date right after the transaction date
    const valueDate = leadingDate(rest);
    if (valueDate) rest = rest.slice(valueDate[0]).replace(/^[\s|:-]+/, "");

    // Prefer the trailing-column scan whenever it recovers at least as many
    // numbers as the strict decimal regex — it catches whole-number and
    // trimmed-decimal columns that MONEY_RE alone would miss, while still
    // ignoring reference/auth-code numbers earlier in the description.
    const strictToks = moneyTokens(rest);
    const tailToks = trailingMoneyTokens(rest);
    const toks = tailToks.length >= strictToks.length ? tailToks : strictToks;
    if (toks.length === 0) continue;

    const desc = rest.slice(0, toks[0].index).replace(/[|]/g, " ").trim();
    if (!desc || /total|closing balance/i.test(desc)) continue;

    const signOf = (t: MoneyToken) =>
      t.marker === "CR"
        ? t.value
        : t.marker === "DR" || t.negative
          ? -t.value
          : INCOME_HINT.test(desc)
            ? t.value
            : -t.value;

    // When delta-matching can't decide, prefer the last *nonzero* candidate —
    // separate Debit/Credit columns always print the unused side as 0.00, and
    // blindly taking "the last candidate" would grab that empty column.
    const fallbackCandidate = (candidates: MoneyToken[]) => {
      const nonzero = candidates.filter((c) => c.value !== 0);
      return nonzero.length > 0 ? nonzero[nonzero.length - 1] : candidates[candidates.length - 1];
    };

    let amount: number;
    if (toks.length >= 2) {
      const balance = toks[toks.length - 1].value;
      const candidates = toks.slice(0, -1);
      if (prevBalance !== null) {
        const delta = balance - prevBalance;
        const hit = candidates.find((c) => Math.abs(Math.abs(delta) - c.value) < 0.02);
        amount = hit ? (delta >= 0 ? hit.value : -hit.value) : signOf(fallbackCandidate(candidates));
      } else {
        amount = signOf(fallbackCandidate(candidates));
      }
      prevBalance = balance;
    } else {
      amount = signOf(toks[0]);
    }

    if (amount === 0) continue;
    const { category, kind } = categorize(desc, amount);
    txns.push({ date, desc, merchant: merchantOf(desc), amount, category, kind });
  }
  return txns.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/* ── Analysis ─────────────────────────────────────────────────── */

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export function analyze(txns: Txn[], currency = "AED"): Report {
  const monthKeys = [...new Set(txns.map((t) => monthKey(t.date)))].sort();
  const months = Math.max(monthKeys.length, 1);
  const monthLabels = monthKeys.map((k) => MONTH_NAMES[+k.split("-")[1]]);

  const income = txns.filter((t) => t.kind === "income");
  const spends = txns.filter((t) => t.kind !== "income");

  const totalIncome = income.reduce((s, t) => s + t.amount, 0);
  const totalSpend = spends.reduce((s, t) => s - t.amount, 0);
  const net = totalIncome - totalSpend;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((net / totalIncome) * 100)) : 0;

  // income sources
  const srcMap = new Map<string, number>();
  for (const t of income) srcMap.set(t.category, (srcMap.get(t.category) ?? 0) + t.amount);
  const incomeSources = [...srcMap.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);

  // categories
  const catMap = new Map<string, { kind: TxnKind; total: number; count: number }>();
  for (const t of spends) {
    const c = catMap.get(t.category) ?? { kind: t.kind, total: 0, count: 0 };
    c.total += -t.amount;
    c.count += 1;
    catMap.set(t.category, c);
  }
  const categories = [...catMap.entries()]
    .map(([category, c]) => ({ category, ...c }))
    .sort((a, b) => b.total - a.total);

  const sumKind = (k: TxnKind) => categories.filter((c) => c.kind === k).reduce((s, c) => s + c.total, 0);
  const routineTotal = sumKind("routine");
  const lifestyleTotal = sumKind("lifestyle");
  const unwantedTotal = sumKind("unwanted");

  // per-month series
  const monthlySpendSeries = monthKeys.map((k, i) => ({
    label: monthLabels[i],
    spend: spends.filter((t) => monthKey(t.date) === k).reduce((s, t) => s - t.amount, 0),
    income: income.filter((t) => monthKey(t.date) === k).reduce((s, t) => s + t.amount, 0),
  }));

  // recurring charges: same merchant, similar amount, in 2+ distinct months
  const byMerchant = new Map<string, Txn[]>();
  for (const t of spends) {
    const list = byMerchant.get(t.merchant) ?? [];
    list.push(t);
    byMerchant.set(t.merchant, list);
  }
  const recurring: RecurringCharge[] = [];
  for (const [merchant, list] of byMerchant) {
    if (list.length < 2) continue;
    const avg = list.reduce((s, t) => s - t.amount, 0) / list.length;
    const similar = list.every((t) => Math.abs(-t.amount - avg) / avg < 0.15);
    const distinctMonths = new Set(list.map((t) => monthKey(t.date))).size;
    if (similar && distinctMonths >= 2 && avg >= 10) {
      recurring.push({
        merchant,
        category: list[0].category,
        monthly: Math.round(avg),
        count: list.length,
        total: Math.round(avg * list.length),
        yearly: Math.round(avg * 12),
      });
    }
  }
  recurring.sort((a, b) => b.monthly - a.monthly);

  // duplicates: same merchant + same amount within 3 days
  const duplicates: DuplicatePair[] = [];
  for (const [merchant, list] of byMerchant) {
    for (let i = 1; i < list.length; i++) {
      const a = list[i - 1];
      const b = list[i];
      const days = Math.abs(b.date.getTime() - a.date.getTime()) / 86_400_000;
      if (a.amount === b.amount && days <= 3 && -a.amount >= 20) {
        duplicates.push({ merchant, amount: -a.amount, dates: [a.date, b.date] });
      }
    }
  }

  // explicit fees
  const fees = spends
    .filter((t) => t.category === "Bank Fees & Charges")
    .map((t) => ({ desc: t.desc, amount: -t.amount, date: t.date }));
  const feesTotal = fees.reduce((s, f) => s + f.amount, 0);

  /* ── Advice generation ──────────────────────────────────────── */
  const advice: Advice[] = [];
  const avgMonthlyIncome = totalIncome / months;
  const avgMonthlySpend = totalSpend / months;

  const subs = recurring.filter((r) => r.category === "Subscriptions" || r.category === "Gym & Memberships");
  if (subs.length > 0) {
    const subMonthly = subs.reduce((s, r) => s + r.monthly, 0);
    const cut = Math.round(subMonthly * 0.5);
    advice.push({
      title: `Audit your ${subs.length} recurring subscriptions`,
      detail: `You pay ${currency} ${subMonthly.toLocaleString()}/month across ${subs.length} recurring services (${subs
        .slice(0, 3)
        .map((s) => s.merchant)
        .join(", ")}${subs.length > 3 ? "…" : ""}). Most people actively use about half. Cancelling or downgrading the idle ones typically frees ~${currency} ${cut.toLocaleString()} every month.`,
      monthlySaving: cut,
    });
  }

  if (duplicates.length > 0) {
    const dupTotal = duplicates.reduce((s, d) => s + d.amount, 0);
    advice.push({
      title: `Reclaim ${duplicates.length} duplicate charge${duplicates.length > 1 ? "s" : ""}`,
      detail: `I found ${duplicates.length} pair${duplicates.length > 1 ? "s" : ""} of identical charges within days of each other — worth ${currency} ${dupTotal.toLocaleString()}. These are usually billing errors and are refundable: contact the merchant with the two dates and amounts.`,
      monthlySaving: Math.round(dupTotal / months),
    });
  }

  if (feesTotal > 0) {
    advice.push({
      title: "Stop paying avoidable bank fees",
      detail: `${currency} ${Math.round(feesTotal).toLocaleString()} went to fees and charges in this statement — foreign-transaction fees, ATM charges, late-payment penalties. A no-FX-fee card and autopay on your bills would eliminate nearly all of it.`,
      monthlySaving: Math.round(feesTotal / months),
    });
  }

  const dining = categories.find((c) => c.category === "Dining & Delivery");
  if (dining && dining.total / months > avgMonthlyIncome * 0.08) {
    const target = Math.round((dining.total / months) * 0.3);
    advice.push({
      title: "Trim food delivery, keep the dining out",
      detail: `Dining & delivery runs ${currency} ${Math.round(dining.total / months).toLocaleString()}/month (${Math.round(
        ((dining.total / months) / avgMonthlyIncome) * 100
      )}% of income) across ${dining.count} orders. Cutting just the impulse deliveries — not restaurant visits — usually saves ~30% here.`,
      monthlySaving: target,
    });
  }

  const shopping = categories.find((c) => c.category === "Shopping");
  if (shopping && shopping.total / months > avgMonthlyIncome * 0.06) {
    advice.push({
      title: "Add a 48-hour rule for online shopping",
      detail: `Shopping averaged ${currency} ${Math.round(shopping.total / months).toLocaleString()}/month. A 48-hour wait before any non-essential purchase reliably cuts impulse spend by ~25% without feeling restrictive.`,
      monthlySaving: Math.round((shopping.total / months) * 0.25),
    });
  }

  const potentialMonthlySaving = advice.reduce((s, a) => s + a.monthlySaving, 0);

  if (totalIncome > 0) {
    const targetRate = 20;
    advice.push({
      title: savingsRate >= targetRate ? "Put your surplus to work" : `Push your savings rate toward ${targetRate}%`,
      detail:
        savingsRate >= targetRate
          ? `You're already saving ${savingsRate}% of income — excellent. Automate a standing transfer of ${currency} ${Math.round(
              net / months
            ).toLocaleString()}/month into savings on salary day so the surplus never sits idle.`
          : `You currently keep ${savingsRate}% of what you earn. Applying the fixes above lifts you to ~${Math.min(
              99,
              Math.round(((net / months + potentialMonthlySaving) / avgMonthlyIncome) * 100)
            )}% — set up an automatic transfer on salary day so it happens by default.`,
      monthlySaving: 0,
    });
  }

  return {
    currency,
    months,
    monthLabels,
    totalIncome: Math.round(totalIncome),
    totalSpend: Math.round(totalSpend),
    net: Math.round(net),
    savingsRate,
    avgMonthlyIncome: Math.round(avgMonthlyIncome),
    avgMonthlySpend: Math.round(avgMonthlySpend),
    incomeSources,
    categories,
    routineTotal: Math.round(routineTotal),
    lifestyleTotal: Math.round(lifestyleTotal),
    unwantedTotal: Math.round(unwantedTotal),
    monthlySpendSeries,
    recurring,
    duplicates,
    fees,
    advice,
    potentialMonthlySaving,
    txnCount: txns.length,
  };
}
