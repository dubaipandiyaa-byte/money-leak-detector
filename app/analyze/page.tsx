import type { Metadata } from "next";
import Link from "next/link";
import { Aurora } from "@/components/ui/Aurora";
import { Logo } from "@/components/ui/Logo";
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

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
        <Link href="/" aria-label="Back to home">
          <Logo />
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist"
        >
          Command Center →
        </Link>
      </header>

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
