"use client";

import { motion } from "framer-motion";
import { FileText, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Real AI Report Preview — a styled recreation of actual sections from the
 * PDF report, populated with clearly-labeled sample data. Every section
 * named here genuinely exists in the product's report.
 */
const reportSections = [
  "Cover with your money-in / money-out / savings rate",
  "Monthly cash flow — income vs spending",
  "Merchant intelligence with per-amount frequency",
  "Recurring, duplicate & bank-fee analysis",
  "Financial health score with a transparent formula",
  "Money leak opportunities & savings projection",
  "A personal letter from DONRITHIK AI",
];

export function InsightsShowcase() {
  return (
    <section id="report-preview" className="relative overflow-hidden bg-noir py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-200px] top-1/3 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.08),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="max-w-lg">
            <p className="eyebrow-gold">Real AI Report Preview</p>
            <h2 className="mt-4 text-balance text-[44px] font-bold leading-tight tracking-[-0.025em] text-ivory">
              Not a chart dump. A{" "}
              <span className="headline-gold">16-section intelligence report.</span>
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-parchment">
              Every scan produces a premium PDF report that reads like a
              professional analyst wrote it about you — because the AI analyzed
              every single transaction, and shows its work.
            </p>
            <ul className="mt-8 space-y-3">
              {reportSections.map((s) => (
                <li key={s} className="flex items-start gap-3 text-[14.5px] text-parchment">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)]">
                    <Check className="h-3 w-3 text-gold" strokeWidth={3} />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-3 text-[12.5px] text-ash">
              <FileText className="h-4 w-4 text-gold" />
              Preview below uses sample data — your report is built from your statement only.
            </div>
          </Reveal>

          {/* Styled recreation of real report sections, sample data */}
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="card-noir-gold rounded-card-lg p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Financial Health Score · Sample
              </p>
              <div className="mt-3 flex items-end justify-between">
                <p className="text-[44px] font-bold leading-none tracking-tight text-ivory">
                  63<span className="text-[20px] text-ash"> / 100</span>
                </p>
                <span className="rounded-full border border-[rgba(212,175,55,0.35)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold-bright">
                  Good
                </span>
              </div>
              <div className="mt-5 space-y-2.5">
                {[
                  ["Savings rate", 0.15],
                  ["Fee discipline", 1],
                  ["Duplicate control", 0.8],
                ].map(([label, frac]) => (
                  <div key={label as string} className="flex items-center gap-3">
                    <p className="w-32 shrink-0 text-[12px] text-ash">{label}</p>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold-bright"
                        style={{ width: `${(frac as number) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="card-noir rounded-card-lg p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Merchant Intelligence · Sample
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-[16px] font-semibold text-ivory">Jio Recharge</p>
                <p className="text-[16px] font-bold text-ivory">₹1,208</p>
              </div>
              <p className="mt-1 text-[12.5px] text-ash">
                Subscriptions · 4 visits · 30 Jun → 14 Jul
              </p>
              <p className="mt-2.5 text-[13.5px] font-semibold text-parchment">₹302 ×4</p>
              <p className="mt-2 text-[12.5px] italic leading-relaxed text-gold-bright">
                AI note: All 4 payments are the identical ₹302 — behaves like a fixed commitment.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.24, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="card-noir rounded-card-lg p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Friend to Friend · Sample
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-parchment">
                &ldquo;Give every month a ceiling: you averaged ₹26,400 in spending, so
                hold next month under ₹25,100 and treat that limit like a bill you
                owe yourself.&rdquo;
              </p>
              <p className="mt-3 text-[12px] font-semibold tracking-wide text-gold">
                — Your DONRITHIK AI
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
