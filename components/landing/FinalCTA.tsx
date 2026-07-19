"use client";

import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function FinalCTA() {
  return (
    <section className="relative bg-noir px-6 py-28">
      <Reveal>
        <div className="card-noir-gold relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] px-8 py-20 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.16),transparent)]"
          />
          <p className="relative eyebrow-gold">Your money is leaking right now</p>
          <h2 className="relative mx-auto mt-5 max-w-3xl text-balance text-[52px] font-bold leading-[1.06] tracking-[-0.025em] text-ivory">
            Ready to stop money leaks and{" "}
            <span className="headline-gold">build wealth?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-parchment">
            Upload a real statement and DONRITHIK AI reads every transaction —
            recurring charges, duplicate payments, fees — free during Beta.
          </p>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/analyze"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-9 py-4 text-[15px] font-bold uppercase tracking-[0.08em]"
            >
              Start Detecting Now
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton
              href="#pricing"
              className="glass-noir inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-ivory transition-colors hover:border-[rgba(212,175,55,0.35)]"
            >
              Compare plans
            </MagneticButton>
          </div>

          <p className="relative mt-8 text-[12.5px] text-ash">
            No credit card · Nothing uploaded · Free during Beta
          </p>
        </div>
      </Reveal>
    </section>
  );
}
