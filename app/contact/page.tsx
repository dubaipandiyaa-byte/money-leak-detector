import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with DONRITHIK LABS about Money Leak Detector.",
};

const SUPPORT_EMAIL = "moneyleakdetectorai@gmail.com";

export default function ContactPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Analyze My Statement →" ctaHref="/analyze" />

      <main className="relative mx-auto max-w-2xl px-5 pb-24 pt-12 sm:px-6">
        <div className="mb-10">
          <p className="eyebrow">Beta</p>
          <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Contact Us
          </h1>
          <p className="mt-6 text-[16px] leading-relaxed text-slate-ink">
            Money Leak Detector is a Beta product from DONRITHIK LABS — we
            don&apos;t have a dedicated support team or ticketing system yet,
            just a real inbox someone actually reads.
          </p>
        </div>

        <div className="card-luxe rounded-card-lg p-6 sm:p-8">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-emerald-600">
            Email us directly
          </h2>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-4 inline-flex items-center gap-3 rounded-2xl bg-mist/70 px-5 py-4 text-[15px] font-semibold text-graphite transition-colors hover:bg-mist"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Mail className="h-4 w-4" />
            </span>
            {SUPPORT_EMAIL}
          </a>
          <p className="mt-5 text-[14px] leading-relaxed text-slate-ink">
            Use this for bug reports, security concerns, account or data
            deletion requests, or anything else about the product. We read
            every message ourselves.
          </p>
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-quiet">
          Please don&apos;t include your bank password or full card numbers in
          any message — we&apos;ll never ask for them, and there&apos;s never a
          reason to send them.
        </p>
      </main>

      <Footer />
    </div>
  );
}
