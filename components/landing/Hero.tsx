"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroVisual } from "./HeroVisual";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="noise relative overflow-hidden pb-24 pt-40 sm:pt-44">
      <Aurora variant="hero" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-[12.5px] font-medium text-slate-ink shadow-float ring-1 ring-black/5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            AI Financial Guardian · Now protecting AED 4.2M monthly
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.45, ease }}
            className="text-balance text-[42px] font-bold leading-[1.04] tracking-[-0.03em] text-graphite sm:text-[58px] lg:text-[64px]"
          >
            Stop losing money you{" "}
            <span className="headline-gradient">never meant to spend.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease }}
            className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-ink"
          >
            Money Leak Detector continuously finds subscriptions, forgotten
            bills, duplicate payments, hidden charges, and wasteful spending
            patterns — <em className="not-italic font-semibold text-graphite">before they drain your wealth.</em>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-graphite px-7 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_40px_-8px_rgba(20,24,29,0.5)] transition-all hover:shadow-[0_20px_48px_-8px_rgba(20,24,29,0.6)]"
            >
              Start Free
              <span className="text-lime-electric transition-transform group-hover:translate-x-0.5">→</span>
            </MagneticButton>
            <MagneticButton
              href="#leak-detection"
              className="inline-flex items-center gap-2.5 rounded-full bg-white/80 px-6 py-3.5 text-[15px] font-semibold text-graphite shadow-float ring-1 ring-black/5 backdrop-blur transition-colors hover:bg-white"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">
                <Play className="ml-0.5 h-3 w-3 fill-current" />
              </span>
              Watch AI Demo
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="mt-10 flex items-center gap-6 text-[12.5px] text-quiet"
          >
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Free forever plan
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Read-only bank access
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              2-minute setup
            </span>
          </motion.div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
