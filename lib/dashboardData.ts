/**
 * Derives every number the Command Center widgets show from a user's real,
 * saved `Report` (plus their report history for month-over-month deltas).
 * Nothing here is invented per-user data — where the demo dashboard used to
 * show a feature with no real backing data (goals, emergency fund, an
 * "AI confidence" score with no real source), that widget is left to the
 * caller to mark as "coming soon" rather than faked here.
 */
import type { Report } from "./analyzer";
import type { Leak, TimelineEvent, Insight } from "./data";
import type { ReportListItem } from "./supabase/reports";

const LEAK_HUES = ["#31171a", "#301d12", "#12281b", "#2e2410", "#1c2129", "#142030"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export interface DashboardData {
  healthScore: number;
  healthScoreDeltaLabel: string | null;
  savingsPrediction30d: number;
  txnCount: number;
  scanPhaseDetails: [string, string, string, string];

  monthlySpend: { label: string; value: number; accent?: boolean }[];
  latestMonthSpend: number;
  spendDeltaLabel: string | null;

  aiSavingsSpark: number[];

  detectedLeaksCount: number;
  detectedLeaksMonthly: number;
  leaksByCategory: { label: string; count: number }[];

  subscriptionsCount: number;
  subscriptionsMonthly: number;

  cashFlowSpark: number[];

  topRecommendation: { title: string; detail: string } | null;

  leaks: Leak[];
  timeline: TimelineEvent[];
  insights: Insight[];
}

export function buildDashboardData(latest: Report, history: ReportListItem[]): DashboardData {
  const cur = latest.currency;

  // Health score: directly the savings rate, clamped — simple, real, and
  // comparable across reports for a trend delta (no invented weighting).
  const healthScore = clamp(Math.round(latest.savingsRate), 0, 100);
  let healthScoreDeltaLabel: string | null = null;
  if (history.length >= 2) {
    const delta = Math.round(history[0].savingsRate - history[1].savingsRate);
    if (delta !== 0) healthScoreDeltaLabel = `${delta > 0 ? "▲" : "▼"} ${Math.abs(delta)} pts vs last report`;
  }

  const recurringSorted = [...latest.recurring].sort((a, b) => b.monthly - a.monthly);
  const topRecurring = recurringSorted[0];

  const scanPhaseDetails: [string, string, string, string] = [
    `${latest.txnCount} transactions across your account`,
    `Compared against your ${latest.months}-month statement`,
    `${latest.recurring.length + latest.duplicates.length} pattern${latest.recurring.length + latest.duplicates.length === 1 ? "" : "s"} worth reviewing`,
    topRecurring
      ? `${topRecurring.merchant} — ${cur} ${Math.round(topRecurring.monthly)}/mo, ${topRecurring.count}× charged`
      : "No major recurring leaks found — nice work",
  ];

  const monthlySpend = latest.monthlySpendSeries.map((d, i) => ({
    label: d.label,
    value: d.spend,
    accent: i === latest.monthlySpendSeries.length - 1,
  }));
  const latestMonthSpend = monthlySpend.at(-1)?.value ?? latest.avgMonthlySpend;
  let spendDeltaLabel: string | null = null;
  if (latest.monthlySpendSeries.length >= 2) {
    const cur2 = latest.monthlySpendSeries.at(-1)!;
    const prev = latest.monthlySpendSeries.at(-2)!;
    if (prev.spend > 0) {
      const pct = ((cur2.spend - prev.spend) / prev.spend) * 100;
      spendDeltaLabel = `${pct <= 0 ? "" : "+"}${pct.toFixed(1)}% vs ${prev.label}`;
    }
  }

  const aiSavingsSpark = latest.monthlySpendSeries.map((d) => Math.max(0, d.income - d.spend));
  const cashFlowSpark = latest.monthlySpendSeries.reduce<number[]>((acc, d) => {
    const prevTotal = acc.length ? acc[acc.length - 1] : 0;
    acc.push(prevTotal + (d.income - d.spend));
    return acc;
  }, []);

  const unwantedCategories = latest.categories.filter((c) => c.kind === "unwanted");
  const leaksByCategory = unwantedCategories
    .map((c) => ({ label: c.category, count: c.count }))
    .sort((a, b) => b.count - a.count);

  const subscriptionRecurring = latest.recurring.filter(
    (r) => r.category === "Subscriptions" || r.category === "Gym & Memberships"
  );

  const topAdvice = [...latest.advice].sort((a, b) => b.monthlySaving - a.monthlySaving)[0];

  // Leak cards: recurring charges plus duplicate charges, biggest first.
  const leakSources: Leak[] = [
    ...recurringSorted.map((rc, i) => ({
      id: `recurring-${i}`,
      vendor: rc.merchant,
      category: rc.category,
      monogram: rc.merchant.charAt(0).toUpperCase(),
      hue: LEAK_HUES[i % LEAK_HUES.length],
      monthlyWaste: Math.round(rc.monthly),
      yearlySavings: Math.round(rc.yearly),
      confidence: clamp(60 + rc.count * 8, 60, 98),
      risk: (rc.monthly >= 200 ? "high" : rc.monthly >= 50 ? "medium" : "low") as Leak["risk"],
      finding: `Charged ${rc.count}× so far, averaging ${cur} ${Math.round(rc.monthly).toLocaleString()}/mo.`,
      action: "Review this charge",
    })),
    ...latest.duplicates.map((d, i) => ({
      id: `duplicate-${i}`,
      vendor: d.merchant,
      category: "Duplicate charge",
      monogram: d.merchant.charAt(0).toUpperCase(),
      hue: LEAK_HUES[(i + 2) % LEAK_HUES.length],
      monthlyWaste: Math.round(d.amount),
      yearlySavings: Math.round(d.amount),
      confidence: 90,
      risk: "high" as Leak["risk"],
      finding: `Charged twice: ${d.dates[0].toLocaleDateString("en-GB")} and ${d.dates[1].toLocaleDateString("en-GB")}.`,
      action: "Request a refund",
    })),
  ]
    .sort((a, b) => b.monthlyWaste - a.monthlyWaste)
    .slice(0, 6);

  // Timeline: real duplicates and recurring charges, plus one real
  // forward-looking projection from the analyzer's own savings math.
  const timeline: TimelineEvent[] = [
    ...latest.duplicates.slice(0, 2).map((d, i) => ({
      id: `t-dup-${i}`,
      when: d.dates[1].toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      label: "Duplicate",
      title: "Duplicate payment detected",
      detail: `${d.merchant} charged twice, ${d.dates[0].toLocaleDateString("en-GB")} and ${d.dates[1].toLocaleDateString("en-GB")}.`,
      amount: Math.round(d.amount),
      tone: "detected" as const,
    })),
    ...recurringSorted.slice(0, 2).map((rc, i) => ({
      id: `t-rec-${i}`,
      when: latest.monthLabels.at(-1) ?? "This period",
      label: "Recurring",
      title: "Recurring charge found",
      detail: `${rc.merchant} — ${rc.count}× charged, ${cur} ${Math.round(rc.monthly).toLocaleString()}/mo.`,
      amount: Math.round(rc.monthly),
      tone: "found" as const,
    })),
    {
      id: "t-potential",
      when: "Ongoing",
      label: "Projection",
      title: "Potential savings unlocked",
      detail: `Following your savings plan frees ${cur} ${Math.round(latest.potentialMonthlySaving).toLocaleString()} per month with no lifestyle change.`,
      amount: Math.round(latest.potentialMonthlySaving * 12),
      tone: "potential" as const,
    },
  ];

  const insights: Insight[] = latest.advice.slice(0, 4).map((a, i) => ({
    id: `insight-${i}`,
    message: a.title,
    sub: a.detail,
    impact: a.monthlySaving > 0 ? `Save ${cur} ${Math.round(a.monthlySaving).toLocaleString()}/mo` : "On track",
  }));

  return {
    healthScore,
    healthScoreDeltaLabel,
    savingsPrediction30d: Math.round(latest.potentialMonthlySaving),
    txnCount: latest.txnCount,
    scanPhaseDetails,
    monthlySpend,
    latestMonthSpend: Math.round(latestMonthSpend),
    spendDeltaLabel,
    aiSavingsSpark,
    detectedLeaksCount: latest.recurring.length + latest.duplicates.length,
    detectedLeaksMonthly: Math.round(latest.unwantedTotal / latest.months),
    leaksByCategory,
    subscriptionsCount: subscriptionRecurring.length,
    subscriptionsMonthly: Math.round(subscriptionRecurring.reduce((s, r) => s + r.monthly, 0)),
    cashFlowSpark,
    topRecommendation: topAdvice ? { title: topAdvice.title, detail: topAdvice.detail } : null,
    leaks: leakSources,
    timeline,
    insights,
  };
}
