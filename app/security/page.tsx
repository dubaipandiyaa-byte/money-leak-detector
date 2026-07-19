import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Security",
  description: "How Money Leak Detector is actually built and secured — in plain language.",
};

const UPDATED = "19 July 2026";

export default function SecurityPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-3xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-12">
          <p className="eyebrow">Legal · Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory sm:text-[44px]">
            Security
          </h1>
          <p className="mt-3 text-[14px] text-ash">Last updated {UPDATED}</p>
          <p className="mt-6 text-[16px] leading-relaxed text-parchment">
            This page describes what actually exists in the product today —
            not aspirational claims. We are not SOC 2, ISO 27001, or PCI-DSS
            certified, and we don&apos;t claim to be. If that changes, this
            page will say so with the date above updated.
          </p>
        </div>

        <div className="card-luxe mb-8 rounded-card-lg p-6 sm:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-gold-bright">
            The short version
          </h2>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-parchment">
            <li>
              • Your bank statement is parsed entirely in your browser. It is never uploaded to any server we operate.
            </li>
            <li>
              • If you sign in, only the resulting analysis — not the original file — is stored, protected by row-level security so only your account can ever read it.
            </li>
            <li>
              • All traffic to this site runs over HTTPS/TLS.
            </li>
            <li>
              • We don&apos;t use analytics trackers or advertising pixels.
            </li>
          </ul>
        </div>

        <section className="space-y-10 text-[15px] leading-relaxed text-parchment">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">1. Where your statement is processed</h2>
            <p className="mt-3">
              PDF and CSV parsing happens with client-side JavaScript running
              in your browser. There is no server-side upload endpoint that
              receives your statement file — the file itself never leaves
              your device.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">2. Authentication</h2>
            <p className="mt-3">
              Accounts and sign-in are handled by Supabase Auth. Your password
              is sent directly to Supabase over TLS and is never visible to,
              stored by, or logged by our own application code. Sessions are
              managed through secure cookies refreshed on every request.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">3. Database access — Row Level Security</h2>
            <p className="mt-3">
              Saved reports live in a Postgres database (via Supabase) with
              Row Level Security enabled. Every read, write, and delete
              policy on that table is scoped to <code className="rounded bg-mist px-1.5 py-0.5 text-[13px]">auth.uid() = user_id</code> —
              enforced by the database itself, not by application logic that
              could contain a bug. Our application never uses a service-role
              or admin key that could bypass these rules; the same
              restricted, anon-scoped key your browser uses is all our
              servers use too.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">4. No file storage</h2>
            <p className="mt-3">
              We don&apos;t use a file-storage bucket of any kind. Your
              original statement file is never stored anywhere by us, in any
              form — only the derived analysis (categorized transactions,
              totals, and the report you see) is saved, and only if you&apos;re
              signed in.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">5. Browser-level protections</h2>
            <p className="mt-3">
              This site sends standard security headers on every response:
              protection against clickjacking, MIME-sniffing, and forced
              HTTPS on repeat visits. We keep dependencies current and monitor
              for known vulnerabilities in the libraries we rely on.
            </p>
          </div>

          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-ivory">6. Reporting a security issue</h2>
            <p className="mt-3">
              If you believe you&apos;ve found a security vulnerability, please{" "}
              <a href="/contact" className="font-semibold text-gold-bright underline underline-offset-2">
                contact us
              </a>{" "}
              directly rather than disclosing it publicly. We&apos;ll respond
              and address genuine reports as quickly as we can.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
