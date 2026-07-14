"use client";

import { motion } from "framer-motion";
import {
  Droplets,
  Repeat2,
  ReceiptText,
  PiggyBank,
  LineChart,
  Umbrella,
  Rocket,
  Target,
  Sparkles,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { AreaSpark, Bars } from "@/components/ui/charts";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import { cashFlow, spendingByMonth } from "@/lib/data";

const hover = { y: -4 };
const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

/** The living widget grid of the command center. */
export function Widgets() {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" stagger={0.06}>
      {/* Monthly spending — spans 2 */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6 sm:col-span-2"
        aria-label="Monthly spending"
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-graphite">
              <ReceiptText className="h-4 w-4" />
            </span>
            <h3 className="text-[14px] font-semibold text-graphite">Monthly Spending</h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
            −5.1% vs June
          </span>
        </header>
        <div className="mt-4 flex items-baseline gap-2">
          <AnimatedNumber value={7980} prefix="AED " className="text-[30px] font-bold tabular-nums tracking-tight text-graphite" />
          <span className="text-[12.5px] text-quiet">spent in July</span>
        </div>
        <Bars
          className="mt-4"
          height={110}
          data={spendingByMonth.map((d, i) => ({
            label: d.m,
            value: d.spend,
            accent: i === spendingByMonth.length - 1,
          }))}
        />
      </motion.article>

      {/* AI savings */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6"
        aria-label="AI savings"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-soft text-lime-deep">
            <PiggyBank className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">AI Savings</h3>
        </header>
        <AnimatedNumber value={1248} prefix="AED " className="mt-4 block text-[26px] font-bold tabular-nums tracking-tight text-emerald-600" />
        <p className="text-[12px] text-quiet">protected this month</p>
        <div className="mt-3 h-12">
          <AreaSpark data={spendingByMonth.map((d) => d.saved)} width={260} height={48} className="h-full w-full" />
        </div>
      </motion.article>

      {/* Detected leaks */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6"
        aria-label="Detected leaks"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-risk-soft text-risk">
            <Droplets className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">Detected Leaks</h3>
        </header>
        <div className="mt-4 flex items-baseline gap-2">
          <AnimatedNumber value={9} className="text-[26px] font-bold tabular-nums text-graphite" />
          <span className="text-[12px] font-semibold text-risk">−AED 963/mo</span>
        </div>
        <div className="mt-3 space-y-1.5 text-[12px] font-medium">
          <div className="flex justify-between text-slate-ink"><span>High risk</span><span className="tabular-nums text-risk">3</span></div>
          <div className="flex justify-between text-slate-ink"><span>Medium</span><span className="tabular-nums text-amber-signal">4</span></div>
          <div className="flex justify-between text-slate-ink"><span>Low</span><span className="tabular-nums text-quiet">2</span></div>
        </div>
      </motion.article>

      {/* Subscriptions */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6"
        aria-label="Subscriptions"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Repeat2 className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">Subscriptions</h3>
        </header>
        <div className="mt-4 flex items-baseline gap-2">
          <AnimatedNumber value={17} className="text-[26px] font-bold tabular-nums text-graphite" />
          <span className="text-[12.5px] text-quiet">active · AED 1,412/mo</span>
        </div>
        <p className="mt-3 rounded-xl bg-mist px-3 py-2 text-[12px] font-medium text-slate-ink">
          5 unused for 60+ days
        </p>
      </motion.article>

      {/* Cash flow */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6"
        aria-label="Cash flow"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-graphite">
            <LineChart className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">Cash Flow</h3>
        </header>
        <AnimatedNumber value={16520} prefix="+AED " className="mt-4 block text-[26px] font-bold tabular-nums tracking-tight text-graphite" />
        <p className="text-[12px] text-quiet">net this month</p>
        <div className="mt-3 h-12">
          <AreaSpark data={cashFlow} width={260} height={48} color="#14181d" className="h-full w-full" />
        </div>
      </motion.article>

      {/* Emergency fund */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe flex items-center gap-5 rounded-card p-6"
        aria-label="Emergency fund"
      >
        <ProgressRing value={93} size={84} stroke={8} color="#10b981">
          <Umbrella className="h-5 w-5 text-emerald-600" />
        </ProgressRing>
        <div>
          <h3 className="text-[14px] font-semibold text-graphite">Emergency Fund</h3>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-graphite">2.8 <span className="text-[12px] font-medium text-quiet">/ 3 months</span></p>
          <p className="text-[11.5px] font-medium text-emerald-600">Milestone: Aug 9</p>
        </div>
      </motion.article>

      {/* Investment readiness */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe flex items-center gap-5 rounded-card p-6"
        aria-label="Investment readiness"
      >
        <ProgressRing value={71} size={84} stroke={8} color="#b6f04a">
          <Rocket className="h-5 w-5 text-lime-deep" />
        </ProgressRing>
        <div>
          <h3 className="text-[14px] font-semibold text-graphite">Investment Readiness</h3>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-graphite">71%</p>
          <p className="text-[11.5px] font-medium text-quiet">Ready after emergency fund</p>
        </div>
      </motion.article>

      {/* Goals */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6"
        aria-label="Goals"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime-soft text-lime-deep">
            <Target className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">Goals</h3>
        </header>
        <div className="mt-4 space-y-3">
          {[
            { name: "Japan trip", pct: 64 },
            { name: "New MacBook", pct: 88 },
          ].map((g) => (
            <div key={g.name}>
              <div className="flex justify-between text-[12px] font-medium">
                <span className="text-slate-ink">{g.name}</span>
                <span className="tabular-nums text-graphite">{g.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                <motion.div
                  className="h-full rounded-full bg-emerald-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${g.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.article>

      {/* AI recommendation — accent card */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="relative overflow-hidden rounded-card bg-gradient-to-br from-emerald-600 to-emerald-800 p-6 text-white shadow-luxe"
        aria-label="AI recommendation"
      >
        <div aria-hidden className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-lime-electric/25 blur-[50px]" />
        <header className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-lime-electric">
            <Sparkles className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold">Top Recommendation</h3>
        </header>
        <p className="relative mt-4 text-[14px] font-medium leading-relaxed text-white/90">
          Seal the 3 high-risk leaks and you&apos;ll hit your Japan trip goal{" "}
          <span className="font-bold text-lime-electric">7 weeks early.</span>
        </p>
        <button
          type="button"
          className="relative mt-4 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-emerald-700 transition-transform hover:scale-[1.03] active:scale-95"
        >
          Do it for me →
        </button>
      </motion.article>
    </RevealGroup>
  );
}
