"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, LayoutGrid, Droplets, Repeat2, Target, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { signOut } from "@/lib/supabase/actions";
import { clearReport } from "@/lib/reportStorage";

// Only "Command Center" is a real, working destination today. The rest are
// genuine roadmap items — rendered disabled with a "Soon" tag instead of as
// clickable buttons that silently do nothing.
const items = [
  { icon: LayoutGrid, label: "Command Center", active: true },
  { icon: Droplets, label: "Leaks", soon: true },
  { icon: Repeat2, label: "Subscriptions", soon: true },
  { icon: Target, label: "Goals", soon: true },
  { icon: Settings, label: "Settings", soon: true },
];

/** Floating glass top bar for the command center. */
export function DashboardNav({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <nav
        aria-label="Dashboard"
        className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5"
      >
        <Link href="/" aria-label="Back to home">
          <Logo compact />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              disabled={it.soon}
              aria-current={it.active ? "page" : undefined}
              title={it.soon ? `${it.label} — coming soon` : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                it.active
                  ? "btn-gold"
                  : it.soon
                    ? "cursor-not-allowed text-ash/60"
                    : "text-parchment hover:bg-white/[0.08]/[0.05] hover:text-ivory"
              }`}
            >
              <it.icon className="h-3.5 w-3.5" />
              {it.label}
              {it.soon && (
                <span className="rounded-full bg-mist px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-ash">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full bg-white/[0.05] text-parchment ring-1 ring-white/10 transition-colors hover:text-ivory"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk ring-2 ring-white" />
          </button>
          <span
            className="grid h-9 w-9 place-items-center rounded-full btn-gold text-[13px] font-bold"
            aria-label={`${name}'s profile`}
          >
            {initial}
          </span>
          <form action={signOut} onSubmit={() => clearReport()}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.05] text-parchment ring-1 ring-white/10 transition-colors hover:text-ivory"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </nav>
    </motion.header>
  );
}
