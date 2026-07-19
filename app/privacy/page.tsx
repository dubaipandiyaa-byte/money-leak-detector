import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Money Leak Detector handles your bank statement and financial data — in plain language.",
};

const UPDATED = "18 July 2026";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow">Legal · Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[14px] text-quiet">Last updated {UPDATED}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-ink">
            Money Leak Detector is currently in <strong className="font-semibold text-graphite">Beta</strong>.
            This policy explains exactly what happens to your data today,
            written in plain language rather than legal boilerplate. If
            anything here changes as the product grows, we&apos;ll update
            this page and the date above.
          </p>
        </div>

        <div className="card-luxe mb-8 rounded-card-lg p-6 sm:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-emerald-600">
            The short version
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-slate-ink">
            <li>
              • Your bank statement is read and analyzed <strong className="font-semibold text-graphite">entirely inside your own browser</strong>. It is never uploaded, transmitted, or sent to any server we operate.
            </li>
            <li>
              • If you create an account, we store your email address and use Supabase Auth to manage sign-in. We never see or store your password — Supabase handles authentication and only we can access rows tied to your account, enforced by row-level security at the database level.
            </li>
            <li>
              • Your analysis is always saved instantly in your browser&apos;s local storage. If you&apos;re signed in, it is also saved to your private account so you can reach it from any device.
            </li>
            <li>
              • We do not use analytics, tracking cookies, or advertising pixels on this site.
            </li>
          </ul>
        </div>

        <section className="space-y-10 text-[15px] leading-relaxed text-slate-ink">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">1. What data you give us</h2>
            <p className="mt-3">
              When you upload a bank statement (PDF or CSV), the file is read
              directly in your browser using client-side code. We do not
              operate a server endpoint that receives, stores, or has access
              to the contents of your statement — the analysis (categorizing
              transactions, detecting duplicates and recurring charges,
              calculating your savings plan) all happens on your device.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">2. Where your analysis is stored</h2>
            <p className="mt-3">
              To save you from re-uploading your statement every time you
              refresh the page, we always keep your most recent analysis
              result in your browser&apos;s <code className="rounded bg-mist px-1.5 py-0.5 text-[13px]">localStorage</code> —
              a standard browser storage mechanism that lives on your device
              and is cleared when you clear your browser data. If you&apos;re
              signed in, the full analysis is also written to a Postgres
              database we operate, protected by row-level security so that
              only your own account can ever read, list, or delete your
              reports — not other users, and not us through the application
              itself.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">3. Accounts and authentication</h2>
            <p className="mt-3">
              Money Leak Detector offers real email/password accounts,
              handled by Supabase Auth. Creating an account is optional —
              you can analyze a statement without one — but signing in lets
              your reports follow you across devices. Passwords are never
              stored or visible to us in plain text; Supabase manages
              credential storage and session security on our behalf.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">4. Cookies and tracking</h2>
            <p className="mt-3">
              This site does not use analytics services, tracking cookies,
              third-party advertising pixels, or session-recording tools. We
              are not currently measuring your usage of this site at all.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">5. Downloaded reports</h2>
            <p className="mt-3">
              The PDF report you can generate and download is built entirely
              in your browser and saved directly to your device through your
              browser&apos;s normal download mechanism. We never see or
              receive a copy of it.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">6. Beta status and future changes</h2>
            <p className="mt-3">
              As Money Leak Detector moves beyond Beta, we may introduce
              further features such as direct bank integrations. Any such
              change that involves your financial data leaving your device
              in a new way will be explained clearly, will require your
              explicit action to enable, and this policy will be updated in
              advance to reflect it — we will not change this behavior
              silently.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">7. Who runs this</h2>
            <p className="mt-3">
              Money Leak Detector is built by DONRITHIK LABS. As a Beta
              product we don&apos;t yet have a dedicated support channel set
              up — a proper contact method will be added here before general
              availability.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
