"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MonitorSmartphone, Database, Trash2, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

/**
 * Privacy & Security — every claim here is implemented in the product:
 * in-browser parsing, RLS-protected storage, self-serve deletion, and the
 * published security/privacy/retention pages.
 */
const pillars = [
  {
    icon: MonitorSmartphone,
    title: "Analyzed on your device",
    body: "Your statement is parsed entirely inside your browser. The original file is never uploaded to any server we operate.",
  },
  {
    icon: Database,
    title: "Row-level secured storage",
    body: "If you create an account, only the resulting analysis is saved — protected by Postgres row-level security so only you can ever read it.",
  },
  {
    icon: Trash2,
    title: "Delete anytime",
    body: "Every saved report can be deleted from your history with one click, permanently. Your data is yours to keep — or erase.",
  },
  {
    icon: ShieldCheck,
    title: "Security-hardened by design",
    body: "TLS everywhere, strict security headers, no third-party analytics on your financial data. Our full policy is published, not promised.",
  },
];

export function PrivacySecurity() {
  return (
    <section id="privacy-security" className="relative bg-noir-soft py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-gold">Privacy &amp; Security</p>
          <h2 className="mt-4 text-balance text-[30px] font-bold sm:text-[36px] lg:text-[44px] leading-tight tracking-[-0.025em] text-ivory">
            Your statement never leaves{" "}
            <span className="headline-gold">your device.</span>
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-parchment">
            Built like a vault, documented like one too — every claim below
            links to the published policy behind it.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {pillars.map((p) => (
            <motion.div
              key={p.title}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="card-noir rounded-card-lg p-7"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] text-gold">
                <p.icon className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <h3 className="mt-5 text-[16.5px] font-semibold tracking-tight text-ivory">{p.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ash">{p.body}</p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} blur={false} y={12}>
          <p className="mt-10 text-center text-[13px] text-ash">
            Read the full details:{" "}
            <Link href="/security" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Security Policy</Link>
            {" · "}
            <Link href="/privacy" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Privacy Policy</Link>
            {" · "}
            <Link href="/data-retention" className="font-semibold text-gold-bright underline-offset-4 hover:underline">Data Retention &amp; Deletion</Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
