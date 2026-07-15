"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CopyX,
  Droplets,
  PiggyBank,
  Receipt,
  RefreshCcw,
  Sparkles,
  Wallet,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Bars } from "@/components/ui/charts";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import type { Report, TxnKind } from "@/lib/analyzer";

const KIND_META: Record<Exclude<TxnKind, "income">, { label: string; color: string; chip: string; blurb: string }> = {
  routine: {
    label: "Routine & essential",
    color: "#10b981",
    chip: "bg-emerald-50 text-emerald-700",
    blurb: "Rent, utilities, groceries, transport — the cost of living your life.",
  },
  lifestyle: {
    label: "Lifestyle & choices",
    color: "#f5a623",
    chip: "bg-amber-soft text-amber-signal",
    blurb: "Dining, shopping, entertainment — fine on purpose, costly on autopilot.",
  },
  unwanted: {
    label: "Unwanted & leaking",
    color: "#f0653f",
    chip: "bg-risk-soft text-risk",
    blurb: "Fees, idle subscriptions, duplicates — money you get zero value from.",
  },
};

export function ReportView({
  report,
  fileName,
  onReset,
}: {
  report: Report;
  fileName: string;
  onReset: () => void;
}) {
  const r = report;
  const cur = r.currency;
  const aed = (n: number) => `${cur} ${Math.round(n).toLocaleString()}`;
  const kindTotals: { kind: Exclude<TxnKind, "income">; total: number }[] = [
    { kind: "routine", total: r.routineTotal },
    { kind: "lifestyle", total: r.lifestyleTotal },
    { kind: "unwanted", total: r.unwantedTotal },
  ];
  const spendMax = Math.max(r.totalSpend, 1);
  const unwantedRecurring = r.recurring.filter((x) => x.category === "Subscriptions" || x.category === "Gym & Memberships");
  const yearlyPotential = r.potentialMonthlySaving * 12;

  return (
    <div className="space-y-6">
      {/* header */}
      <Reveal blur={false} y={14}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Your money report</p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-graphite sm:text-[34px]">
              I read all {r.txnCount} transactions. Here&apos;s the truth.
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-quiet">
              {fileName} · {r.monthLabels.join(" – ")} · analyzed on your device
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-emerald-700">
                Currency detected: {cur}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[13px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Analyze another statement
          </button>
        </div>
      </Reveal>

      {/* headline stats */}
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-graphite">Money in</p>
          </div>
          <AnimatedNumber value={r.totalIncome} prefix={`${cur} `} className="mt-3 block text-[26px] font-bold tabular-nums tracking-tight text-emerald-600" />
          <p className="text-[12px] text-quiet">{aed(r.avgMonthlyIncome)}/month average</p>
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-risk-soft text-risk">
              <ArrowDownRight className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-graphite">Money out</p>
          </div>
          <AnimatedNumber value={r.totalSpend} prefix={`${cur} `} className="mt-3 block text-[26px] font-bold tabular-nums tracking-tight text-graphite" />
          <p className="text-[12px] text-quiet">{aed(r.avgMonthlySpend)}/month average</p>
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-graphite">
              <Wallet className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-graphite">Kept</p>
          </div>
          <AnimatedNumber value={r.net} prefix={`${cur} `} className={`mt-3 block text-[26px] font-bold tabular-nums tracking-tight ${r.net >= 0 ? "text-graphite" : "text-risk"}`} />
          <p className="text-[12px] text-quiet">over {r.months} month{r.months > 1 ? "s" : ""}</p>
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe flex items-center gap-5 rounded-card p-6">
          <ProgressRing value={Math.min(r.savingsRate, 100)} size={84} stroke={8} color={r.savingsRate >= 20 ? "#10b981" : "#f5a623"}>
            <span className="text-[19px] font-bold tabular-nums text-graphite">{r.savingsRate}%</span>
          </ProgressRing>
          <div>
            <p className="text-[13px] font-semibold text-graphite">Savings rate</p>
            <p className="mt-1 text-[12px] leading-relaxed text-quiet">
              {r.savingsRate >= 20 ? "Healthy — above the 20% target" : "Below the 20% target — fixable"}
            </p>
          </div>
        </motion.div>
      </RevealGroup>

      {/* income + monthly trend */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Reveal delay={0.05} className="card-luxe rounded-card-lg p-7">
          <h2 className="text-[16px] font-semibold tracking-tight text-graphite">Where money came from</h2>
          <div className="mt-5 space-y-4">
            {r.incomeSources.map((s) => (
              <div key={s.name}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-medium text-slate-ink">{s.name}</span>
                  <span className="font-bold tabular-nums text-graphite">{aed(s.total)}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-mist">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(s.total / r.totalIncome) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="card-luxe rounded-card-lg p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-semibold tracking-tight text-graphite">Month by month</h2>
            <div className="flex items-center gap-4 text-[11.5px] font-medium text-quiet">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-emerald-500" /> In</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-fog" /> Out</span>
            </div>
          </div>
          <div className="mt-5 flex items-end gap-6">
            {r.monthlySpendSeries.map((m) => (
              <div key={m.label} className="flex-1">
                <Bars
                  height={130}
                  data={[
                    { label: "", value: m.income, accent: true },
                    { label: "", value: m.spend },
                  ]}
                />
                <p className="mt-1 text-center text-[11.5px] font-semibold text-slate-ink">{m.label}</p>
                <p className="text-center text-[10.5px] tabular-nums text-quiet">kept {aed(m.income - m.spend)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* the three buckets */}
      <Reveal delay={0.05}>
        <div className="card-luxe rounded-card-lg p-7">
          <h2 className="text-[16px] font-semibold tracking-tight text-graphite">Where money went</h2>
          <p className="mt-1 text-[13px] text-quiet">Every {cur} sorted into three honest buckets.</p>

          {/* stacked ribbon */}
          <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-mist" aria-hidden>
            {kindTotals.map((k) => (
              <motion.div
                key={k.kind}
                initial={{ width: 0 }}
                whileInView={{ width: `${(k.total / spendMax) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ background: KIND_META[k.kind].color }}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {kindTotals.map((k) => {
              const meta = KIND_META[k.kind];
              const cats = r.categories.filter((c) => c.kind === k.kind).slice(0, 4);
              return (
                <div key={k.kind} className="rounded-2xl bg-mist/50 p-5 ring-hairline">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${meta.chip}`}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.color }} />
                    {meta.label}
                  </span>
                  <p className="mt-3 text-[24px] font-bold tabular-nums tracking-tight text-graphite">
                    {aed(k.total)}
                    <span className="ml-2 text-[13px] font-semibold text-quiet">
                      {Math.round((k.total / spendMax) * 100)}%
                    </span>
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-quiet">{meta.blurb}</p>
                  <div className="mt-4 space-y-2">
                    {cats.map((c) => (
                      <div key={c.category} className="flex items-center justify-between text-[12.5px]">
                        <span className="font-medium text-slate-ink">{c.category}</span>
                        <span className="font-semibold tabular-nums text-graphite">{aed(c.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* unwanted spends detail */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.05} className="card-luxe rounded-card-lg p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-risk-soft text-risk">
              <Droplets className="h-4 w-4" />
            </span>
            <h2 className="text-[16px] font-semibold tracking-tight text-graphite">Recurring charges found</h2>
          </div>
          <div className="mt-5 space-y-2.5">
            {r.recurring.slice(0, 7).map((rc) => {
              const leak = unwantedRecurring.includes(rc);
              return (
                <div key={rc.merchant} className="flex items-center justify-between rounded-2xl bg-mist/60 px-4 py-3 ring-hairline">
                  <div>
                    <p className="text-[13.5px] font-semibold text-graphite">{rc.merchant}</p>
                    <p className="text-[11.5px] text-quiet">{rc.category} · {rc.count}× · {aed(rc.yearly)}/yr</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13.5px] font-bold tabular-nums text-graphite">{aed(rc.monthly)}/mo</span>
                    {leak && (
                      <span className="rounded-full bg-risk-soft px-2.5 py-1 text-[10px] font-bold uppercase text-risk">review</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="card-luxe rounded-card-lg p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-soft text-amber-signal">
              <CopyX className="h-4 w-4" />
            </span>
            <h2 className="text-[16px] font-semibold tracking-tight text-graphite">Duplicates & fees</h2>
          </div>
          <div className="mt-5 space-y-2.5">
            {r.duplicates.map((d, i) => (
              <div key={`${d.merchant}-${i}`} className="flex items-center justify-between rounded-2xl bg-amber-soft/60 px-4 py-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-graphite">{d.merchant} — charged twice</p>
                  <p className="text-[11.5px] text-quiet">
                    {d.dates[0].toLocaleDateString()} and {d.dates[1].toLocaleDateString()} · refundable
                  </p>
                </div>
                <span className="text-[13.5px] font-bold tabular-nums text-amber-signal">−{aed(d.amount)}</span>
              </div>
            ))}
            {r.fees.map((f, i) => (
              <div key={`${f.desc}-${i}`} className="flex items-center justify-between rounded-2xl bg-mist/60 px-4 py-3 ring-hairline">
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-3.5 w-3.5 text-quiet" />
                  <div>
                    <p className="text-[13px] font-medium text-graphite">{f.desc}</p>
                    <p className="text-[11px] text-quiet">{f.date.toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-[13px] font-semibold tabular-nums text-risk">−{aed(f.amount)}</span>
              </div>
            ))}
            {r.duplicates.length === 0 && r.fees.length === 0 && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-[13px] font-medium text-emerald-700">
                Clean — no duplicate charges or bank fees found. Rare and impressive.
              </p>
            )}
          </div>
        </Reveal>
      </div>

      {/* advice */}
      <Reveal delay={0.05}>
        <div className="noise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-graphite via-[#1b2229] to-[#0f2e24] p-8 text-white shadow-luxe-lg sm:p-10">
          <div aria-hidden className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-lime-electric/15 blur-[90px]" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-lime-electric">
                <Sparkles className="h-4 w-4" /> Your savings plan
              </p>
              <h2 className="mt-3 max-w-xl text-[26px] font-bold leading-tight tracking-tight sm:text-[32px]">
                Follow this and you keep{" "}
                <span className="text-lime-electric">{aed(r.potentialMonthlySaving)}</span> more every month.
              </h2>
            </div>
            <div className="rounded-2xl bg-white/[0.07] px-5 py-4 ring-1 ring-white/10">
              <p className="text-[11.5px] font-medium text-white/55">That compounds to</p>
              <AnimatedNumber value={yearlyPotential} prefix={`${cur} `} className="text-[26px] font-bold tabular-nums text-lime-electric" />
              <p className="text-[11.5px] text-white/55">per year — no lifestyle change</p>
            </div>
          </div>

          <div className="relative mt-8 grid gap-4 md:grid-cols-2">
            {r.advice.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15.5px] font-semibold leading-snug">{a.title}</h3>
                  {a.monthlySaving > 0 && (
                    <span className="shrink-0 rounded-full bg-lime-electric/15 px-3 py-1 text-[11.5px] font-bold tabular-nums text-lime-electric">
                      +{aed(a.monthlySaving)}/mo
                    </span>
                  )}
                </div>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/70">{a.detail}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-lime-electric px-7 py-3.5 text-[14.5px] font-bold text-graphite shadow-glow-lime transition-all hover:brightness-105 active:scale-95"
            >
              <PiggyBank className="h-4.5 w-4.5" />
              Let the AI guard this automatically
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full bg-white/10 px-6 py-3.5 text-[14.5px] font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/15"
            >
              Analyze another statement
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
