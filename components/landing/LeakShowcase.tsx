"use client";

import { motion } from "framer-motion";
import { Repeat2, Copy, Landmark, CalendarClock, TrendingUp, Droplets } from "lucide-react";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";

/**
 * What DONRITHIK AI finds — the six leak types the analyzer actually
 * detects. Amounts are clearly-labeled illustrative examples, not user
 * statistics.
 */
const leakTypes = [
  {
    icon: Repeat2,
    title: "Subscription traps",
    body: "Recurring charges you stopped using but never cancelled — streaming, apps, memberships quietly renewing every month.",
    example: "e.g. ₹649/mo unused OTT plan → ₹7,788/yr",
  },
  {
    icon: Copy,
    title: "Duplicate payments",
    body: "The same merchant, the same amount, within days — usually a billing error, and usually refundable if you ask.",
    example: "e.g. ₹1,299 charged twice in 3 days",
  },
  {
    icon: Landmark,
    title: "Bank fees & charges",
    body: "IMPS charges, minimum-balance penalties, late fees, FX markups — small lines that repeat until they're a real number.",
    example: "e.g. ₹118/mo in avoidable charges",
  },
  {
    icon: CalendarClock,
    title: "Committed monthly costs",
    body: "EMIs, telecom, insurance, memberships — the fixed commitments that claim your income before you spend a single rupee by choice.",
    example: "e.g. ₹302/mo recharge → ₹3,624/yr committed",
  },
  {
    icon: TrendingUp,
    title: "Spending trend shifts",
    body: "Month-over-month comparison of income and spending — the AI shows you exactly when and how much your outflow rose.",
    example: "e.g. spending rose 18% from May to June",
  },
  {
    icon: Droplets,
    title: "Unwanted spending",
    body: "The bucket of purchases that bought you nothing you wanted — separated from routine and lifestyle so you can see it.",
    example: "e.g. ₹1,477 of pure leak in one statement",
  },
];

export function LeakShowcase() {
  return (
    <section id="what-ai-finds" className="relative bg-noir-soft py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-gold">What DONRITHIK AI Finds</p>
          <h2 className="mt-4 text-balance text-[44px] font-bold leading-tight tracking-[-0.025em] text-ivory">
            This is what your money looks like{" "}
            <span className="headline-gold">escaping.</span>
          </h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-parchment">
            Six kinds of leak, detected automatically in every scan — each one
            with the evidence, the math, and the exact fix.
          </p>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3" stagger={0.08}>
          {leakTypes.map((l) => (
            <motion.div
              key={l.title}
              variants={revealItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="card-noir group rounded-card-lg p-7"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.07)] text-gold transition-colors group-hover:bg-[rgba(212,175,55,0.14)]">
                  <l.icon className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <h3 className="text-[17.5px] font-semibold tracking-tight text-ivory">{l.title}</h3>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-ash">{l.body}</p>
              <p className="mt-4 inline-block rounded-full border border-[rgba(212,175,55,0.25)] bg-[rgba(212,175,55,0.05)] px-3.5 py-1.5 text-[12px] font-semibold text-gold-bright">
                {l.example}
              </p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.15} blur={false} y={12}>
          <p className="mt-10 text-center text-[12.5px] text-ash">
            Amounts shown are illustrative examples of each leak type — your report is built only from your own statement.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
