/**
 * Shared JSON round-trip helper for the `Report` shape (used by both
 * localStorage persistence and the Supabase `reports.report_data` column).
 * JSON.parse leaves every Date field as a string — this revives the three
 * places the Report shape carries real Date objects.
 */
import type { Report } from "./analyzer";

function reviveDate(value: unknown): Date {
  return new Date(value as string);
}

export function reviveReportDates(report: Report): Report {
  report.transactions = report.transactions.map((t) => ({ ...t, date: reviveDate(t.date) }));
  report.duplicates = report.duplicates.map((d) => ({
    ...d,
    dates: [reviveDate(d.dates[0]), reviveDate(d.dates[1])] as [Date, Date],
  }));
  report.fees = report.fees.map((f) => ({ ...f, date: reviveDate(f.date) }));
  return report;
}
