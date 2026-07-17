import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using Money Leak Detector while it is in Beta.",
};

const UPDATED = "17 July 2026";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow">Legal · Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Terms of Service
          </h1>
          <p className="mt-3 text-[14px] text-quiet">Last updated {UPDATED}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-ink">
            By using Money Leak Detector (&quot;the product&quot;), currently
            offered as a <strong className="font-semibold text-graphite">Beta</strong>, you
            agree to the terms below. Please read the Beta status section
            carefully — it materially affects what you should expect from
            the product today.
          </p>
        </div>

        <section className="space-y-10 text-[15px] leading-relaxed text-slate-ink">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">1. Beta status</h2>
            <p className="mt-3">
              Money Leak Detector is under active development. Features may
              change, break, or be removed without notice. Some areas of the
              product — most notably the &quot;Demo Dashboard&quot; — display
              illustrative sample data rather than your real financial
              information, and are clearly labeled as such. Do not treat
              anything in a demo-labeled area as reflecting your actual
              finances.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">2. Not financial advice</h2>
            <p className="mt-3">
              Money Leak Detector is a financial intelligence and analysis
              tool. It is <strong className="font-semibold text-graphite">not</strong> a
              licensed financial advisor, accountant, or tax professional,
              and nothing it generates — including spending breakdowns,
              savings estimates, or written recommendations — constitutes
              professional financial advice. Decisions about your money
              remain entirely your own responsibility. Consult a qualified
              professional for advice specific to your situation.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">3. Your data and your statement</h2>
            <p className="mt-3">
              You are solely responsible for the bank statement or financial
              document you choose to analyze. As described in our{" "}
              <a href="/privacy" className="font-semibold text-emerald-600 underline underline-offset-2">
                Privacy Policy
              </a>
              , the file is processed entirely in your browser and is not
              transmitted to us. You should still only use this product on a
              device you trust and control.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">4. No guarantee of accuracy</h2>
            <p className="mt-3">
              The analysis is generated automatically from the text of your
              uploaded statement using pattern-matching and heuristics. Bank
              statement formats vary widely, and the product may
              occasionally misread a transaction, misclassify a category, or
              miss an edge case. Always verify important figures against
              your actual bank statement before acting on them.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">5. No real accounts yet</h2>
            <p className="mt-3">
              The product does not currently offer real user accounts,
              authentication, or cross-device sync. Any interface element
              that resembles a sign-in is, during Beta, a link to the demo
              experience rather than a functioning login — this is called
              out directly in the product.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">6. Acceptable use</h2>
            <p className="mt-3">
              Use the product only for lawful purposes and only to analyze
              statements you are authorized to access — your own, or those
              you have explicit permission to review. Do not attempt to
              disrupt, reverse-engineer for malicious purposes, or overload
              the service.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">7. No warranty</h2>
            <p className="mt-3">
              The product is provided &quot;as is&quot; during this Beta
              period, without warranties of any kind, express or implied,
              including fitness for a particular purpose. DONRITHIK LABS is
              not liable for financial decisions made based on the
              product&apos;s output.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">8. Changes to these terms</h2>
            <p className="mt-3">
              As the product moves from Beta toward general availability,
              these terms will be revised to reflect real accounts, data
              handling, and any paid plans that are introduced. The date at
              the top of this page will always reflect the latest revision.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
