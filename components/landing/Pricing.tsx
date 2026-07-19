"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { pricing } from "@/lib/data";

export function Pricing() {
  return (
    <section id="pricing" className="relative bg-noir py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-gold">Pricing</p>
          <h2 className="mt-4 text-balance text-[30px] font-bold sm:text-[36px] lg:text-[44px] leading-tight tracking-[-0.025em] text-ivory">
            Free during Beta. No catch.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-parchment">
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
                  ? "card-noir-gold relative flex flex-col rounded-card-lg p-8"
                  : "card-noir relative flex flex-col rounded-card-lg p-8"
              }
            >
              {plan.featured && (
                <span className="btn-gold absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                  Available now
                </span>
              )}
              <p className={`text-[14px] font-bold uppercase tracking-[0.12em] ${plan.featured ? "text-gold-bright" : "text-gold-dim"}`}>
                {plan.name}
              </p>
              <p className="mt-1 text-[13px] text-ash">{plan.tagline}</p>
              <div className="mt-6 flex items-baseline gap-1.5 text-ivory">
                {plan.price !== "—" && (
                  <span className="text-[22px] font-semibold text-parchment">₹</span>
                )}
                <span className="text-[52px] font-bold leading-none tracking-tight tabular-nums">
                  {plan.price}
                </span>
                <span className="text-[13px] text-ash">
                  {plan.price === "—" ? plan.period : `/${plan.period}`}
                </span>
              </div>

              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px]">
                    <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] text-gold">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    <span className="text-parchment">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.comingSoon ? (
                <button
                  type="button"
                  disabled
                  className="mt-8 block w-full cursor-not-allowed rounded-full border border-white/10 bg-white/[0.03] py-3.5 text-center text-[14.5px] font-semibold text-ash"
                >
                  {plan.cta}
                </button>
              ) : (
                <MagneticButton
                  href="/analyze"
                  className="btn-gold mt-8 block w-full rounded-full py-3.5 text-center text-[14.5px] font-bold uppercase tracking-[0.06em]"
                >
                  {plan.cta}
                </MagneticButton>
              )}
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.2} blur={false} y={12}>
          <p className="mt-10 text-center text-[13px] text-ash">
            No card required · Nothing is ever uploaded to analyze your statement
          </p>
        </Reveal>
      </div>
    </section>
  );
}
