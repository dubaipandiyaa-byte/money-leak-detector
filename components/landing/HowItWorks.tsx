"use client";

import { motion } from "framer-motion";
import { Link2, ScanSearch, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

const steps = [
  {
    icon: Link2,
    step: "01",
    title: "Connect in 2 minutes",
    body: "Link your accounts through regulated, read-only open-banking rails. We can see the flow — we can never touch the money.",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "The AI learns your patterns",
    body: "Months of history are modeled in seconds: what's normal for you, what's drifting, what quietly changed price, and what you stopped using.",
    accent: "bg-lime-soft text-lime-deep",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Leaks get sealed",
    body: "Every leak arrives with the math done and a one-click fix. Cancel, downgrade, refund, re-route — most fixes take under a minute.",
    accent: "bg-mist text-graphite",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Three steps. Then it never stops watching.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
            You do the first two minutes. The AI does the rest of the year.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="card-luxe group relative overflow-hidden rounded-card-lg p-8"
            >
              <span className="absolute -right-3 -top-6 text-[110px] font-bold leading-none tracking-tighter text-mist transition-colors group-hover:text-fog">
                {s.step}
              </span>
              <div className={`relative grid h-12 w-12 place-items-center rounded-2xl ${s.accent}`}>
                <s.icon className="h-5.5 w-5.5" strokeWidth={2.2} />
              </div>
              <h3 className="relative mt-6 text-[19px] font-semibold tracking-tight text-graphite">
                {s.title}
              </h3>
              <p className="relative mt-2.5 text-[14.5px] leading-relaxed text-slate-ink">
                {s.body}
              </p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
