/**
 * Persists the most recent analysis result to the browser's localStorage so
 * a page refresh doesn't lose it. Nothing here ever leaves the device — this
 * is the same on-device guarantee the analyzer itself makes, just extended
 * across a reload instead of ending when the tab closes.
 */
import type { Report } from "./analyzer";

const STORAGE_KEY = "mld:last-report:v1";

interface StoredReport {
  fileName: string;
  savedAt: string;
  report: Report;
}

export interface LoadedReport {
  report: Report;
  fileName: string;
  savedAt: Date;
}

export function saveReport(report: Report, fileName: string): void {
  if (typeof window === "undefined") return;
  try {
    const payload: StoredReport = { fileName, savedAt: new Date().toISOString(), report };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage full, disabled, or private-mode — persistence is a convenience,
    // never a requirement, so fail silently rather than interrupt the user.
  }
}

function reviveDate(value: unknown): Date {
  return new Date(value as string);
}

export function loadReport(): LoadedReport | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredReport;
    const report = parsed.report;

    // JSON.parse leaves every Date field as a string — revive the three
    // places the Report shape carries real Date objects.
    report.transactions = report.transactions.map((t) => ({ ...t, date: reviveDate(t.date) }));
    report.duplicates = report.duplicates.map((d) => ({
      ...d,
      dates: [reviveDate(d.dates[0]), reviveDate(d.dates[1])] as [Date, Date],
    }));
    report.fees = report.fees.map((f) => ({ ...f, date: reviveDate(f.date) }));

    return { report, fileName: parsed.fileName, savedAt: new Date(parsed.savedAt) };
  } catch {
    return null;
  }
}

export function clearReport(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
