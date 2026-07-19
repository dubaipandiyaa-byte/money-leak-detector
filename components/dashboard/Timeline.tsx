"use client";

import { motion } from "framer-motion";
import { CopyX, Droplets, TrendingUp, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { TimelineEvent } from "@/lib/data";

const toneMap: Record<
  TimelineEvent["tone"],
  { icon: typeof Droplets; dot: string; chip: string; sign: "-" | "+" }
> = {
  detected: { icon: CopyX, dot: "bg-risk", chip: "bg-risk-soft text-risk", sign: "-" },
  found: { icon: Droplets, dot: "bg-amber-signal", chip: "bg-amber-soft text-amber-signal", sign: "-" },
  predicted: { icon: TrendingUp, dot: "bg-gold", chip: "bg-mist text-parchment", sign: "+" },
  potential: { icon: Sparkles, dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700", sign: "+" },
};

/** The AI timeline: real detections and findings from the user's latest report. */
export function Timeline({ timeline, currency }: { timeline: TimelineEvent[]; currency: string }) {
  return (
    <section aria-label="AI timeline" className="card-luxe rounded-card-lg p-7">
      <Reveal blur={false} y={12}>
        <h2 className="text-[17px] font-semibold tracking-tight text-ivory">AI Timeline</h2>
        <p className="mt-1 text-[13px] text-ash">
          What your guardian caught, and what it sees coming.
        </p>
      </Reveal>

      <div className="relative mt-7">
        {/* the line itself, drawn on scroll */}
        <motion.span
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-gold via-fog to-fog"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        <ol className="space-y-7">
          {timeline.map((ev, i) => {
            const t = toneMap[ev.tone];
            return (
              <motion.li
                key={ev.id}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: 0.2 + i * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative pl-9"
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full ring-4 ring-white ${t.dot}`}
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-ivory">
                    {ev.when}
                  </span>
                  <span className="text-[11.5px] font-medium text-ash">{ev.label}</span>
                  {ev.amount !== undefined && (
                    <span className={`ml-auto rounded-full px-2.5 py-0.5 text-[11.5px] font-bold tabular-nums ${t.chip}`}>
                      {t.sign}
                      {currency} {ev.amount.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] font-semibold text-ivory">{ev.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-parchment">{ev.detail}</p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
