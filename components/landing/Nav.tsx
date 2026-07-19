"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NoirLogo } from "@/components/ui/NoirLogo";
import { signOut } from "@/lib/supabase/actions";
import { clearReport } from "@/lib/reportStorage";

const links = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#what-ai-finds", label: "What AI Finds" },
  { href: "#report-preview", label: "The Report" },
  { href: "#privacy-security", label: "Security" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/**
 * DONRITHIK noir navigation — a solid obsidian bar that sits in normal flow
 * above the hero image (never overlapping it) and stays pinned on scroll.
 */
export function Nav({ isSignedIn }: { isSignedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(212,175,55,0.16)] bg-noir/95 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6"
      >
        <Link href="/" aria-label="Money Leak Detector home" onClick={() => setOpen(false)}>
          <NoirLogo />
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium tracking-wide text-parchment transition-colors hover:text-gold-bright"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:text-gold-bright sm:block"
              >
                Dashboard
              </Link>
              <form action={signOut} onSubmit={() => clearReport()} className="hidden sm:block">
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:text-gold-bright"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-parchment transition-colors hover:text-gold-bright sm:block"
            >
              Sign In
            </Link>
          )}
          {/* New-user journey: Get Started → sign up → back to the landing
           * page (the authenticated home). Signed-in users get the direct
           * Analyze CTA instead. */}
          <Link
            href={isSignedIn ? "/analyze" : "/signup"}
            className="btn-gold inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em]"
          >
            {isSignedIn ? "Start Analysis" : "Get Started"}
            <span aria-hidden>→</span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-ivory transition-colors hover:bg-white/5 xl:hidden"
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
      </nav>

      {/* mobile menu panel (functional, styling pass comes in the mobile phase) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5 bg-noir px-6 pb-6 xl:hidden"
          >
            <div className="flex flex-col pt-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-parchment transition-colors hover:bg-white/5 hover:text-gold-bright"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 border-t border-white/5 pt-3">
                {isSignedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-[15px] font-medium text-parchment hover:bg-white/5"
                    >
                      Dashboard
                    </Link>
                    <form action={signOut} onSubmit={() => clearReport()}>
                      <button
                        type="submit"
                        className="block w-full rounded-xl px-4 py-3 text-left text-[15px] font-medium text-parchment hover:bg-white/5"
                      >
                        Sign Out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-[15px] font-medium text-parchment hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
