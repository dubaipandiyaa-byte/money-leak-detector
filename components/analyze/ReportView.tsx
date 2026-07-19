"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Cloud,
  CloudOff,
  ChevronDown,
  CopyX,
  Download,
  Droplets,
  LoaderCircle,
  PiggyBank,
  Receipt,
  RefreshCcw,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Bars } from "@/components/ui/charts";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import type { Report, TxnKind } from "@/lib/analyzer";

/**
 * The File System Access API isn't in TypeScript's DOM lib yet. Minimal
 * ambient typing for the one method this file uses.
 */
declare global {
  interface Window {
    showSaveFilePicker?: (options: {
      suggestedName: string;
      types: { description: string; accept: Record<string, string[]> }[];
    }) => Promise<{
      createWritable: () => Promise<{
        write: (data: BlobPart) => Promise<void>;
        close: () => Promise<void>;
      }>;
    }>;
  }
}

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

export type SyncStatus = "checking" | "anonymous" | "signed-in" | "saved" | "save-error";

export function ReportView({
  report,
  fileName,
  onReset,
  resetLabel = "Analyze another statement",
  syncStatus = "checking",
}: {
  report: Report;
  fileName: string;
  onReset: () => void;
  resetLabel?: string;
  syncStatus?: SyncStatus;
}) {
  const r = report;
  const cur = r.currency;
  const [downloading, setDownloading] = useState(false);

  async function downloadPdf() {
    if (downloading) return;
    setDownloading(true);
    try {
      const { generateReportPdf } = await import("@/lib/reportPdf");
      const bytes = await generateReportPdf(r, fileName);
      const suggestedName = `money-report-${r.monthLabels.join("-").toLowerCase()}.pdf`;

      // Prefer the File System Access API where it exists: it writes the
      // file directly to the location the user picks, no blob-URL step at
      // all. Brave (and Firefox, Safari) don't implement it — window.
      // showSaveFilePicker is simply undefined there — so this always falls
      // through for a large share of real users, not just an edge case.
      if (window.showSaveFilePicker) {
        try {
          const handle = await window.showSaveFilePicker({
            suggestedName,
            types: [{ description: "PDF document", accept: { "application/pdf": [".pdf"] } }],
          });
          const writable = await handle.createWritable();
          await writable.write(bytes as BlobPart);
          await writable.close();
          return;
        } catch (pickerErr) {
          if ((pickerErr as DOMException)?.name === "AbortError") return; // user cancelled the save dialog
          // otherwise fall through to the method below
        }
      }

      // Direct forced download via a hidden <a download> click on a blob:
      // URL. This is the standard client-side download pattern, kept as
      // simple and synchronous as possible (no extra async steps between
      // creating the blob and clicking) to give the browser's download
      // manager the cleanest possible signal. The object URL is revoked
      // well after any realistic download-manager processing rather than
      // on a short timer, which could otherwise race it.
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 120_000);
    } catch (err) {
      console.error("[MLD] PDF export failed:", err);
    } finally {
      setDownloading(false);
    }
  }
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
            <h1 className="mt-2 text-[28px] font-bold tracking-tight text-ivory sm:text-[34px]">
              {r.accountName
                ? `${r.accountName.split(" ")[0]}, I read all ${r.txnCount} transactions.`
                : `I read all ${r.txnCount} transactions. Here's the truth.`}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-ash">
              {fileName} · {r.monthLabels.join(" – ")} · analyzed on your device
              {r.accountName && (
                <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11.5px] font-bold text-ivory">
                  Prepared for {r.accountName}
                </span>
              )}
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-emerald-700">
                Currency detected: {cur}
              </span>
              {syncStatus === "saved" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11.5px] font-bold text-emerald-700">
                  <Cloud className="h-3 w-3" /> Saved to your account
                </span>
              )}
              {syncStatus === "signed-in" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-0.5 text-[11.5px] font-bold text-ivory">
                  <Cloud className="h-3 w-3" /> Signed in
                </span>
              )}
              {syncStatus === "save-error" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-risk-soft px-2.5 py-0.5 text-[11.5px] font-bold text-risk">
                  <CloudOff className="h-3 w-3" /> Couldn&apos;t save to your account
                </span>
              )}
              {syncStatus === "anonymous" && (
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1 rounded-full bg-amber-soft px-2.5 py-0.5 text-[11.5px] font-bold text-amber-signal transition-colors hover:brightness-95"
                >
                  <CloudOff className="h-3 w-3" /> Sign in to save this permanently
                </Link>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={downloadPdf}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-full btn-gold px-5 py-2.5 text-[13px] font-semibold transition-all active:scale-95 disabled:opacity-60"
            >
              {downloading ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin text-lime-electric" />
              ) : (
                <Download className="h-3.5 w-3.5 text-lime-electric" />
              )}
              {downloading ? "Preparing PDF…" : "Download PDF report"}
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-5 py-2.5 text-[13px] font-semibold text-ivory shadow-float ring-1 ring-white/10 transition-colors hover:bg-mist"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              {resetLabel}
            </button>
          </div>
        </div>
      </Reveal>

      {/* headline stats */}
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-ivory">Money in</p>
          </div>
          <AnimatedNumber value={r.totalIncome} prefix={`${cur} `} className="mt-3 block text-[26px] font-bold tabular-nums tracking-tight text-emerald-600" />
          <p className="text-[12px] text-ash">{aed(r.avgMonthlyIncome)}/month average</p>
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-risk-soft text-risk">
              <ArrowDownRight className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-ivory">Money out</p>
          </div>
          <AnimatedNumber value={r.totalSpend} prefix={`${cur} `} className="mt-3 block text-[26px] font-bold tabular-nums tracking-tight text-ivory" />
          <p className="text-[12px] text-ash">{aed(r.avgMonthlySpend)}/month average</p>
          {r.refundedTotal > 0 && (
            <p className="mt-1 text-[11.5px] font-semibold text-emerald-600">
              includes {aed(r.refundedTotal)} later refunded — real spend {aed(r.totalSpend - r.refundedTotal)}
            </p>
          )}
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe rounded-card p-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-ivory">
              <Wallet className="h-4 w-4" />
            </span>
            <p className="text-[13px] font-semibold text-ivory">Kept</p>
          </div>
          <AnimatedNumber value={r.net} prefix={`${cur} `} className={`mt-3 block text-[26px] font-bold tabular-nums tracking-tight ${r.net >= 0 ? "text-ivory" : "text-risk"}`} />
          <p className="text-[12px] text-ash">over {r.months} month{r.months > 1 ? "s" : ""}</p>
        </motion.div>

        <motion.div variants={revealItem} className="card-luxe flex items-center gap-5 rounded-card p-6">
          <ProgressRing value={Math.min(r.savingsRate, 100)} size={84} stroke={8} color={r.savingsRate >= 20 ? "#10b981" : "#f5a623"}>
            <span className="text-[19px] font-bold tabular-nums text-ivory">{r.savingsRate}%</span>
          </ProgressRing>
          <div>
            <p className="text-[13px] font-semibold text-ivory">Savings rate</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ash">
              {r.savingsRate >= 20 ? "Healthy — above the 20% target" : "Below the 20% target — fixable"}
            </p>
          </div>
        </motion.div>
      </RevealGroup>

      {/* income + monthly trend */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Reveal delay={0.05} className="card-luxe rounded-card-lg p-7">
          <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Where money came from</h2>
          <div className="mt-5 space-y-4">
            {r.incomeSources.map((s) => (
              <div key={s.name}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="font-medium text-parchment">{s.name}</span>
                  <span className="font-bold tabular-nums text-ivory">{aed(s.total)}</span>
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
            <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Month by month</h2>
            <div className="flex items-center gap-4 text-[11.5px] font-medium text-ash">
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
                <p className="mt-1 text-center text-[11.5px] font-semibold text-parchment">{m.label}</p>
                <p className="text-center text-[10.5px] tabular-nums text-ash">kept {aed(m.income - m.spend)}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* the three buckets */}
      <Reveal delay={0.05}>
        <div className="card-luxe rounded-card-lg p-7">
          <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Where money went</h2>
          <p className="mt-1 text-[13px] text-ash">Every {cur} sorted into three honest buckets.</p>

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
                  <p className="mt-3 text-[24px] font-bold tabular-nums tracking-tight text-ivory">
                    {aed(k.total)}
                    <span className="ml-2 text-[13px] font-semibold text-ash">
                      {Math.round((k.total / spendMax) * 100)}%
                    </span>
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-ash">{meta.blurb}</p>
                  <div className="mt-4 space-y-2">
                    {cats.map((c) => (
                      <div key={c.category} className="flex items-center justify-between text-[12.5px]">
                        <span className="font-medium text-parchment">{c.category}</span>
                        <span className="font-semibold tabular-nums text-ivory">{aed(c.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Reveal>

      {/* merchant-level breakdown */}
      <Reveal delay={0.05}>
        <div className="card-luxe rounded-card-lg p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-mist text-ivory">
              <Store className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Where exactly it went</h2>
              <p className="text-[13px] text-ash">Every merchant ranked — visits, averages, totals. Nothing hidden.</p>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-wider text-ash">
                  <th className="pb-2.5 pr-3 font-semibold">Merchant</th>
                  <th className="hidden pb-2.5 pr-3 font-semibold sm:table-cell">Category</th>
                  <th className="pb-2.5 pr-3 text-right font-semibold">Visits</th>
                  <th className="hidden pb-2.5 pr-3 text-right font-semibold sm:table-cell">Avg</th>
                  <th className="pb-2.5 pr-3 text-right font-semibold">Total</th>
                  <th className="pb-2.5 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody>
                {r.merchants.slice(0, 12).map((m) => (
                  <tr key={m.merchant} className="border-b border-white/[0.08] last:border-0">
                    <td className="py-2.5 pr-3 font-semibold text-ivory">{m.merchant}</td>
                    <td className="hidden py-2.5 pr-3 text-parchment sm:table-cell">{m.category}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-parchment">{m.count}×</td>
                    <td className="hidden py-2.5 pr-3 text-right tabular-nums text-ash sm:table-cell">
                      {aed(m.total / m.count)}
                    </td>
                    <td className="py-2.5 pr-3 text-right font-bold tabular-nums text-ivory">{aed(m.total)}</td>
                    <td className="py-2.5 text-right tabular-nums text-ash">
                      {Math.max(1, Math.round((m.total / spendMax) * 100))}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {r.merchants.length > 12 && (
            <p className="mt-4 text-[12.5px] text-ash">
              …and {r.merchants.length - 12} more merchants — every one is in the full ledger below.
            </p>
          )}
        </div>
      </Reveal>

      {/* complete transaction ledger */}
      <Reveal delay={0.05}>
        <details className="card-luxe group rounded-card-lg p-7">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
            <div>
              <h2 className="text-[16px] font-semibold tracking-tight text-ivory">
                Complete transaction ledger
              </h2>
              <p className="mt-1 text-[13px] text-ash">
                All {r.txnCount} transactions, first to last — every {cur} accounted for. Tap to expand.
              </p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-parchment transition-transform duration-300 group-open:rotate-180">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <div className="mt-5 max-h-[420px] overflow-y-auto rounded-2xl ring-hairline">
            <table className="w-full text-left text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-white/[0.06] shadow-[0_1px_0_rgba(20,24,29,0.06)]">
                <tr className="text-[10.5px] uppercase tracking-wider text-ash">
                  <th className="px-3 py-2.5 font-semibold">Date</th>
                  <th className="px-3 py-2.5 font-semibold">Merchant</th>
                  <th className="hidden px-3 py-2.5 font-semibold sm:table-cell">Category</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {r.transactions.map((t, i) => (
                  <tr key={i} className="border-t border-white/[0.08]">
                    <td className="whitespace-nowrap px-3 py-2 tabular-nums text-ash">
                      {t.date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-3 py-2 font-medium text-ivory">{t.merchant}</td>
                    <td className="hidden px-3 py-2 text-parchment sm:table-cell">{t.category}</td>
                    <td
                      className={`whitespace-nowrap px-3 py-2 text-right font-semibold tabular-nums ${
                        t.amount > 0 ? "text-emerald-600" : "text-ivory"
                      }`}
                    >
                      {t.amount > 0 ? "+" : "−"}
                      {aed(Math.abs(t.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </Reveal>

      {/* unwanted spends detail */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Reveal delay={0.05} className="card-luxe rounded-card-lg p-7">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-risk-soft text-risk">
              <Droplets className="h-4 w-4" />
            </span>
            <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Recurring charges found</h2>
          </div>
          <div className="mt-5 space-y-2.5">
            {r.recurring.slice(0, 7).map((rc) => {
              const leak = unwantedRecurring.includes(rc);
              return (
                <div key={rc.merchant} className="flex items-center justify-between rounded-2xl bg-mist/60 px-4 py-3 ring-hairline">
                  <div>
                    <p className="text-[13.5px] font-semibold text-ivory">{rc.merchant}</p>
                    <p className="text-[11.5px] text-ash">{rc.category} · {rc.count}× · {aed(rc.yearly)}/yr</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[13.5px] font-bold tabular-nums text-ivory">{aed(rc.monthly)}/mo</span>
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
            <h2 className="text-[16px] font-semibold tracking-tight text-ivory">Duplicates & fees</h2>
          </div>
          <div className="mt-5 space-y-2.5">
            {r.duplicates.map((d, i) => (
              <div key={`${d.merchant}-${i}`} className="flex items-center justify-between rounded-2xl bg-amber-soft/60 px-4 py-3">
                <div>
                  <p className="text-[13.5px] font-semibold text-ivory">{d.merchant} — charged twice</p>
                  <p className="text-[11.5px] text-ash">
                    {d.dates[0].toLocaleDateString()} and {d.dates[1].toLocaleDateString()} · refundable
                  </p>
                </div>
                <span className="text-[13.5px] font-bold tabular-nums text-amber-signal">−{aed(d.amount)}</span>
              </div>
            ))}
            {r.fees.map((f, i) => (
              <div key={`${f.desc}-${i}`} className="flex items-center justify-between rounded-2xl bg-mist/60 px-4 py-3 ring-hairline">
                <div className="flex items-center gap-2.5">
                  <Receipt className="h-3.5 w-3.5 text-ash" />
                  <div>
                    <p className="text-[13px] font-medium text-ivory">{f.desc}</p>
                    <p className="text-[11px] text-ash">{f.date.toLocaleDateString()}</p>
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
              className="inline-flex items-center gap-2 rounded-full btn-gold px-7 py-3.5 text-[14.5px] font-bold transition-all active:scale-95"
            >
              <PiggyBank className="h-4.5 w-4.5" />
              Let the AI guard this automatically
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="rounded-full bg-white/10 px-6 py-3.5 text-[14.5px] font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/[0.08]/15"
            >
              Analyze another statement
            </button>
          </div>
        </div>
      </Reveal>

      {/* friend to friend — the human close */}
      <Reveal delay={0.05}>
        <div className="card-luxe rounded-card-lg p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/[0.08] ring-1 ring-white/10">
              <Sparkles className="h-5 w-5 text-lime-electric" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
            </span>
            <div>
              <h2 className="text-[18px] font-bold tracking-tight text-ivory">
                Friend to friend
              </h2>
              <p className="text-[13px] text-ash">
                Not a bank talking. Just your AI, being honest with you.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {r.friendNotes.map((note, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`max-w-[92%] rounded-3xl rounded-tl-lg px-5 py-4 text-[14.5px] leading-relaxed ${
                  i === r.friendNotes.length - 1
                    ? "btn-gold"
                    : "bg-mist/70 text-ivory ring-hairline"
                }`}
              >
                {note}
              </motion.p>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
