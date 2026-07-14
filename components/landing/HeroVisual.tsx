"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ShieldCheck, Zap, Droplets, TrendingUp } from "lucide-react";
import { AreaSpark } from "@/components/ui/charts";

const scanStates = [
  "Scanning 1,284 transactions…",
  "Analyzing spending behavior…",
  "Cross-checking subscriptions…",
  "Leak detected — Netflix Premium",
  "Duplicate charge flagged — AED 249",
  "Sealing leaks… AED 1,248 protected",
];

const flowRows = [
  { name: "Netflix Premium", amount: "AED 56/mo", status: "leak", delay: 1.2 },
  { name: "Salary — Emirates NBD", amount: "+AED 24,500", status: "flow", delay: 1.6 },
  { name: "FitLab Gym", amount: "AED 349/mo", status: "leak", delay: 2.0 },
  { name: "DEWA — duplicate", amount: "AED 249 ×2", status: "duplicate", delay: 2.4 },
  { name: "Adobe CC — unused", amount: "AED 251/mo", status: "leak", delay: 2.8 },
];

/**
 * Hero visualization: a live "AI command deck" — scanning beam, streaming
 * transactions being classified, savings counter climbing, orbiting particles.
 */
export function HeroVisual() {
  const [scanIdx, setScanIdx] = useState(0);
  const [protectedAmt, setProtectedAmt] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanIdx((i) => (i + 1) % scanStates.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const target = 1248;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 3200, 1);
      setProtectedAmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[540px]"
      aria-hidden
    >
      {/* orbiting accent particles */}
      <div className="absolute -inset-8 animate-orbit">
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-lime-electric shadow-glow-lime" />
      </div>
      <div className="absolute -inset-14 animate-orbit-rev">
        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400 opacity-80 shadow-glow-emerald" />
      </div>

      {/* main deck */}
      <div className="glass relative overflow-hidden rounded-[2rem] p-6">
        {/* scanning beam */}
        <div className="pointer-events-none absolute inset-x-6 top-0 bottom-0 overflow-hidden">
          <div className="animate-scanline absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-emerald-200/40 to-transparent" />
        </div>

        {/* header row */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-graphite">
              <ShieldCheck className="h-5 w-5 text-lime-electric" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-graphite">AI Guardian</p>
              <motion.p
                key={scanIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-[12px] text-quiet"
              >
                {scanStates[scanIdx]}
              </motion.p>
            </div>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            LIVE
          </div>
        </div>

        {/* protected counter */}
        <div className="relative mt-6 rounded-3xl bg-gradient-to-br from-graphite to-[#242b33] p-5 text-white">
          <p className="text-[12px] font-medium text-white/60">Protected this month</p>
          <p className="mt-1 text-[34px] font-bold tracking-tight tabular-nums">
            <span className="text-[18px] font-semibold text-lime-electric">AED </span>
            {protectedAmt.toLocaleString()}
          </p>
          <div className="mt-3 h-12">
            <AreaSpark
              data={[12, 18, 15, 26, 24, 38, 34, 52, 61, 74]}
              color="#b6f04a"
              width={440}
              height={48}
              className="h-full w-full"
            />
          </div>
          <div className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-lime-electric">
            <TrendingUp className="h-3 w-3" /> +23% vs June
          </div>
        </div>

        {/* streaming transaction classification */}
        <div className="relative mt-5 space-y-2.5">
          {flowRows.map((row) => (
            <motion.div
              key={row.name}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: row.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 ring-hairline"
            >
              <div className="flex items-center gap-3">
                {row.status === "flow" ? (
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </span>
                ) : row.status === "duplicate" ? (
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-soft">
                    <Zap className="h-4 w-4 text-amber-signal" />
                  </span>
                ) : (
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-risk-soft">
                    <Droplets className="h-4 w-4 text-risk" />
                  </span>
                )}
                <div>
                  <p className="text-[13px] font-semibold text-graphite">{row.name}</p>
                  <p className="text-[11px] text-quiet">
                    {row.status === "flow"
                      ? "Healthy flow"
                      : row.status === "duplicate"
                        ? "Duplicate payment"
                        : "Leak detected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[13px] font-semibold tabular-nums text-graphite">
                  {row.amount}
                </span>
                {row.status !== "flow" && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: row.delay + 0.5, type: "spring", stiffness: 300, damping: 15 }}
                    className="rounded-full bg-lime-soft px-2 py-0.5 text-[10px] font-bold text-lime-deep"
                  >
                    SEAL
                  </motion.span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* floating satellite cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="glass absolute -left-6 top-20 hidden rounded-2xl px-4 py-3 lg:block"
        style={{ animation: "breathe 6s ease-in-out infinite" }}
      >
        <p className="text-[11px] font-medium text-quiet">Leaks found</p>
        <p className="text-[22px] font-bold text-graphite">
          9 <span className="text-[12px] font-semibold text-risk">−AED 963/mo</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="glass absolute -right-8 bottom-24 hidden rounded-2xl px-4 py-3 lg:block"
      >
        <p className="text-[11px] font-medium text-quiet">Yearly savings unlocked</p>
        <p className="text-[22px] font-bold text-emerald-600">AED 11,496</p>
      </motion.div>
    </motion.div>
  );
}
