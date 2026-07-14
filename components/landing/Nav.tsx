"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#leak-detection", label: "Leak Detection" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** Floating pill navigation that condenses on scroll. */
export function Nav() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.82)"]);
  const shadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0 0 rgba(20,24,29,0)", "0 12px 40px -8px rgba(20,24,29,0.14)"]
  );

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <motion.nav
        style={{ background: bg, boxShadow: shadow }}
        className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-white/80 px-5 py-3 backdrop-blur-xl"
        aria-label="Primary"
      >
        <Link href="/" aria-label="Money Leak Detector home">
          <span className="sm:hidden"><Logo compact /></span>
          <span className="hidden sm:block"><Logo /></span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-slate-ink transition-colors hover:bg-mist hover:text-graphite"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium text-slate-ink transition-colors hover:text-graphite sm:block"
          >
            Sign in
          </Link>
          <MagneticButton
            href="/dashboard"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-graphite px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(20,24,29,0.45)] transition-shadow hover:shadow-[0_12px_32px_-6px_rgba(20,24,29,0.55)]"
          >
            Start Free
            <span className="text-lime-electric">→</span>
          </MagneticButton>
        </div>
      </motion.nav>
    </motion.header>
  );
}
