"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { LeakCard } from "@/components/leaks/LeakCard";
import { leaks, totalYearlySavings } from "@/lib/data";

/** Signature section: live wall of detected leaks, each individually sealable. */
export function LeakShowcase() {
  return (
    <section id="leak-detection" className="relative bg-white py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-xl">
            <p className="eyebrow">Money Leak Detection</p>
            <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
              This is what your money looks like{" "}
              <span className="headline-gradient">escaping.</span>
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
              A real scan, in the real interface. Every card is a live leak with
              the evidence, the math, and a one-click fix.{" "}
              <span className="font-semibold text-graphite">Try sealing one.</span>
            </p>
          </Reveal>

          <Reveal delay={0.15} className="card-luxe rounded-card px-6 py-5">
            <p className="text-[12px] font-medium text-quiet">
              Total recoverable this year
            </p>
            <AnimatedNumber
              value={totalYearlySavings}
              prefix="AED "
              className="text-[34px] font-bold tabular-nums tracking-tight text-emerald-600"
            />
            <p className="mt-1 text-[12px] text-quiet">
              across {leaks.length} active leaks · zero lifestyle change
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {leaks.map((leak, i) => (
            <LeakCard key={leak.id} leak={leak} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
