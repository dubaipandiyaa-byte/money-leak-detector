import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { AnalyzeFlow } from "@/components/analyze/AnalyzeFlow";

export const metadata: Metadata = {
  title: "Analyze Your Statement",
  description:
    "Upload your bank statement and let DONRITHIK AI build your full money report — income, spending, routine vs. unwanted spends, and a personalized savings plan.",
};

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />

      <SimpleHeader ctaLabel="Demo Dashboard →" ctaHref="/dashboard" />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow">DONRITHIK AI · Statement Analysis</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Upload your statement.
            <br />
            <span className="headline-gradient">Know exactly where it all went.</span>
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-slate-ink">
            Income, spending, routine costs, unwanted leaks — and a personal
            plan to keep more of what you earn. All in about five seconds.
          </p>
        </div>

        <AnalyzeFlow />
      </main>
    </div>
  );
}
