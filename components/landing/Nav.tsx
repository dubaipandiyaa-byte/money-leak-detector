"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { signOut } from "@/lib/supabase/actions";
import { clearReport } from "@/lib/reportStorage";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#leak-detection", label: "Leak Detection" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** Floating pill navigation that condenses on scroll, with a mobile menu. */
export function Nav({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);
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
        <Link href="/" aria-label="Money Leak Detector home" onClick={() => setOpen(false)}>
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
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium text-slate-ink transition-colors hover:text-graphite sm:block"
              >
                Dashboard
              </Link>
              <form action={signOut} onSubmit={() => clearReport()} className="hidden sm:block">
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium text-slate-ink transition-colors hover:text-graphite"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13.5px] font-medium text-slate-ink transition-colors hover:text-graphite sm:block"
            >
              Sign In
            </Link>
          )}
          <MagneticButton
            href="/analyze"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-graphite px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_8px_24px_-6px_rgba(20,24,29,0.45)] transition-shadow hover:shadow-[0_12px_32px_-6px_rgba(20,24,29,0.55)]"
          >
            {isSignedIn ? "Analyze" : "Start Free"}
            <span className="text-lime-electric">→</span>
          </MagneticButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-graphite transition-colors hover:bg-mist lg:hidden"
          >
            <motion.span
              key={open ? "x" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </button>
        </div>
      </motion.nav>

      {/* mobile menu panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="glass mx-auto mt-3 max-w-5xl rounded-3xl p-3 lg:hidden"
          >
            <div className="flex flex-col">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  className="rounded-2xl px-4 py-3 text-[15px] font-medium text-graphite transition-colors hover:bg-mist"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="mt-2 border-t border-black/[0.05] pt-3"
              >
                {isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-slate-ink transition-colors hover:bg-mist"
                    >
                      Dashboard
                    </Link>
                    <form action={signOut} onSubmit={() => clearReport()}>
                      <button
                        type="submit"
                        className="block w-full rounded-2xl px-4 py-3 text-left text-[15px] font-medium text-slate-ink transition-colors hover:bg-mist"
                      >
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-[15px] font-medium text-slate-ink transition-colors hover:bg-mist"
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
