"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, LayoutGrid, Droplets, Repeat2, Target, Settings } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

const items = [
  { icon: LayoutGrid, label: "Command Center", active: true },
  { icon: Droplets, label: "Leaks" },
  { icon: Repeat2, label: "Subscriptions" },
  { icon: Target, label: "Goals" },
  { icon: Settings, label: "Settings" },
];

/** Floating glass top bar for the command center. */
export function DashboardNav() {
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
              aria-current={it.active ? "page" : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                it.active
                  ? "bg-graphite text-white shadow-[0_6px_16px_-4px_rgba(20,24,29,0.4)]"
                  : "text-slate-ink hover:bg-white/70 hover:text-graphite"
              }`}
            >
              <it.icon className="h-3.5 w-3.5" />
              {it.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full bg-white/70 text-slate-ink ring-1 ring-black/5 transition-colors hover:text-graphite"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk ring-2 ring-white" />
          </button>
          <span
            className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-[13px] font-bold text-white shadow-glow-emerald"
            aria-label="Raj's profile"
          >
            R
          </span>
        </div>
      </nav>
    </motion.header>
  );
}
