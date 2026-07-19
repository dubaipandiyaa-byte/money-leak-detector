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
  merchants: MerchantSummary[];
  transactions: Txn[];
  refundedTotal: number;
  accountName?: string;
  friendNotes: string[];
}

export interface MerchantSummary {
  merchant: string;
  category: string;
  kind: TxnKind;
  count: number;
  total: number;
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
 * Regional/payment-rail hints, checked when a statement has no explicit ISO
 * code or currency symbol at all — e.g. Indian bank passbook PDFs routinely
 * omit "INR"/"₹" entirely. Each entry is a currency code plus a regex; the
 * first one that matches wins. Add a new region here (not by touching the
 * detection logic) when a new bank/country's statements need this fallback.
 */
const REGION_CURRENCY_HINTS: { code: string; pattern: RegExp }[] = [
  {
    code: "INR",
    pattern:
      /\bIFSC\b|\bNEFT\b|\bIMPS\b|\bRTGS\b|\bNACH\b|\bUPI\/(CR|DR)\/|@ok(sbi|axis|icici|hdfcbank|bizaxis)\b|\bCanara Bank\b|\bState Bank of India\b|\b(HDFC|ICICI|SBIN|CNRB|UTIB|IDIB|YESB|KKBK|BARB|IOBA|ANDB|PUNB)\d{7}\b/i,
  },
];

/**
 * Detect the statement's currency: explicit ISO codes win (most frequent),
 * then unambiguous symbols, then regional payment-rail hints, then $ → USD.
 * Falls back to AED.
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
  for (const { code, pattern } of REGION_CURRENCY_HINTS) {
    if (pattern.test(text)) return code;
  }
  if (text.includes("$")) return "USD";
  return "AED";
}

/**
 * Label patterns for the account holder's name, tried in order against the
 * full statement text — first capture group is the name. Add a new bank's
 * label format here rather than editing extractAccountName itself.
 */
const ACCOUNT_NAME_PATTERNS: RegExp[] = [
  // "Account Name: John Smith" / "Customer Name - John Smith" / "Account holder: ..."
  /(?:account name\(?s?\)?|customer name|account holder|name of (?:the )?account holder)\s*[:\-]\s*([A-Za-z][A-Za-z .'\-]{2,60})/i,
  // Indian bank passbook PDFs (e.g. Canara Bank) print the label and value as
  // their own line with no colon/dash at all — "Name KARTHICK RAMANI".
  // Anchored to line start so this can't also match "Branch Name ..." or a
  // name mentioned mid-transaction elsewhere in the statement.
  /^name\s+([A-Za-z][A-Za-z .'\-]{2,60})\s*$/im,
];

/** Pull the account holder's name off the statement header, title-cased. */
export function extractAccountName(text: string): string | undefined {
  let m: RegExpExecArray | null = null;
  for (const pattern of ACCOUNT_NAME_PATTERNS) {
    m = pattern.exec(text);
    if (m) break;
  }
  if (!m) return undefined;
  const name = m[1].replace(/\s+/g, " ").trim();
  if (name.length < 3) return undefined;
  return name
    .toLowerCase()
    .replace(/(^|[\s.'-])\w/g, (c) => c.toUpperCase());
}

/* ── Categorization rules ─────────────────────────────────────── */

const RULES: { category: string; kind: TxnKind; pattern: RegExp }[] = [
  // income
  { category: "Salary", kind: "income", pattern: /salary|payroll|wages/i },
  { category: "Freelance & Side Income", kind: "income", pattern: /freelance|invoice|upwork|consult/i },
  { category: "Refunds", kind: "income", pattern: /refund|reversal|cashback|^ref\b|^upi\/rev\//i },
  { category: "Other Income", kind: "income", pattern: /deposit|transfer in|credit interest|dividend|\bsbint\b/i },
  // routine (essential)
  { category: "Housing & Rent", kind: "routine", pattern: /rent|landlord|ejari|mortgage/i },
  { category: "Utilities", kind: "routine", pattern: /dewa|sewa|addc|electricity|water|gas bill/i },
  { category: "Telecom & Internet", kind: "routine", pattern: /etisalat|\bdu\b|virgin mobile|fiber|internet|mobile bill/i },
  { category: "Groceries", kind: "routine", pattern: /carrefour|lulu|spinneys|union coop|grocery|supermarket|hyper|\bmart\b|mini market|baqala|viva\b/i },
  { category: "Transport & Fuel", kind: "routine", pattern: /enoc|adnoc|eppco|petrol|salik|rta|metro|parking|careem|uber/i },
  { category: "Health & Pharmacy", kind: "routine", pattern: /pharmacy|clinic|hospital|aster|medcare|dental/i },
  { category: "Education", kind: "routine", pattern: /school|tuition|nursery|udemy|coursera/i },
  { category: "Insurance", kind: "routine", pattern: /insurance|takaful|axa|shield/i },
  { category: "Loan & EMI", kind: "routine", pattern: /installment|\bemi\b|loan recovery|loan pay|^nach\b/i },
  { category: "Credit Card Payments", kind: "routine", pattern: /credit card paymnt|credit card payment|card paymnt/i },
  { category: "Transfers & Remittances", kind: "routine", pattern: /mbtrf|remitt|\btrf\b|transfer out|taptap|western union|exchange house|al ansari/i },
  { category: "Cash & ATM", kind: "lifestyle", pattern: /atm wdl|atm withdrawal|cash wdl|cash withdrawal/i },
  // unwanted (leaks) — checked before lifestyle so fees/subs win
  { category: "Bank Fees & Charges", kind: "unwanted", pattern: /fee|charge|penalt|late payment|atm wd chg|intl txn|commission|^imps sc\b/i },
  { category: "Subscriptions", kind: "unwanted", pattern: /netflix|spotify|adobe|icloud|apple\.com|prime|osn|shahid|anghami|youtube premium|google one|dropbox|canva|hotstar|jiorecha|airtel|jio\b/i },
  { category: "Gym & Memberships", kind: "unwanted", pattern: /gym|fitlab|fitness first|golds/i },
  // lifestyle (discretionary)
  { category: "Dining & Delivery", kind: "lifestyle", pattern: /talabat|zomato|deliveroo|keeta|swiggy|\brest\b|restaurant|pizza|cafe|coffee|starbucks|mcdonald|kfc|shake shack|eatery|cafeteria/i },
  { category: "Shopping", kind: "lifestyle", pattern: /amazon|noon\.com|noon\b|zara|h&m|ikea|sharaf dg|mall|shein|flipkart|myntra/i },
  { category: "Entertainment", kind: "lifestyle", pattern: /vox|cinema|reel|theme park|playstation|steam|game/i },
  { category: "Travel", kind: "lifestyle", pattern: /emirates air|flydubai|etihad|airbnb|booking\.com|hotel|\bnhai\b|fastag|indigo|irctc/i },
];

function categorize(desc: string, amount: number): { category: string; kind: TxnKind } {
  // Sign-aware: credits only match income rules (so a refunded purchase from
  // a "spending" merchant isn't misfiled), debits only match spending rules.
  if (amount > 0) {
    for (const r of RULES)
      if (r.kind === "income" && r.pattern.test(desc)) return { category: r.category, kind: r.kind };
    return { category: "Other Income", kind: "income" };
  }
  for (const r of RULES)
    if (r.kind !== "income" && r.pattern.test(desc)) return { category: r.category, kind: r.kind };
  return { category: "Other Spending", kind: "lifestyle" };
}

/**
 * A bank/payment-rail narration profile teaches the parser one statement
 * format's shape: how to pull the real counterparty name out of a raw
 * narration line, and any truncated-tag aliases specific to that rail. To
 * support a new bank whose narrations don't fit the generic word-cleanup
 * fallback in `merchantOf`, add a profile here — nothing else in this file
 * needs to change. Profiles are tried in order; first match wins.
 */
interface BankNarrationProfile {
  id: string;
  /** Returns the raw counterparty name segment, or null if this profile doesn't recognize the narration's shape. */
  extractName: (desc: string) => string | null;
  /** Known truncated/VPA-style tags -> a readable display name, tested against the raw extracted name (before generic title-casing). */
  aliases?: [RegExp, string][];
}

const INDIA_UPI_PROFILE: BankNarrationProfile = {
  id: "india-upi-imps",
  extractName(desc) {
    // Indian business narrations often prefix the payee with "M/S." (Messrs)
    // — its own internal slash would otherwise get mistaken for the name
    // field's closing delimiter, truncating the name to just "M".
    const normalized = desc.replace(/\/M\/S\.?\s*/gi, "/M.S ");
    // "UPI/DR/<ref>/SANKAR P/KVBL/**vpa@psp/UPI//<hash>/<date>" — not
    // anchored to the start of the description, since several banks (e.g.
    // SBI) prefix it with their own label first: "TO TRANSFER-UPI/DR/..."
    // or "BY TRANSFER-UPI/CR/...".
    const std = /(?:UPI|FIR|NEFT|RTGS)\/(?:CR|DR|REV)\/\d+\/([^/]+)\//i.exec(normalized);
    if (std) return std[1];
    // "MB-IMPS-DR/PRIYANGAR/TMBL/**9019/<note>/<date>/<ref>"
    const imps = /MB-IMPS-(?:CR|DR)\/([^/]+)\//i.exec(normalized);
    if (imps) return imps[1];
    return null;
  },
  aliases: [
    [/^google\s*pl/i, "Google Play"],
    [/^jio\s*rech/i, "Jio Recharge"],
    [/^jio\s*hotstar/i, "JioHotstar"],
    [/^airtel/i, "Airtel"],
    [/^bajaj\s*fin/i, "Bajaj Finance"],
    [/^apollo\s*ph/i, "Apollo Pharmacy"],
    [/^national\b.*nhai|^nhai/i, "NHAI Toll (FASTag)"],
    [/^kfc/i, "KFC"],
  ],
};

/**
 * Registered bank/rail narration profiles, tried in order by `merchantOf`
 * before it falls back to the generic Western-statement word cleanup.
 */
const BANK_NARRATION_PROFILES: BankNarrationProfile[] = [INDIA_UPI_PROFILE];

/** Human-friendly merchant name from a raw statement description. */
function merchantOf(desc: string): string {
  for (const profile of BANK_NARRATION_PROFILES) {
    const rawName = profile.extractName(desc);
    if (!rawName) continue;
    const name = rawName.replace(/\s+/g, " ").trim();
    const alias = profile.aliases?.find(([pattern]) => pattern.test(name));
    if (alias) return alias[1];
    if (name.length >= 2) {
      return name
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    }
  }

  if (/^sbint\b/i.test(desc)) return "Savings Interest";
  if (/^apy contri\b/i.test(desc)) return "APY Contribution";

  const cleaned = desc
    .replace(/pos |pur |txn |ref |payment to |card \d+|ref[:# ]\S+|\b\d{1,2}\/\d{1,2}\b|\d{4,}/gi, "")
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
 * Lines that close out a transaction block or belong to page furniture —
 * never part of the *next* transaction's wrapped narration, so accumulating
 * them into `pendingPrefix` would bleed unrelated text into the following
 * row's description.
 */
const TRAILER_OR_FURNITURE =
  /^chq:|^page \d|disclaimer|beware of phishing|^date\s+particulars|closing balance|unless the constituent|ombudsman|do not share|are you a merchant|computer output|end of statement/i;

/**
 * Parse statement lines extracted from a PDF. Tolerates serial-number columns,
 * value dates, month-name dates, regional number formats and Cr/Dr markers.
 * When a running balance column exists, the balance delta decides each sign;
 * otherwise markers, minus signs or income keywords do.
 *
 * Some layouts (e.g. Indian bank passbook PDFs) wrap a transaction's full
 * narration across several physical lines, with the date/amount/balance
 * columns aligned to whichever wrapped line happens to sit at that row's
 * y-position — often NOT the first line. Those preceding wrapped lines carry
 * no date of their own, so they're accumulated in `pendingPrefix` and
 * prepended to the next dated row, reconstructing the full narration before
 * merchant/category extraction runs on it.
 */
export function parseTextStatement(lines: string[]): Txn[] {
  const txns: Txn[] = [];
  let prevBalance: number | null = null;
  let pendingPrefix = "";

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
      pendingPrefix = "";
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
    if (!led) {
      // a wrapped narration continuation with no date/amount of its own —
      // hold it until the row that carries this transaction's date/amount.
      if (TRAILER_OR_FURNITURE.test(line)) pendingPrefix = "";
      else pendingPrefix = pendingPrefix ? `${pendingPrefix} ${line}` : line;
      continue;
    }
    const [dateLen, date] = led;

    let rest = line.slice(dateLen).replace(/^[\s|:-]+/, "");
    // optional value date right after the transaction date
    const valueDate = leadingDate(rest);
    if (valueDate) rest = rest.slice(valueDate[0]).replace(/^[\s|:-]+/, "");

    if (pendingPrefix) {
      rest = `${pendingPrefix} ${rest}`;
      pendingPrefix = "";
    }

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

/**
 * The last page of every report: DONRITHIK AI talking like a friend, not a
 * bank. Warm, personal, strictly financial — a plain reading of what the
 * statement shows, then debt, family, food, savings, and a closing piece of
 * future cost-control advice.
 */
function buildFriendNotes(opts: {
  firstName: string;
  currency: string;
  categories: Report["categories"];
  merchants: MerchantSummary[];
  avgMonthlyIncome: number;
  avgMonthlySpend: number;
  net: number;
  months: number;
  savingsRate: number;
  potentialMonthlySaving: number;
}): string[] {
  const { firstName, currency, categories, merchants, avgMonthlyIncome, avgMonthlySpend, months, savingsRate, potentialMonthlySaving } = opts;
  const money = (n: number) => `${currency} ${Math.round(n).toLocaleString()}`;
  const cat = (name: string) => categories.find((c) => c.category === name);
  const notes: string[] = [];

  notes.push(
    `Hey ${firstName} — DONRITHIK AI here. I just read every single line of your statement, and before we talk numbers I want you to know: you're doing better than you think. Now sit with me for a minute, because this is the part where I talk to you like a friend, not a bank.`
  );

  // What the statement actually says — a plain financial reading
  const topCat = categories[0];
  const topMerchant = merchants[0];
  notes.push(
    `First, here's what I understood from your statement, plainly: about ${money(avgMonthlyIncome)} comes in each month, about ${money(avgMonthlySpend)} goes out, and you keep ${savingsRate}% of what you earn.${topCat ? ` The biggest door your money leaves through is ${topCat.category} — ${money(topCat.total / months)} a month.` : ""}${topMerchant ? ` Your single largest spending relationship is ${topMerchant.merchant}, ${money(topMerchant.total)} across the statement.` : ""} None of this is a mystery — it's a pattern, and patterns can be changed.`
  );

  // Debt — the quiet bully
  const emi = cat("Loan & EMI");
  const cc = cat("Credit Card Payments");
  if (emi || cc) {
    const debtMonthly = (emi?.total ?? 0) / months + (cc?.total ?? 0) / months;
    const share = avgMonthlyIncome > 0 ? Math.round((debtMonthly / avgMonthlyIncome) * 100) : 0;
    notes.push(
      `Now the honest one: debt. Between ${emi ? "the loan installment" : ""}${emi && cc ? " and " : ""}${cc ? "the credit card payments" : ""}, about ${money(debtMonthly)} of your month${share > 0 ? ` — roughly ${share}% of your income —` : ""} is spoken for before you wake up. Debt isn't shameful, ${firstName}, but expensive debt is a bully.${cc ? " Those flat round card payments tell me a balance is being carried — card interest is 3%+ per month, so paying the full statement balance is the single highest-return move you can make. Minimums are a trap designed to keep you paying forever." : ""} And promise me this: new debt only for needs, never for wants.`
    );
  }

  // Family / remittances — protect the generosity
  const remit = cat("Transfers & Remittances");
  if (remit) {
    notes.push(
      `I also noticed you send money home — ${money(remit.total / months)} a month. That says everything about who you are, and I'd never tell you to stop. I'll just tell you to protect it: send once a month instead of splitting it, compare your bank's rate with a proper remittance service, and that same love reaches home with less lost on the way.`
    );
  }

  // Food — praise or nudge, based on reality
  const dining = cat("Dining & Delivery");
  if (dining && dining.total / months > avgMonthlyIncome * 0.08) {
    notes.push(
      `Food: you're spending ${money(dining.total / months)} a month eating out and ordering in. I'm not going to tell you to never enjoy a meal — just cook a few more nights and watch that number drop.`
    );
  } else if (dining) {
    notes.push(
      `Your food spending? Honestly — respect. ${money(dining.total / months)} a month, simple places, no luxury nonsense. A lot of people earning what you earn spend five times this. Keep being you.`
    );
  }

  // The habit that changes everything
  const target = Math.max(Math.round(avgMonthlyIncome * 0.2), 100);
  notes.push(
    `Here's the one habit that changes everything: the day your salary lands, move ${money(target)} into a separate account before you see it. Not what's left at the end of the month — first, automatically, every month. Build up to ${money(avgMonthlySpend * 6)} — that's six months of your life fully covered, sleep-at-night money. After that, we talk about making your money work while you rest.`
  );

  // Final advice — future cost control, from the numbers in this statement
  const cap = Math.round(avgMonthlySpend * 0.95);
  notes.push(
    `And my final advice, ${firstName} — future cost control. Give every month a ceiling: you averaged ${money(avgMonthlySpend)} in spending, so hold next month under ${money(cap)} and treat that limit like a bill you owe yourself.${topCat ? ` Watch ${topCat.category} first — that's where the bulk of it leaves.` : ""}${potentialMonthlySaving > 0 ? ` The leaks I itemized in your plan are worth about ${money(potentialMonthlySaving)} a month — claim those and the ceiling almost holds itself.` : ""} Then spend five minutes a week with your statement: duplicates, fees and idle subscriptions never survive being looked at.`
  );

  notes.push(
    `Money is a tool, ${firstName}, not a scoreboard. You don't need to be rich by Friday — you just need to be a little less leaky every month, and I'll be here reading the numbers so you don't have to. — Your DONRITHIK AI`
  );

  return notes;
}

export function analyze(txns: Txn[], currency = "AED", accountName?: string): Report {
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

  // refunded purchases: a credit that mirrors an earlier debit, same merchant
  let refundedTotal = 0;
  const refundedMerchants = new Set<string>();
  for (const inc of income) {
    if (!/\bref\b|refund|reversal/i.test(inc.desc)) continue;
    const hit = spends.find(
      (s) => s.merchant === inc.merchant && Math.abs(-s.amount - inc.amount) < 0.02
    );
    if (hit) {
      refundedTotal += inc.amount;
      refundedMerchants.add(hit.merchant);
    }
  }

  // Single-month statements can't prove recurrence by repetition across
  // months, but some categories are inherently monthly commitments — surface
  // those so one-month uploads still get a committed-costs view.
  if (months < 2) {
    const COMMITTED = new Set([
      "Loan & EMI",
      "Credit Card Payments",
      "Telecom & Internet",
      "Subscriptions",
      "Insurance",
      "Housing & Rent",
      "Utilities",
      "Gym & Memberships",
      "Transfers & Remittances",
    ]);
    for (const [merchant, list] of byMerchant) {
      const category = list[0].category;
      if (!COMMITTED.has(category)) continue;
      if (refundedMerchants.has(merchant)) continue; // refunded, not a commitment
      if (recurring.some((r) => r.merchant === merchant)) continue;
      const total = list.reduce((s, t) => s - t.amount, 0);
      if (total <= 0) continue;
      recurring.push({
        merchant,
        category,
        monthly: Math.round(total),
        count: list.length,
        total: Math.round(total),
        yearly: Math.round(total * 12),
      });
    }
    recurring.sort((a, b) => b.monthly - a.monthly);
  }

  // per-merchant breakdown (spending only), largest first
  const merchants: MerchantSummary[] = [...byMerchant.entries()]
    .map(([merchant, list]) => ({
      merchant,
      category: list[0].category,
      kind: list[0].kind,
      count: list.length,
      total: Math.round(list.reduce((s, t) => s - t.amount, 0)),
    }))
    .filter((m) => m.total > 0)
    .sort((a, b) => b.total - a.total);


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

  const remit = categories.find((c) => c.category === "Transfers & Remittances");
  if (remit && remit.count / months >= 2) {
    advice.push({
      title: "Batch your money transfers",
      detail: `You made ${remit.count} transfers totalling ${currency} ${Math.round(remit.total).toLocaleString()}. Each carries its own charge and exchange spread — combining them into one monthly transfer, and comparing your bank's rate against a dedicated remittance service, typically saves ~1% plus the repeated fees.`,
      monthlySaving: Math.round((remit.total / months) * 0.012),
    });
  }

  const ccpay = categories.find((c) => c.category === "Credit Card Payments");
  if (ccpay) {
    advice.push({
      title: "Check what your credit cards really cost you",
      detail: `${ccpay.count} card payment${ccpay.count > 1 ? "s" : ""} totalling ${currency} ${Math.round(ccpay.total).toLocaleString()} — flat round amounts usually mean a balance is being carried. Card interest compounds at 3%+ per month, so paying statement balances in full is almost always the highest-return move available to you.`,
      monthlySaving: 0,
    });
  }

  const cash = categories.find((c) => c.category === "Cash & ATM");
  if (cash && cash.total > totalSpend * 0.05) {
    advice.push({
      title: "Move cash spending onto cards",
      detail: `${currency} ${Math.round(cash.total).toLocaleString()} was withdrawn as cash — money that can't be tracked or analyzed. Paying by card keeps every ${currency} visible, so leaks can't hide.`,
      monthlySaving: 0,
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
    const projectedMonthlyNet = net / months + potentialMonthlySaving;
    const projectedRate = Math.min(99, Math.max(0, Math.round((projectedMonthlyNet / avgMonthlyIncome) * 100)));
    advice.push({
      title:
        savingsRate >= targetRate
          ? "Put your surplus to work"
          : projectedMonthlyNet < 0
            ? "Close the gap between what you earn and spend"
            : `Push your savings rate toward ${targetRate}%`,
      detail:
        savingsRate >= targetRate
          ? `You're already saving ${savingsRate}% of income — excellent. Automate a standing transfer of ${currency} ${Math.round(
              net / months
            ).toLocaleString()}/month into savings on salary day so the surplus never sits idle.`
          : projectedMonthlyNet < 0
            ? `You're currently spending ${currency} ${Math.round(
                -projectedMonthlyNet
              ).toLocaleString()} more than you earn each month, even after the fixes above. Closing that gap comes before any savings target — through further cuts or more income.`
            : `You currently keep ${savingsRate}% of what you earn. Applying the fixes above lifts you to ~${projectedRate}% — set up an automatic transfer on salary day so it happens by default.`,
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
    merchants,
    transactions: txns,
    refundedTotal: Math.round(refundedTotal),
    accountName,
    friendNotes: buildFriendNotes({
      firstName: accountName?.split(" ")[0] ?? "friend",
      currency,
      categories,
      merchants,
      avgMonthlyIncome: totalIncome / months,
      avgMonthlySpend: totalSpend / months,
      net,
      months,
      savingsRate,
      potentialMonthlySaving,
    }),
  };
}
