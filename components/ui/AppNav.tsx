"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Home, FileSearch, FolderClock, ChevronDown, User, LogOut } from "lucide-react";
import { NoirLogo } from "@/components/ui/NoirLogo";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/supabase/actions";
import { clearReport } from "@/lib/reportStorage";

const links = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/analyze", label: "Analyze Statement", icon: FileSearch, exact: false },
  { href: "/history", label: "History", icon: FolderClock, exact: false },
];

/**
 * The central hub navigation for authenticated users — consistent across
 * the landing page, analyze, history and account pages. Same noir bar as
 * the marketing nav; the current page is highlighted in gold.
 */
export function AppNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [initial, setInitial] = useState("•");

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const source =
          (data.user?.user_metadata?.full_name as string | undefined) || data.user?.email || "";
        if (source) setInitial(source.trim().charAt(0).toUpperCase());
      })
      .catch(() => {});
  }, []);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const accountActive = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(212,175,55,0.16)] bg-noir/95 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6"
      >
        <Link href="/" aria-label="Money Leak Detector home">
          <span className="lg:hidden">
            <NoirLogo compact />
          </span>
          <span className="hidden lg:block">
            <NoirLogo />
          </span>
        </Link>

        {/* below md the hub links stay visible as icon-only 44px targets */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {links.map((l) => {
            const active = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                aria-label={l.label}
                title={l.label}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium tracking-wide transition-colors md:px-4 ${
                  active
                    ? "bg-[rgba(212,175,55,0.12)] text-gold-bright"
                    : "text-parchment hover:text-gold-bright"
                }`}
              >
                <l.icon className="h-4 w-4 md:h-3.5 md:w-3.5" strokeWidth={2.1} />
                <span className="hidden md:inline">{l.label}</span>
              </Link>
            );
          })}
        </div>

        {/* account menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Account menu"
            className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 transition-colors ${
              accountActive || menuOpen
                ? "bg-[rgba(212,175,55,0.12)]"
                : "hover:bg-white/[0.05]"
            }`}
          >
            <span className="btn-gold grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold">
              {initial}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 text-parchment transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                {/* click-away layer */}
                <button
                  type="button"
                  aria-label="Close account menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                  tabIndex={-1}
                />
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
                  className="glass-noir absolute right-0 top-full z-50 mt-3 w-52 overflow-hidden rounded-2xl p-1.5"
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-colors ${
                      accountActive
                        ? "bg-[rgba(212,175,55,0.12)] text-gold-bright"
                        : "text-parchment hover:bg-white/[0.05] hover:text-gold-bright"
                    }`}
                  >
                    <User className="h-4 w-4" strokeWidth={2.1} />
                    My Account
                  </Link>
                  <div className="rule-gold mx-2 my-1.5" aria-hidden />
                  <form action={signOut} onSubmit={() => clearReport()}>
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13.5px] font-medium text-parchment transition-colors hover:bg-white/[0.05] hover:text-risk"
                    >
                      <LogOut className="h-4 w-4" strokeWidth={2.1} />
                      Logout
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
