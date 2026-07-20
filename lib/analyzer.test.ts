import { describe, expect, it } from "vitest";
import { analyze, detectCurrency, parseStatement, parseTextStatement } from "./analyzer";

/**
 * Golden tests for the statement analysis engine. All fixtures are
 * synthetic — never add real statement data here.
 */

const CSV_FIXTURE = [
  "Date,Description,Amount",
  "2026-05-01,SALARY CREDIT ACME CORP,85000",
  "2026-05-03,NETFLIX SUBSCRIPTION,-649",
  "2026-05-05,GROCERY SUPERMART,-2450",
  "2026-05-08,NETFLIX SUBSCRIPTION,-649",
  "2026-05-12,ELECTRICITY BILL,-1830",
].join("\n");

describe("parseStatement (CSV)", () => {
  it("parses every data row", () => {
    const txns = parseStatement(CSV_FIXTURE);
    expect(txns).toHaveLength(5);
  });

  it("keeps credit and debit signs distinct", () => {
    const txns = parseStatement(CSV_FIXTURE);
    const credits = txns.filter((t) => t.amount > 0);
    const debits = txns.filter((t) => t.amount < 0);
    expect(credits).toHaveLength(1);
    expect(debits).toHaveLength(4);
  });

  it("preserves amounts exactly", () => {
    const txns = parseStatement(CSV_FIXTURE);
    const salary = txns.find((t) => t.desc.includes("SALARY"));
    expect(salary?.amount).toBe(85000);
  });
});

describe("detectCurrency", () => {
  it("detects an explicit currency code", () => {
    expect(detectCurrency("Amount in USD 1,200.00 balance USD")).toBe("USD");
  });

  it("infers INR from Indian banking context without a currency symbol", () => {
    const text =
      "UPI/DR/512345/JOHN/OKAX/john@okaxis IMPS NEFT IFSC CNRB0001234 " +
      CSV_FIXTURE;
    expect(detectCurrency(text)).toBe("INR");
  });
});

describe("analyze", () => {
  const txns = parseStatement(CSV_FIXTURE);
  const report = analyze(txns, "INR");

  it("totals income and spend correctly", () => {
    expect(report.totalIncome).toBe(85000);
    expect(report.totalSpend).toBe(649 + 2450 + 649 + 1830);
  });

  it("net equals income minus spend", () => {
    expect(report.net).toBe(report.totalIncome - report.totalSpend);
  });

  it("carries the requested currency", () => {
    expect(report.currency).toBe("INR");
  });

  it("computes a sane savings rate", () => {
    expect(report.savingsRate).toBeGreaterThan(0);
    expect(report.savingsRate).toBeLessThanOrEqual(100);
  });
});

describe("parseTextStatement (wrapped Indian PDF narrations)", () => {
  // Simulates a PDF where the UPI narration wraps across physical lines
  // BEFORE the dated row that carries the amount and running balance —
  // the layout that used to silently drop transactions.
  const LINES = [
    "Opening Balance 10,000.00",
    "UPI/DR/512345678901/SWIGGY",
    "FOOD ORDER/UPI",
    "01-05-2026 UPI/DR 450.00 9,550.00",
    "UPI/CR/512345678902/ACME CORP",
    "SALARY/NEFT",
    "03-05-2026 NEFT 85,000.00 94,550.00",
  ];

  it("recovers both transactions despite wrapped narration lines", () => {
    const txns = parseTextStatement(LINES);
    expect(txns).toHaveLength(2);
  });

  it("derives signs from the running balance", () => {
    const txns = parseTextStatement(LINES);
    const debit = txns.find((t) => t.desc.includes("SWIGGY"));
    const credit = txns.find((t) => t.desc.includes("ACME"));
    expect(debit?.amount).toBe(-450);
    expect(credit?.amount).toBe(85000);
  });
});

describe("detectCurrency fallbacks and symbols", () => {
  it("detects INR from the rupee symbol", () => {
    expect(detectCurrency("Amount ₹1,200.00 paid to merchant")).toBe("INR");
  });

  it("defaults to AED when nothing identifies the currency", () => {
    expect(detectCurrency("2026-05-01, Generic store, -100")).toBe("AED");
  });
});

