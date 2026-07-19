"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Droplets } from "lucide-react";
import type { Leak, RiskLevel } from "@/lib/data";

const riskStyles: Record<RiskLevel, { label: string; chip: string; bar: string }> = {
  high: { label: "High leak", chip: "bg-risk-soft text-risk", bar: "#f0653f" },
  medium: { label: "Medium leak", chip: "bg-amber-soft text-amber-signal", bar: "#f5a623" },
  low: { label: "Low leak", chip: "bg-mist text-slate-ink", bar: "#77828c" },
};

/**
 * The signature card: an active leak with AI confidence, waste math, and a
 * one-click fix that visually "seals" the leak.
 */
export function LeakCard({
  leak,
  index = 0,
  currency = "AED",
}: {
  leak: Leak;
  index?: number;
  currency?: string;
}) {
  const [sealed, setSealed] = useState(false);
  const risk = riskStyles[leak.risk];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      whileHover={sealed ? {} : { y: -5 }}
      className={`card-luxe relative overflow-hidden rounded-card p-5 transition-shadow ${
        sealed ? "" : "hover:shadow-luxe-lg"
      }`}
    >
      {/* sealed overlay */}
      <AnimatePresence>
        {sealed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-card bg-emerald-50/90 backdrop-blur-sm"
          >
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
              className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-glow-emerald"
            >
              <Check className="h-6 w-6" strokeWidth={3} />
            </motion.span>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-[14px] font-semibold text-emerald-800"
            >
              Marked as reviewed
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-[85%] text-center text-[12.5px] font-medium text-emerald-600"
            >
              You could save {currency} {leak.yearlySavings.toLocaleString()}/yr once you complete this yourself
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-2xl text-[17px] font-bold text-graphite/80"
            style={{ background: leak.hue }}
          >
            {leak.monogram || "•"}
          </span>
          <div>
            <p className="text-[14.5px] font-semibold leading-tight text-graphite">
              {leak.vendor}
            </p>
            <p className="text-[12px] text-quiet">{leak.category}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${risk.chip}`}>
          <Droplets className="h-3 w-3" />
          {risk.label}
        </span>
      </div>

      {/* finding */}
      <p className="mt-4 min-h-[42px] text-[13px] leading-relaxed text-slate-ink">
        {leak.finding}
      </p>

      {/* confidence meter */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11.5px] font-medium">
          <span className="text-quiet">AI confidence</span>
          <span className="tabular-nums text-graphite">{leak.confidence}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mist">
          <motion.div
            className="h-full rounded-full"
            style={{ background: risk.bar }}
            initial={{ width: 0 }}
            whileInView={{ width: `${leak.confidence}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.3 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* money math */}
      <div className="mt-4 flex items-end justify-between rounded-2xl bg-mist/70 px-4 py-3">
        <div>
          <p className="text-[11px] font-medium text-quiet">Wasted monthly</p>
          <p className="text-[17px] font-bold tabular-nums text-risk">
            −{currency} {leak.monthlyWaste.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-quiet">Yearly recovery</p>
          <p className="text-[17px] font-bold tabular-nums text-emerald-600">
            +{currency} {leak.yearlySavings.toLocaleString()}
          </p>
        </div>
      </div>

      {/* suggested fix — a checklist mark, not an executed transaction */}
      <motion.button
        type="button"
        onClick={() => setSealed(true)}
        whileTap={{ scale: 0.97 }}
        aria-label={`Mark "${leak.action}" as done — this does not perform the action for you`}
        className="mt-4 w-full rounded-full bg-graphite py-2.5 text-[13px] font-semibold text-white transition-all hover:shadow-[0_10px_28px_-8px_rgba(20,24,29,0.5)]"
      >
        Mark &quot;{leak.action}&quot; as done <span className="text-lime-electric">→</span>
      </motion.button>
      <p className="mt-2 text-center text-[11px] text-quiet">
        You&apos;ll need to do this yourself with your bank or provider — we don&apos;t cancel or pay anything for you.
      </p>
    </motion.div>
  );
}
