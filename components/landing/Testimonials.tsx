"use client";

import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

/**
 * Honest replacement for a testimonials section: we're pre-launch and have
 * no real customer reviews yet, so this doesn't invent any. No fabricated
 * quotes, names, or "trusted by" logos belong here — only an honest
 * invitation to be one of the first real users.
 */
export function Testimonials() {
  return (
    <section className="relative bg-white py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Sparkles className="h-5.5 w-5.5" strokeWidth={2.2} />
          </span>
          <p className="eyebrow mt-6">Beta</p>
          <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            You&apos;d be one of our first real users.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-slate-ink">
            Money Leak Detector just launched. There are no reviews yet — because
            there hasn&apos;t been time to earn any. Upload a real statement and
            see for yourself what it finds; we&apos;d rather earn your trust than
            claim it.
          </p>
          <MagneticButton
            href="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_40px_-8px_rgba(20,24,29,0.5)] transition-all hover:shadow-[0_20px_48px_-8px_rgba(20,24,29,0.6)]"
          >
            Analyze My Statement
            <span className="text-lime-electric">→</span>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
