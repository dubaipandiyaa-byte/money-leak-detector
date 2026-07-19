import type { SupabaseClient } from "@supabase/supabase-js";
import type { Report } from "@/lib/analyzer";
import { reviveReportDates } from "@/lib/reportSerialization";

/**
 * Query helpers for the `reports` table. Every function takes a Supabase
 * client as its first argument so the same code runs from either the
 * browser client (Client Components, e.g. AnalyzeFlow) or the server client
 * (Server Components/Actions, e.g. /history) — Row Level Security is what
 * actually enforces per-user access in both cases, not these helpers.
 */

export interface ReportListItem {
  id: string;
  fileName: string;
  currency: string;
  totalIncome: number;
  totalSpend: number;
  net: number;
  savingsRate: number;
  monthLabels: string[];
  createdAt: Date;
}

export async function saveReportToDb(
  supabase: SupabaseClient,
  userId: string,
  report: Report,
  fileName: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from("reports").insert({
    user_id: userId,
    file_name: fileName,
    currency: report.currency,
    total_income: report.totalIncome,
    total_spend: report.totalSpend,
    net: report.net,
    savings_rate: report.savingsRate,
    month_labels: report.monthLabels,
    report_data: report,
  });
  return { error };
}

export async function listUserReports(supabase: SupabaseClient): Promise<ReportListItem[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("id, file_name, currency, total_income, total_spend, net, savings_rate, month_labels, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    fileName: row.file_name,
    currency: row.currency,
    totalIncome: row.total_income,
    totalSpend: row.total_spend,
    net: row.net,
    savingsRate: row.savings_rate,
    monthLabels: row.month_labels,
    createdAt: new Date(row.created_at),
  }));
}

export interface LoadedDbReport {
  report: Report;
  fileName: string;
  createdAt: Date;
}

export async function getUserReport(
  supabase: SupabaseClient,
  id: string
): Promise<LoadedDbReport | null> {
  const { data, error } = await supabase
    .from("reports")
    .select("file_name, report_data, created_at")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    report: reviveReportDates(data.report_data as Report),
    fileName: data.file_name,
    createdAt: new Date(data.created_at),
  };
}
