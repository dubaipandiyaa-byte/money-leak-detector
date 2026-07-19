"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pricing } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing</p>
          <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Free during Beta. No catch.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
            Every feature that exists today is on the Free plan. Paid tiers below are
            planned for after Beta and aren&apos;t available to purchase yet.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid items-stretch gap-6 md:grid-cols-3" stagger={0.12}>
          {pricing.map((plan) => (
            <motion.div
              key={plan.name}
              variants={revealItem}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className={
                plan.featured
                  ? "relative flex flex-col rounded-card-lg bg-gradient-to-b from-graphite to-[#20262d] p-8 text-white shadow-luxe-lg"
                  : "card-luxe relative flex flex-col rounded-card-lg p-8"
              }
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-lime-electric px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-graphite shadow-glow-lime">
                  Available now
                </span>
              )}
              <p className={`text-[14px] font-semibold ${plan.featured ? "text-lime-electric" : "text-emerald-600"}`}>
                {plan.name}
              </p>
              <p className={`mt-1 text-[13px] ${plan.featured ? "text-white/60" : "text-quiet"}`}>
                {plan.tagline}
              </p>
              <div className="mt-6 flex items-baseline gap-1.5">
                {plan.price !== "—" && (
                  <span className={`text-[15px] font-semibold ${plan.featured ? "text-white/70" : "text-slate-ink"}`}>AED</span>
                )}
                <span className="text-[52px] font-bold leading-none tracking-tight tabular-nums">
                  {plan.price}
                </span>
                <span className={`text-[13px] ${plan.featured ? "text-white/60" : "text-quiet"}`}>
                  {plan.price === "—" ? plan.period : `/${plan.period}`}
                </span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <span
                      className={`mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full ${
                        plan.featured ? "bg-lime-electric/20 text-lime-electric" : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className={plan.featured ? "text-white/85" : "text-slate-ink"}>{f}</span>
                  </li>
                ))}
              </ul>

              {plan.comingSoon ? (
                <button
                  type="button"
                  disabled
                  className="mt-8 block w-full cursor-not-allowed rounded-full bg-mist py-3.5 text-center text-[14.5px] font-semibold text-quiet"
                >
                  {plan.cta}
                </button>
              ) : (
                <MagneticButton
                  href="/analyze"
                  className={`mt-8 block w-full rounded-full py-3.5 text-center text-[14.5px] font-semibold transition-all ${
                    plan.featured
                      ? "bg-lime-electric text-graphite shadow-glow-lime hover:brightness-105"
                      : "bg-graphite text-white hover:shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)]"
                  }`}
                >
                  {plan.cta}
                </MagneticButton>
              )}
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} blur={false} y={12}>
          <p className="mt-10 text-center text-[13px] text-quiet">
            No card required · Nothing is ever uploaded to analyze your statement
          </p>
        </Reveal>
      </div>
    </section>
  );
}