describe("duplicate and recurring detection", () => {
  it("flags the repeated identical charge as a duplicate or recurring", () => {
    const txns = parseStatement(CSV_FIXTURE);
    const report = analyze(txns, "INR");
    const flagged =
      report.duplicates.length + report.recurring.length;
    expect(flagged).toBeGreaterThan(0);
  });
});

describe("report serialization round-trip", () => {
  it("revives transaction dates after JSON round-trip", async () => {
    const { reviveReportDates } = await import("./reportSerialization");
    const report = analyze(parseStatement(CSV_FIXTURE), "INR");
    const revived = reviveReportDates(JSON.parse(JSON.stringify(report)));
    expect(revived.transactions[0].date).toBeInstanceOf(Date);
    expect(revived.transactions[0].date.getTime()).toBe(
      report.transactions[0].date.getTime()
    );
  });
});

describe("parseTextStatement newest-first statements", () => {
  it("handles statements printed newest-transaction-first", () => {
    const LINES = [
      "Opening Balance 10,000.00",
      "03-05-2026 NEFT SALARY ACME 85,000.00 94,550.00",
      "01-05-2026 UPI/DR SWIGGY 450.00 9,550.00",
    ];
    const txns = parseTextStatement(LINES);
    expect(txns).toHaveLength(2);
    // returned list is ascending by date regardless of print order
    expect(txns[0].date.getTime()).toBeLessThan(txns[1].date.getTime());
    expect(txns[0].amount).toBe(-450);
    expect(txns[1].amount).toBe(85000);
  });
});

describe("bank-identified currency detection (never default to USD)", () => {
  const uaeBanks = [
    ["FAB", "First Abu Dhabi Bank Account Statement"],
    ["ADCB", "ADCB Personal Banking Statement of Account"],
    ["Emirates NBD", "Emirates NBD Current Account Statement"],
    ["Mashreq", "Mashreq Bank Statement"],
    ["RAKBANK", "RAKBANK Account Summary"],
  ] as const;

  for (const [name, header] of uaeBanks) {
    it(`${name} statement → AED report`, () => {
      expect(detectCurrency(`${header}\n01/05/2026 GROCERY 145.50 9,854.50`)).toBe("AED");
    });
  }

  const indiaBanks = [
    ["HDFC", "HDFC Bank Statement of Account"],
    ["SBI", "State Bank of India Account Statement"],
    ["ICICI", "ICICI Bank Savings Account Statement"],
    ["Axis", "Axis Bank Statement Summary"],
  ] as const;

  for (const [name, header] of indiaBanks) {
    it(`${name} statement → INR report`, () => {
      expect(detectCurrency(`${header}\n01-05-2026 POS PURCHASE 450.00 9,550.00`)).toBe("INR");
    });
  }

  it("AED statement with USD boilerplate still reports AED", () => {
    // foreign-card rows and FX footers mention USD repeatedly — the exact
    // production bug: boilerplate must never outvote the issuing bank
    const text = [
      "Emirates NBD Statement of Account",
      "05/05/2026 AMAZON US USD 12.99 CARD 3,412.10",
      "09/05/2026 NETFLIX USD 15.49 CARD 3,396.61",
      "12/05/2026 OPENAI USD 20.00 CARD 3,376.61",
      "Exchange rates: 1 USD = 3.6725, card FX fee 2% on USD amounts",
      "Contact us: $0 charges on local transfers",
    ].join("\n");
    expect(detectCurrency(text)).toBe("AED");
  });

  it("a genuine USD statement still reports USD", () => {
    const text = [
      "Statement currency: USD",
      "05/05/2026 PAYROLL USD 4,500.00 USD 8,120.00",
      "09/05/2026 RENT USD 1,800.00 USD 6,320.00",
    ].join("\n");
    expect(detectCurrency(text)).toBe("USD");
  });

  it("د.إ symbol reports AED", () => {
    expect(detectCurrency("Balance د.إ 9,854.50 after purchase")).toBe("AED");
  });
});
