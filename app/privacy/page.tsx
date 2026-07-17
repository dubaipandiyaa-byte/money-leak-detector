import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Money Leak Detector handles your bank statement and financial data — in plain language.",
};

const UPDATED = "17 July 2026";

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
              • We do not currently have user accounts, so we hold no login credentials, email addresses, or profile data tied to your identity.
            </li>
            <li>
              • Your most recent analysis is saved in your browser&apos;s local storage only, so it survives a page refresh. It stays on your device.
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
              refresh the page, we keep your most recent analysis result in
              your browser&apos;s <code className="rounded bg-mist px-1.5 py-0.5 text-[13px]">localStorage</code>.
              This is a standard browser storage mechanism that lives only on
              your device — it is not synced to any account, not accessible
              to us, and not sent anywhere over the network. It is cleared
              when you clear your browser data, or when you press
              &quot;Analyze another statement&quot;.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-graphite">3. Accounts and authentication</h2>
            <p className="mt-3">
              Money Leak Detector does not currently have a real
              authentication system. There is no sign-up, no password, and
              no server-side account database. Any &quot;demo&quot; or
              &quot;preview&quot; areas of the product are clearly labeled as
              such and do not require — or store — any personal credentials.
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
              As Money Leak Detector moves beyond Beta, we expect to
              introduce real accounts, cloud-based history across devices,
              and possibly optional integrations. Any such change that
              involves your financial data leaving your device will be
              explained clearly, will require your explicit action to
              enable, and this policy will be updated in advance to reflect
              it — we will not change this behavior silently.
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
