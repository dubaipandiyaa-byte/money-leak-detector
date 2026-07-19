"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, ScanSearch, Radar, Droplets } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressRing } from "@/components/ui/ProgressRing";

interface GuardianCardProps {
  healthScore: number;
  healthScoreDeltaLabel: string | null;
  savingsPrediction30d: number;
  txnCount: number;
  scanPhaseDetails: [string, string, string, string];
  currency: string;
}

const PHASE_ICONS = [ScanSearch, BrainCircuit, Radar, Droplets];
const PHASE_LABELS = ["Scanning expenses", "Analyzing behavior", "Finding leaks", "Leak review"];

/** The main AI intelligence card: animated brain, cycling scan phases, live stats. */
export function GuardianCard({
  healthScore,
  healthScoreDeltaLabel,
  savingsPrediction30d,
  txnCount,
  scanPhaseDetails,
  currency,
}: GuardianCardProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % PHASE_ICONS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const Active = PHASE_ICONS[phase];

  return (
    <motion.section
      initial={{ opacity: 0, y: 32, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      aria-label="AI intelligence status"
      className="noise relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-graphite via-[#1a2129] to-[#11291f] p-7 text-white shadow-luxe-lg sm:p-9"
    >
      <div aria-hidden className="absolute -right-24 -top-28 h-80 w-80 rounded-full bg-emerald-500/20 blur-[90px]" />
      <div aria-hidden className="absolute -bottom-32 left-16 h-64 w-64 rounded-full bg-lime-electric/12 blur-[80px]" />

      <div className="relative grid items-center gap-10 lg:grid-cols-[auto_1fr_auto]">
        {/* animated AI brain */}
        <div className="relative mx-auto grid h-44 w-44 place-items-center" aria-hidden>
          {/* orbit rings */}
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <span className="absolute inset-3 rounded-full border border-white/10" />
          <span className="absolute inset-0 animate-orbit">
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-electric shadow-glow-lime" />
          </span>
          <span className="absolute inset-3 animate-orbit-rev">
            <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400" />
          </span>
          {/* pulsing core */}
          <span className="absolute inset-10 animate-breathe rounded-full bg-emerald-500/20" />
          <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-white/[0.08] ring-1 ring-white/15 backdrop-blur">
            <motion.span
              key={phase}
              initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <Active className="h-9 w-9 text-lime-electric" strokeWidth={1.8} />
            </motion.span>
          </span>
        </div>

        {/* status + prediction */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-[11.5px] font-semibold text-emerald-300 ring-1 ring-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            GUARDIAN ACTIVE
          </div>

          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4"
          >
            <h2 className="text-[24px] font-semibold tracking-tight sm:text-[28px]">
              {PHASE_LABELS[phase]}
              <span className="shimmer-text ml-1">…</span>
            </h2>
            <p className="mt-1 text-[13.5px] text-white/60">{scanPhaseDetails[phase]}</p>
          </motion.div>

          {/* scan progress dots */}
          <div className="mt-5 flex items-center gap-2" aria-hidden>
            {PHASE_ICONS.map((_, i) => (
              <motion.span
                key={i}
                animate={{
                  width: i === phase ? 28 : 8,
                  opacity: i === phase ? 1 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="h-2 rounded-full bg-lime-electric"
              />
            ))}
          </div>

          <div className="mt-7 grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-white/10">
              <p className="text-[11px] font-medium text-white/55">Savings found · this report</p>
              <AnimatedNumber
                value={savingsPrediction30d}
                prefix={`${currency} `}
                className="text-[22px] font-bold tabular-nums text-lime-electric"
              />
            </div>
            <div className="rounded-2xl bg-white/[0.06] px-4 py-3.5 ring-1 ring-white/10">
              <p className="text-[11px] font-medium text-white/55">Transactions analyzed</p>
              <AnimatedNumber
                value={txnCount}
                className="text-[22px] font-bold tabular-nums text-white"
              />
            </div>
          </div>
        </div>

        {/* financial score ring */}
        <div className="mx-auto text-center">
          <ProgressRing
            value={healthScore}
            size={150}
            stroke={11}
            color="#b6f04a"
            trackColor="rgba(255,255,255,0.1)"
          >
            <div>
              <AnimatedNumber value={healthScore} className="text-[36px] font-bold tabular-nums" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Financial score
              </p>
            </div>
          </ProgressRing>
          {healthScoreDeltaLabel && (
            <p className="mt-3 text-[12px] font-medium text-emerald-300">{healthScoreDeltaLabel}</p>
          )}
        </div>
      </div>
    </motion.section>
  );
}
