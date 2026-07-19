"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { NoirHeader } from "@/components/ui/NoirHeader";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Shared noir shell for the auth pages: glass form card on the left,
 * luxury brand illustration (the AI guardians artwork + floating sample
 * insight chips) on the right for desktop. All content passed as children
 * keeps the server-action forms server-rendered.
 */
export function AuthShell({
  ctaLabel,
  ctaHref,
  children,
}: {
  ctaLabel: string;
  ctaHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-noir">
      {/* ambient gold light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.1),transparent)]"
      />
      <NoirHeader ctaLabel={ctaLabel} ctaHref={ctaHref} />

      <main className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-12 sm:px-6 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-16 lg:pt-16">
        {/* left: the form card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="mx-auto w-full max-w-[460px]"
        >
          {children}
        </motion.div>

        {/* right: luxury illustration — desktop only */}
        <motion.aside
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative hidden lg:block"
          aria-hidden
        >
          <div className="glass-noir relative overflow-hidden rounded-[2rem] p-5">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.14),transparent)]"
            />
            {/* the brand guardians artwork — shown complete, gently breathing */}
            <motion.div
              animate={{ scale: [1, 1.012, 1] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/images/auth-guardians.png"
                alt=""
                width={1536}
                height={1024}
                priority
                className="w-full rounded-2xl"
              />
            </motion.div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                  We detect. We protect. You save.
                </p>
                <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ash">
                  Every statement you analyze becomes a 16-section financial
                  intelligence report — leaks, subscriptions, cash flow, and a
                  personalized savings plan.
                </p>
              </div>
            </div>
            <p className="mt-3 text-[10.5px] text-ash/70">
              Brand artwork — the numbers shown are illustrative.
            </p>
          </div>
        </motion.aside>
      </main>
    </div>
  );
}
