import { describe, expect, it } from "vitest";
import { analyze, detectCurrency, parseStatement } from "./analyzer";

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
