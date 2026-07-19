import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "AI Disclaimer",
  description: "How the AI in Money Leak Detector actually works, and its limits.",
};

const UPDATED = "19 July 2026";

export default function AiDisclaimerPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow">Legal · Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            AI Disclaimer
          </h1>
          <p className="mt-3 text-[14px] text-quiet">Last updated {UPDATED}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-ink">
            &quot;DONRITHIK AI&quot; is our product&apos;s name for the analysis
            engine and assistant in this app. This page describes what it
            actually is, in plain terms, so you know exactly what you&apos;re
            relying on.
          </p>
        </div>

        <div className="card-luxe mb-8 rounded-card-lg p-6 sm:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-emerald-600">
            The short version
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-ink">
            <li>
              • Statement analysis is rule-based pattern matching, not a general-purpose language model.
            </li>
            <li>
              • The &quot;AI Guardian&quot; chat is also rule-based — it only answers using your own report&apos;s real numbers.
            </li>
            <li>
              • Nothing here is financial, tax, or legal advice.
            </li>
            <li>
              • Automatic parsing can occasionally misread an unusual statement format — always check important figures yourself.
            </li>
          </ul>
        </div>

        <section className="space-y-10 text-[15px] leading-relaxed text-slate-ink">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">1. How the analysis actually works</h2>
            <p className="mt-3">
              Your statement&apos;s text is parsed and matched against a set
              of pattern-based rules — recurring-charge detection, duplicate-
              payment detection, category keyword matching, and currency
              detection. This is deterministic pattern matching we built and
              can inspect line by line, not a trained machine-learning model
              making probabilistic guesses.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">2. The AI Guardian chat</h2>
            <p className="mt-3">
              The chat assistant on your dashboard answers using simple
              keyword matching against your own most recently analyzed
              report — it is not a general conversational AI and cannot
              discuss anything outside the numbers already in your report.
              If you haven&apos;t analyzed a statement yet, it will tell you so
              rather than inventing an answer.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">3. Accuracy and limitations</h2>
            <p className="mt-3">
              Bank statement layouts vary widely. While we&apos;ve tested
              against real statements from multiple banks, an unusual or
              unfamiliar layout can occasionally cause a transaction to be
              missed, misdated, or miscategorized. Always verify important
              figures — totals, dates, and amounts — against your actual bank
              statement before acting on them.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">4. Not financial advice</h2>
            <p className="mt-3">
              Money Leak Detector is a financial intelligence and analysis
              tool, not a licensed financial advisor, accountant, or tax
              professional. Nothing it generates — spending breakdowns,
              savings estimates, or written suggestions — constitutes
              professional financial advice. Decisions about your money
              remain entirely your own responsibility.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">5. No automated actions on your behalf</h2>
            <p className="mt-3">
              The product never cancels a subscription, requests a refund, or
              moves money for you. Every &quot;fix&quot; it surfaces is
              something you carry out yourself with your bank or the
              merchant — the app gives you the exact numbers and steps, not
              an automated transaction.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
