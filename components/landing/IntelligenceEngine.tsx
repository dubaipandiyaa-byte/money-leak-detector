"use client";

import { motion } from "framer-motion";
import {
  Repeat2,
  CopyX,
  EyeOff,
  Wallet,
  Activity,
  Sparkles,
} from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AreaSpark } from "@/components/ui/charts";
import { Aurora } from "@/components/ui/Aurora";

/** Bento grid: the six intelligence capabilities, each a living card. */
export function IntelligenceEngine() {
  return (
    <section id="intelligence" className="relative overflow-hidden py-28">
      <Aurora variant="section" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">AI Intelligence Engine</p>
          <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            One engine. Six ways your money stops escaping.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
            Every capability runs continuously in the background — you only hear
            from it when there&apos;s money on the table.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-5 md:grid-cols-6" stagger={0.08}>
          {/* Subscription scanner — wide */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="card-luxe relative overflow-hidden rounded-card-lg p-7 md:col-span-4"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Repeat2 className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight text-graphite">
                  Subscription Scanner
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-slate-ink">
                  Every recurring charge is found, priced, and usage-checked.
                  Zombie subscriptions surface with proof — last used, price
                  history, cheaper tiers.
                </p>
              </div>
              <div className="hidden shrink-0 flex-col gap-2 sm:flex">
                {["Netflix · unused 4K tier", "Adobe · 1 of 20 apps used", "FitLab · 11 wks inactive"].map(
                  (t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.18, duration: 0.6 }}
                      className="rounded-xl bg-mist px-3.5 py-2 text-[12px] font-medium text-slate-ink"
                    >
                      {t}
                    </motion.span>
                  )
                )}
              </div>
            </div>
            <div className="mt-6 flex items-baseline gap-2 border-t border-black/[0.05] pt-5">
              <AnimatedNumber value={11496} prefix="AED " className="text-[26px] font-bold tabular-nums text-emerald-600" />
              <span className="text-[13px] text-quiet">average yearly savings surfaced per user</span>
            </div>
          </motion.div>

          {/* Duplicate detection */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="card-luxe relative overflow-hidden rounded-card-lg p-7 md:col-span-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-soft text-amber-signal">
              <CopyX className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="mt-5 text-[19px] font-semibold tracking-tight text-graphite">
              Duplicate Payments
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-ink">
              Same merchant, same amount, seconds apart — caught instantly,
              refund drafted for you.
            </p>
            <div className="mt-5 space-y-1.5">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.4 }}
                  whileInView={{ opacity: i === 1 ? 0.35 : 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[12.5px] font-medium ${
                    i === 0 ? "bg-mist text-graphite" : "bg-risk-soft text-risk line-through"
                  }`}
                >
                  <span>Emirates Fiber</span>
                  <span className="tabular-nums">AED 249.00</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hidden fees */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="card-luxe relative overflow-hidden rounded-card-lg p-7 md:col-span-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-risk-soft text-risk">
              <EyeOff className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="mt-5 text-[19px] font-semibold tracking-tight text-graphite">
              Hidden Fee Detection
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-ink">
              FX spreads, card markups, &quot;service charges&quot; that appeared out of
              nowhere — itemized and challenged.
            </p>
            <div className="mt-5 flex items-baseline gap-2">
              <AnimatedNumber value={37} prefix="AED " className="text-[24px] font-bold tabular-nums text-risk" />
              <span className="text-[12.5px] text-quiet">avg. hidden fees / month</span>
            </div>
          </motion.div>

          {/* Smart budget */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="card-luxe relative overflow-hidden rounded-card-lg p-7 md:col-span-2"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <h3 className="mt-5 text-[19px] font-semibold tracking-tight text-graphite">
              Smart Budget Intelligence
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-slate-ink">
              No envelopes, no guilt. The AI shapes soft budgets around how you
              actually live — then defends them.
            </p>
            <div className="mt-5 h-14">
              <AreaSpark data={[30, 42, 38, 55, 48, 66, 62, 78]} width={300} height={56} className="h-full w-full" />
            </div>
          </motion.div>

          {/* Health score */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="card-luxe relative flex items-center gap-6 overflow-hidden rounded-card-lg p-7 md:col-span-2"
          >
            <ProgressRing value={82} size={104} stroke={9} color="#10b981">
              <div className="text-center">
                <AnimatedNumber value={82} className="text-[24px] font-bold tabular-nums text-graphite" />
                <p className="text-[10px] font-semibold uppercase tracking-wider text-quiet">Score</p>
              </div>
            </ProgressRing>
            <div>
              <span className="mb-2 hidden">placeholder</span>
              <h3 className="text-[19px] font-semibold tracking-tight text-graphite">
                Financial Health Score
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-slate-ink">
                One number for your whole financial life — and exactly what
                moves it up.
              </p>
            </div>
          </motion.div>

          {/* Real-time insights — wide dark card */}
          <motion.div
            variants={revealItem}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative overflow-hidden rounded-card-lg bg-gradient-to-br from-graphite to-[#232b32] p-7 text-white shadow-luxe-lg md:col-span-4"
          >
            <div
              aria-hidden
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-lime-electric/20 blur-[80px]"
            />
            <div className="relative flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-sm">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-lime-electric">
                  <Activity className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">
                  Real-Time AI Insights
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">
                  Not dashboards — conversations. The AI tells you what it saw,
                  what it means, and what it already did about it.
                </p>
              </div>
              <div className="min-w-[260px] flex-1 space-y-2.5">
                {[
                  "“You paid for 3 streaming services — you watched 1.”",
                  "“Your electricity bill will rise next month. Buffer set.”",
                ].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.25, duration: 0.7 }}
                    className="flex items-start gap-2.5 rounded-2xl bg-white/[0.07] px-4 py-3 text-[13px] leading-relaxed text-white/90 ring-1 ring-white/10"
                  >
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-electric" />
                    {t}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
}
