"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Timer, FileSearch, FolderClock } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic hero. The supplied CEO artwork renders full-width, completely
 * clean — no text, buttons, gradients, or overlays are ever placed on it.
 * Every marketing element lives in the intro block BELOW the image. For
 * signed-in users a quick-action row (Analyze Statement / History) sits
 * directly under the primary CTAs — product access without touching the
 * marketing-focused top navigation.
 */
export function Hero({ isSignedIn = false }: { isSignedIn?: boolean }) {
  return (
    <section className="bg-noir">
      {/* ── The exact brand image: full-width cinematic banner. Desktop
       * (lg+) keeps the frozen 82vh band with the gentle 95vh vertical
       * compression. Below lg the artwork scales purely proportionally
       * (w-full h-auto) — the complete scene (CEO, both robots, laptop,
       * nameplate) is always fully visible, uncropped and undistorted, on
       * tablet and mobile. ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        className="lg:flex lg:h-[82vh] lg:items-center lg:overflow-hidden"
      >
        <Image
          src="/images/ceo-hero.png"
          alt="DONRITHIK — CEO & Founder of Money Leak Detector, flanked by the brand's AI guardians in front of a glowing world map"
          width={1535}
          height={1024}
          priority
          unoptimized
          sizes="100vw"
          className="h-auto w-full shrink-0 select-none lg:h-[95vh] lg:object-fill"
        />
      </motion.div>

      {/* ── Headline, description, CTAs — strictly below the image ─ */}
      <div className="relative overflow-hidden">
        {/* ambient gold light rising from beneath the image — never on it */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.13),transparent)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-14 text-center sm:pb-24 sm:pt-20">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="eyebrow-gold"
          >
            AI Financial Intelligence · Now in Beta
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
            className="mx-auto mt-6 max-w-4xl text-balance text-[38px] font-bold leading-[1.06] tracking-[-0.025em] text-ivory sm:text-[52px] lg:text-[64px] lg:leading-[1.03]"
          >
            We catch your money leaks.
            <br />
            <span className="headline-gold">We save your future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease }}
            className="mx-auto mt-7 max-w-2xl text-[17.5px] leading-relaxed text-parchment"
          >
            DONRITHIK AI reads every transaction in your bank statement — and
            finds the subscriptions, duplicate payments, hidden charges, and
            silent spending drift that drain your wealth{" "}
            <span className="font-semibold text-ivory">before you ever notice.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75, ease }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
          >
            <MagneticButton
              href="/analyze"
              className="btn-gold group inline-flex items-center gap-2.5 rounded-full px-9 py-4 text-[15px] font-bold uppercase tracking-[0.08em]"
            >
              Start Detecting Now
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </MagneticButton>
            <MagneticButton
              href="#how-it-works"
              className="glass-noir inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-ivory transition-colors hover:border-[rgba(212,175,55,0.35)]"
            >
              See How It Works
            </MagneticButton>
          </motion.div>

          {/* authenticated quick actions — product access below the CTAs */}
          {isSignedIn && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <Link
                href="/analyze"
                className="glass-noir inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-semibold text-parchment transition-colors hover:border-[rgba(212,175,55,0.4)] hover:text-gold-bright"
              >
                <FileSearch className="h-4 w-4 text-gold" strokeWidth={2.1} />
                Analyze Statement
              </Link>
              <Link
                href="/history"
                className="glass-noir inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-semibold text-parchment transition-colors hover:border-[rgba(212,175,55,0.4)] hover:text-gold-bright"
              >
                <FolderClock className="h-4 w-4 text-gold" strokeWidth={2.1} />
                History
              </Link>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] font-medium text-ash"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" strokeWidth={2.2} />
              Free during Beta
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gold" strokeWidth={2.2} />
              Analyzed on your device — never uploaded
            </span>
            <span className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-gold" strokeWidth={2.2} />
              First report in about 2 minutes
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
