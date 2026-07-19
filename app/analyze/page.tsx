import type { Metadata } from "next";
import { NoirHeader } from "@/components/ui/NoirHeader";
import { AnalyzeFlow } from "@/components/analyze/AnalyzeFlow";
import { UploadExtras } from "@/components/analyze/UploadExtras";

export const metadata: Metadata = {
  title: "Upload Your Bank Statement",
  description:
    "Upload your bank statement and let DONRITHIK AI securely analyze your spending, detect money leaks, subscriptions, recurring expenses, hidden patterns, and personalized savings opportunities.",
};

export default function AnalyzePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-noir">
      {/* ambient gold light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.1),transparent)]"
      />

      <NoirHeader ctaLabel="Dashboard →" ctaHref="/dashboard" />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow-gold">DONRITHIK AI · Statement Analysis</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory sm:text-[46px]">
            Upload Your{" "}
            <span className="headline-gold">Bank Statement</span>
          </h1>
          <p className="mt-4 text-[15.5px] leading-relaxed text-parchment">
            Your AI Financial Intelligence Engine will securely analyze your
            spending, detect money leaks, subscriptions, recurring expenses,
            hidden patterns, and personalized savings opportunities.
          </p>
        </div>

        <AnalyzeFlow uploadExtras={<UploadExtras />} />
      </main>
    </div>
  );
}
