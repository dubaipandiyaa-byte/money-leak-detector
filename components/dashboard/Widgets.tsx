"use client";

import Link from "next/link";
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
import { AreaSpark, Bars } from "@/components/ui/charts";
import { RevealGroup, revealItem } from "@/components/ui/Reveal";
import type { DashboardData } from "@/lib/dashboardData";

const hover = { y: -4 };
const spring = { type: "spring" as const, stiffness: 260, damping: 20 };

interface WidgetsProps {
  data: DashboardData;
  currency: string;
}

/** The living widget grid of the command center, driven by the user's real latest report. */
export function Widgets({ data, currency: cur }: WidgetsProps) {
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
          {data.spendDeltaLabel && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                data.spendDeltaLabel.startsWith("+") ? "bg-risk-soft text-risk" : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {data.spendDeltaLabel}
            </span>
          )}
        </header>
        <div className="mt-4 flex items-baseline gap-2">
          <AnimatedNumber value={data.latestMonthSpend} prefix={`${cur} `} className="text-[30px] font-bold tabular-nums tracking-tight text-graphite" />
          <span className="text-[12.5px] text-quiet">spent last period</span>
        </div>
        <Bars className="mt-4" height={110} data={data.monthlySpend} />
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
        <AnimatedNumber value={data.savingsPrediction30d} prefix={`${cur} `} className="mt-4 block text-[26px] font-bold tabular-nums tracking-tight text-emerald-600" />
        <p className="text-[12px] text-quiet">found in this report</p>
        <div className="mt-3 h-12">
          <AreaSpark data={data.aiSavingsSpark.length ? data.aiSavingsSpark : [0, 0]} width={260} height={48} className="h-full w-full" />
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
          <AnimatedNumber value={data.detectedLeaksCount} className="text-[26px] font-bold tabular-nums text-graphite" />
          <span className="text-[12px] font-semibold text-risk">
            −{cur} {data.detectedLeaksMonthly.toLocaleString()}/mo
          </span>
        </div>
        <div className="mt-3 space-y-1.5 text-[12px] font-medium">
          {data.leaksByCategory.length === 0 ? (
            <p className="text-quiet">No unwanted spending flagged — nice.</p>
          ) : (
            data.leaksByCategory.slice(0, 3).map((c) => (
              <div key={c.label} className="flex justify-between text-slate-ink">
                <span className="truncate">{c.label}</span>
                <span className="tabular-nums text-risk">{c.count}</span>
              </div>
            ))
          )}
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
          <AnimatedNumber value={data.subscriptionsCount} className="text-[26px] font-bold tabular-nums text-graphite" />
          <span className="text-[12.5px] text-quiet">
            recurring · {cur} {data.subscriptionsMonthly.toLocaleString()}/mo
          </span>
        </div>
        <p className="mt-3 rounded-xl bg-mist px-3 py-2 text-[12px] font-medium text-slate-ink">
          {data.subscriptionsCount > 0
            ? "Detected from repeated charges in your statement"
            : "No recurring subscriptions detected"}
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
        <AnimatedNumber
          value={data.cashFlowSpark.at(-1) ?? 0}
          prefix={`${(data.cashFlowSpark.at(-1) ?? 0) >= 0 ? "+" : ""}${cur} `}
          className="mt-4 block text-[26px] font-bold tabular-nums tracking-tight text-graphite"
        />
        <p className="text-[12px] text-quiet">net across this report</p>
        <div className="mt-3 h-12">
          <AreaSpark data={data.cashFlowSpark.length ? data.cashFlowSpark : [0, 0]} width={260} height={48} color="#14181d" className="h-full w-full" />
        </div>
      </motion.article>

      {/* Emergency fund — feature not built yet, shown honestly rather than faked */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe flex items-center gap-5 rounded-card p-6 opacity-60"
        aria-label="Emergency fund"
      >
        <span className="grid h-[84px] w-[84px] shrink-0 place-items-center rounded-full bg-mist text-quiet">
          <Umbrella className="h-6 w-6" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-graphite">Emergency Fund</h3>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-quiet">Soon</span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-quiet">Tracking isn&apos;t built yet</p>
        </div>
      </motion.article>

      {/* Investment readiness — feature not built yet */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe flex items-center gap-5 rounded-card p-6 opacity-60"
        aria-label="Investment readiness"
      >
        <span className="grid h-[84px] w-[84px] shrink-0 place-items-center rounded-full bg-mist text-quiet">
          <Rocket className="h-6 w-6" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-graphite">Investment Readiness</h3>
            <span className="rounded-full bg-mist px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-quiet">Soon</span>
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-quiet">Not built yet</p>
        </div>
      </motion.article>

      {/* Goals — feature not built yet */}
      <motion.article
        variants={revealItem}
        whileHover={hover}
        transition={spring}
        className="card-luxe rounded-card p-6 opacity-60"
        aria-label="Goals"
      >
        <header className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-quiet">
            <Target className="h-4 w-4" />
          </span>
          <h3 className="text-[14px] font-semibold text-graphite">Goals</h3>
          <span className="rounded-full bg-mist px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-quiet">Soon</span>
        </header>
        <p className="mt-4 text-[12.5px] leading-relaxed text-quiet">
          Set and track savings goals — coming in a future update.
        </p>
      </motion.article>

      {/* AI recommendation — accent card, real top advice from the analyzer */}
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
        {data.topRecommendation ? (
          <>
            <p className="relative mt-4 text-[14px] font-medium leading-relaxed text-white/90">
              {data.topRecommendation.detail}
            </p>
            <Link
              href="/history"
              className="relative mt-4 inline-block rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-emerald-700 transition-transform hover:scale-[1.03] active:scale-95"
            >
              See full report →
            </Link>
          </>
        ) : (
          <p className="relative mt-4 text-[14px] font-medium leading-relaxed text-white/90">
            Analyze a statement to get your first recommendation.
          </p>
        )}
      </motion.article>
    </RevealGroup>
  );
}
