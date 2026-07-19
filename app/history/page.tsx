import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { DeleteReportButton } from "@/components/history/DeleteReportButton";
import { createClient } from "@/lib/supabase/server";
import { listUserReports } from "@/lib/supabase/reports";

export const metadata: Metadata = {
  title: "Your Reports",
};

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/history");

  const reports = await listUserReports(supabase);

  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Command Center →" ctaHref="/dashboard" />

      <main className="relative mx-auto max-w-4xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-10">
          <p className="eyebrow">Your reports</p>
          <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-ivory sm:text-[38px]">
            Every statement you&apos;ve analyzed.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-parchment">
            Saved to your account — reachable from any device you sign in on.
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="card-luxe rounded-card-lg p-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mist text-ash">
              <FileText className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-[19px] font-bold tracking-tight text-ivory">
              Nothing here yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-parchment">
              Analyze your first statement and it&apos;ll be saved to your account automatically.
            </p>
            <Link
              href="/analyze"
              className="mt-6 inline-flex items-center gap-2 rounded-full btn-gold px-6 py-3 text-[13.5px] font-semibold"
            >
              Analyze a statement
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((r) => (
              <div key={r.id} className="group relative">
                <Link
                  href={`/history/${r.id}`}
                  className="card-luxe flex flex-col rounded-card p-5 transition-shadow hover:shadow-luxe-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-ivory">{r.fileName}</p>
                      <p className="text-[11.5px] text-ash">
                        {r.monthLabels.join(" – ")} ·{" "}
                        {r.createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ash transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-mist/70 px-4 py-3">
                    <div>
                      <p className="text-[10.5px] font-medium text-ash">Kept</p>
                      <p className={`text-[15px] font-bold tabular-nums ${r.net >= 0 ? "text-ivory" : "text-risk"}`}>
                        {r.currency} {Math.round(r.net).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10.5px] font-medium text-ash">Savings rate</p>
                      <p className="text-[15px] font-bold tabular-nums text-emerald-600">{r.savingsRate}%</p>
                    </div>
                  </div>
                </Link>
                <DeleteReportButton reportId={r.id} fileName={r.fileName} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
