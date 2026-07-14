"use client";

import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function FinalCTA() {
  return (
    <section className="relative px-6 py-28">
      <Reveal>
        <div className="noise relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-graphite via-[#1b2229] to-[#0f2e24] px-8 py-20 text-center text-white shadow-luxe-lg sm:px-16">
          <div
            aria-hidden
            className="absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[100px]"
          />
          <div
            aria-hidden
            className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-lime-electric/15 blur-[90px]"
          />

          <p className="relative text-[13px] font-semibold uppercase tracking-[0.18em] text-lime-electric">
            Your money is leaking right now
          </p>
          <h2 className="relative mx-auto mt-5 max-w-2xl text-balance text-[36px] font-bold leading-[1.08] tracking-[-0.025em] sm:text-[52px]">
            Find out where — in the next two minutes.
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/70">
            The average first scan surfaces{" "}
            <AnimatedNumber value={4980} prefix="AED " className="font-semibold text-white tabular-nums" />{" "}
            per year in recoverable leaks. Yours is waiting.
          </p>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-lime-electric px-8 py-4 text-[15.5px] font-bold text-graphite shadow-glow-lime transition-all hover:brightness-105"
            >
              Start Free — Find My Leaks
            </MagneticButton>
            <MagneticButton
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-4 text-[15.5px] font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/15"
            >
              Compare plans
            </MagneticButton>
          </div>

          <p className="relative mt-8 text-[12.5px] text-white/50">
            No credit card · Read-only access · Disconnect anytime
          </p>
        </div>
      </Reveal>
    </section>
  );
}
