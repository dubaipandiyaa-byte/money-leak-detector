"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { insights } from "@/lib/data";

/** Conversational insight feed — the AI talking, not charts reporting. */
export function InsightFeed() {
  return (
    <section aria-label="AI insights" className="card-luxe rounded-card-lg p-7">
      <Reveal blur={false} y={12}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight text-graphite">AI Insights</h2>
            <p className="mt-1 text-[13px] text-quiet">Fresh observations from your guardian.</p>
          </div>
          <span className="relative grid h-10 w-10 place-items-center rounded-full bg-graphite">
            <Sparkles className="h-4 w-4 text-lime-electric" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>
        </div>
      </Reveal>

      <div className="mt-6 space-y-3.5">
        {insights.map((ins, i) => (
          <motion.div
            key={ins.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ x: 3 }}
            className="rounded-2xl bg-mist/60 p-4 ring-hairline transition-colors hover:bg-mist"
          >
            <p className="text-[13.5px] font-medium leading-relaxed text-graphite">
              {ins.message}
            </p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[12px] leading-relaxed text-quiet">{ins.sub}</p>
              <span className="shrink-0 rounded-full bg-lime-soft px-2.5 py-1 text-[10.5px] font-bold text-lime-deep">
                {ins.impact}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-full border border-black/[0.08] bg-white py-2.5 text-[13px] font-semibold text-graphite transition-colors hover:bg-mist"
      >
        Ask your guardian anything
      </button>
    </section>
  );
}
