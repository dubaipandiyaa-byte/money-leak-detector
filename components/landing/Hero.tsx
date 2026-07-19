"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Timer } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic hero. The supplied CEO artwork renders full-width, completely
 * clean — no text, buttons, gradients, or overlays are ever placed on it.
 * Every marketing element lives in the intro block BELOW the image.
 */
export function Hero() {
  return (
    <section className="bg-noir">
      {/* ── The exact brand image: full-width cinematic banner in a 75vh
       * band. The image renders at 90vh instead of its ~107vh natural
       * height — a gentle vertical compression that keeps proportions
       * believable — and the small remainder is trimmed evenly from the
       * outermost top/bottom edges. Logo, robots, portrait and nameplate
       * all stay fully visible. ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease }}
        className="flex h-[82vh] items-center overflow-hidden"
      >
        <Image
          src="/images/ceo-hero.png"
          alt="DONRITHIK — CEO & Founder of Money Leak Detector, flanked by the brand's AI guardians in front of a glowing world map"
          width={1535}
          height={1024}
          priority
          unoptimized
          sizes="100vw"
          className="h-[95vh] w-full shrink-0 select-none object-fill"
        />
      </motion.div>

      {/* ── Headline, description, CTAs — strictly below the image ─ */}
      <div className="relative overflow-hidden">
        {/* ambient gold light rising from beneath the image — never on it */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.13),transparent)]"
        />
        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
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
            className="mx-auto mt-6 max-w-4xl text-balance text-[64px] font-bold leading-[1.03] tracking-[-0.025em] text-ivory"
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
            className="mt-10 flex items-center justify-center gap-5"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.05 }}
            className="mt-12 flex items-center justify-center gap-8 text-[13px] font-medium text-ash"
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
