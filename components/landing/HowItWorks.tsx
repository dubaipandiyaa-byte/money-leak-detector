"use client";

import { motion } from "framer-motion";
import { FileUp, ScanSearch, ShieldCheck } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

const steps = [
  {
    icon: FileUp,
    step: "01",
    title: "Upload your statement",
    body: "Drop in a PDF or CSV export from any bank. It's read entirely in your browser — nothing is uploaded to a server.",
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ScanSearch,
    step: "02",
    title: "The AI reads every transaction",
    body: "Your whole statement is modeled in seconds: recurring charges, duplicate payments, fees, and what's routine versus what's drifting.",
    accent: "bg-lime-soft text-lime-deep",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "You get the exact fix",
    body: "Every leak arrives with the math done and the specific action to take — cancel, downgrade, or request a refund yourself in under a minute.",
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
            Three steps. Then you know exactly where it went.
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
            One statement, analyzed in about five seconds — no account linking required.
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
