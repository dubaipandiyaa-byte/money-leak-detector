"use client";

import { motion } from "framer-motion";
import {
  FileUp,
  ShieldCheck,
  BrainCircuit,
  FileText,
  PiggyBank,
  Droplets,
  Repeat2,
  TrendingUp,
  Lock,
  MonitorSmartphone,
  HandCoins,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

/** The five real stages of every analysis, shown before upload. */
const workflow = [
  { icon: FileUp, label: "Upload" },
  { icon: ShieldCheck, label: "Secure Processing" },
  { icon: BrainCircuit, label: "AI Analysis" },
  { icon: FileText, label: "Intelligence Report" },
  { icon: PiggyBank, label: "Savings Plan" },
];

const features = [
  {
    icon: Droplets,
    title: "Money Leaks",
    body: "Duplicate charges, avoidable fees, and spending that bought you nothing — found and itemized.",
  },
  {
    icon: Repeat2,
    title: "Hidden Subscriptions",
    body: "Recurring charges quietly renewing every month, with their true yearly cost spelled out.",
  },
  {
    icon: TrendingUp,
    title: "Spending Patterns",
    body: "Month-over-month cash flow, category concentration, and your biggest spending drivers.",
  },
  {
    icon: PiggyBank,
    title: "Personalized Savings",
    body: "A ranked plan built from your own numbers — with a projection of what following it is worth.",
  },
];

/** Every claim below is implemented product behavior, not marketing. */
const trust = [
  { icon: Lock, title: "256-bit TLS encryption", body: "Every connection to the app is encrypted in transit." },
  { icon: MonitorSmartphone, title: "Nothing uploaded", body: "Your statement is read inside your browser — the file never leaves your device." },
  { icon: HandCoins, title: "Data never sold", body: "No ads, no data brokers, no third-party analytics on your money." },
  { icon: Trash2, title: "Delete anytime", body: "Saved reports erase permanently with one click from your history." },
  { icon: ShieldCheck, title: "Privacy first", body: "Published security and retention policies — not promises." },
];

/** Connector between workflow steps: gold line with a travelling pulse. */
function Connector() {
  return (
    <div aria-hidden className="relative hidden h-px flex-1 overflow-hidden bg-[rgba(212,175,55,0.18)] lg:block">
      <motion.span
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
        animate={{ x: ["-100%", "300%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/**
 * Sections shown under the upload panel while no statement is loaded:
 * the AI workflow, what the AI detects, and the trust cards.
 */
export function UploadExtras() {
  return (
    <div className="mx-auto mt-20 max-w-6xl space-y-20">
      {/* ── AI workflow ────────────────────────────────────────── */}
      <Reveal>
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
          How your report is built
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-5">
          {workflow.map((s, i) => (
            <div key={s.label} className="contents">
              {i > 0 && <Connector />}
              {i > 0 && (
                <span aria-hidden className="text-[16px] text-gold lg:hidden">
                  ↓
                </span>
              )}
              <div className="glass-noir flex items-center gap-3 rounded-2xl px-5 py-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] text-gold">
                  <s.icon className="h-4.5 w-4.5" strokeWidth={2.1} />
                </span>
                <span className="whitespace-nowrap text-[13.5px] font-semibold text-ivory">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ── What the AI detects ────────────────────────────────── */}
      <div>
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            DONRITHIK AI detects
          </p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="card-noir rounded-card-lg p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] text-gold">
                <f.icon className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-ivory">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ash">{f.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>

      {/* ── Trust ──────────────────────────────────────────────── */}
      <div>
        <Reveal className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
            Built like a vault
          </p>
        </Reveal>
        <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" stagger={0.06}>
          {trust.map((t) => (
            <motion.div
              key={t.title}
              variants={revealItem}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="glass-noir rounded-3xl p-5 text-center"
            >
              <span className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] text-gold">
                <t.icon className="h-4.5 w-4.5" strokeWidth={2.1} />
              </span>
              <p className="mt-3 text-[13.5px] font-semibold text-ivory">{t.title}</p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ash">{t.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
        <Reveal delay={0.1} blur={false} y={10}>
          <p className="mt-6 text-center text-[12px] text-ash">
            Full details:{" "}
            <Link href="/security" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Security</Link>
            {" · "}
            <Link href="/privacy" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Privacy</Link>
            {" · "}
            <Link href="/data-retention" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Data Retention</Link>
          </p>
        </Reveal>
      </div>
    </div>
  );
}
