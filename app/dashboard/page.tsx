import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Greeting } from "@/components/dashboard/Greeting";
import { GuardianCard } from "@/components/dashboard/GuardianCard";
import { Widgets } from "@/components/dashboard/Widgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { InsightFeed } from "@/components/dashboard/InsightFeed";
import { LeakGrid } from "@/components/dashboard/LeakGrid";
import { GuardianChat } from "@/components/dashboard/GuardianChat";
import { createClient } from "@/lib/supabase/server";
import { getUserReport, listUserReports } from "@/lib/supabase/reports";
import { buildDashboardData } from "@/lib/dashboardData";

export const metadata: Metadata = {
  title: "Command Center",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const reportList = await listUserReports(supabase);
  const latest = reportList.length > 0 ? await getUserReport(supabase, reportList[0].id) : null;

  const displayName =
    latest?.report.accountName?.split(" ")[0] || user.email?.split("@")[0] || "there";

  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <DashboardNav name={displayName} />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-6">
        <Greeting
          name={displayName}
          potentialSavings={latest ? Math.round(latest.report.potentialMonthlySaving) : 0}
          currency={latest?.report.currency ?? "AED"}
        />

        {!latest ? (
          <div className="card-luxe mt-8 rounded-card-lg p-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Sparkles className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-[20px] font-bold tracking-tight text-graphite">
              Analyze your first statement
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-slate-ink">
              Your Command Center comes to life as soon as you have a real report — leaks, savings,
              and your financial score, all computed from your own statement.
            </p>
            <Link
              href="/analyze"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-graphite px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
            >
              Analyze a statement
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          (() => {
            const data = buildDashboardData(latest.report, reportList);
            const cur = latest.report.currency;
            return (
              <>
                <div className="mt-6">
                  <GuardianCard
                    healthScore={data.healthScore}
                    healthScoreDeltaLabel={data.healthScoreDeltaLabel}
                    savingsPrediction30d={data.savingsPrediction30d}
                    txnCount={data.txnCount}
                    scanPhaseDetails={data.scanPhaseDetails}
                    currency={cur}
                  />
                </div>

                <div className="mt-6">
                  <Widgets data={data} currency={cur} />
                </div>

                <div className="mt-6">
                  <LeakGrid leaks={data.leaks} currency={cur} />
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
                  <Timeline timeline={data.timeline} currency={cur} />
                  <InsightFeed insights={data.insights} />
                </div>
              </>
            );
          })()
        )}
      </main>

      <GuardianChat name={displayName} report={latest?.report ?? null} />
    </div>
  );
}
