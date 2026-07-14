"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { insights } from "@/lib/data";

/** Conversational AI insight cards — chat-like, alternating alignment. */
export function InsightsShowcase() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="max-w-lg">
            <p className="eyebrow">Real-Time AI Insights</p>
            <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
              It doesn&apos;t show you charts. It talks to you.
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-slate-ink">
              Analytics tell you what happened. Your AI guardian tells you what
              it <em className="not-italic font-semibold text-graphite">means</em> — in plain
              language, with the fix already prepared. Calm, proactive, never
              robotic.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-float ring-1 ring-black/5">
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-graphite">
                <Sparkles className="h-4.5 w-4.5 text-lime-electric" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
              </span>
              <div>
                <p className="text-[13.5px] font-semibold text-graphite">Your AI Guardian</p>
                <p className="text-[12px] text-quiet">
                  Watching 4 accounts · 1,284 transactions · always on
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {insights.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 24, x: i % 2 ? 18 : -18 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
                whileHover={{ scale: 1.015 }}
                className={`glass max-w-[92%] rounded-3xl p-5 ${i % 2 ? "ml-auto rounded-tr-lg" : "rounded-tl-lg"}`}
              >
                <p className="text-[14.5px] font-medium leading-relaxed text-graphite">
                  {ins.message}
                </p>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-quiet">{ins.sub}</p>
                <span className="mt-3 inline-block rounded-full bg-lime-soft px-3 py-1 text-[11px] font-bold text-lime-deep">
                  {ins.impact}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
