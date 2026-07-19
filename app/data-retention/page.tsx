import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Data Retention & Deletion",
  description: "What Money Leak Detector keeps, for how long, and how to delete it.",
};

const UPDATED = "19 July 2026";

export default function DataRetentionPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow">Legal · Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory sm:text-[44px]">
            Data Retention &amp; Deletion
          </h1>
          <p className="mt-3 text-[14px] text-ash">Last updated {UPDATED}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-parchment">
            This page explains exactly what&apos;s kept, where, for how long,
            and how you delete it — matching what the product actually does
            today.
          </p>
        </div>

        <div className="card-luxe mb-8 rounded-card-lg p-6 sm:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold-bright">
            The short version
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-parchment">
            <li>
              • Not signed in: your analysis lives only in your browser&apos;s local storage. We never see it.
            </li>
            <li>
              • Signed in: your analysis is also saved to your account so it&apos;s reachable from any device, until you delete it.
            </li>
            <li>
              • You can delete any saved report yourself, instantly, from your Reports page.
            </li>
            <li>
              • To delete your account entirely, contact us — we&apos;ll do it by hand.
            </li>
          </ul>
        </div>

        <section className="space-y-10 text-[15px] leading-relaxed text-parchment">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">1. If you never sign in</h2>
            <p className="mt-3">
              Your most recent analysis is kept in your browser&apos;s{" "}
              <code className="rounded bg-mist px-1.5 py-0.5 text-[13px]">localStorage</code> —
              a standard browser storage mechanism that lives only on your
              device. It&apos;s cleared when you clear your browser data, or
              overwritten the next time you analyze a statement. We have no
              copy of it anywhere.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">2. If you sign in</h2>
            <p className="mt-3">
              The analysis (categorized transactions, totals, and the report
              you see — not the original file) is additionally saved to a
              database row tied to your account. It&apos;s kept until you
              delete it. There is currently no automatic expiry — reports
              don&apos;t disappear on their own.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">3. Deleting a report</h2>
            <p className="mt-3">
              Every saved report on your Reports page has a delete control.
              Deleting a report removes that row permanently and immediately
              — it is not recoverable afterward. This is the same self-service
              deletion available to you at any time, with no need to contact
              anyone.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">4. Deleting your account</h2>
            <p className="mt-3">
              We don&apos;t yet have a self-service &quot;delete my account&quot;
              button — this is a Beta product and that flow hasn&apos;t been
              built yet.{" "}
              <a href="/contact" className="font-semibold text-gold-bright underline underline-offset-2">
                Contact us
              </a>{" "}
              and ask to delete your account; we&apos;ll remove your saved
              reports and your login itself by hand. We won&apos;t ask you to
              justify the request.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">5. What we don&apos;t keep</h2>
            <p className="mt-3">
              We don&apos;t store your original statement file in any form.
              We don&apos;t use analytics or tracking cookies, so there&apos;s
              no separate behavioral data trail to delete. We don&apos;t sell
              or share your data with anyone.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
