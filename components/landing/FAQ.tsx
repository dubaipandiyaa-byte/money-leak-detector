"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/lib/data";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-white py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <p className="eyebrow">FAQ</p>
          <h2 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[44px]">
            Everything people ask before they start.
          </h2>
        </Reveal>

        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.05} y={16} blur={false}>
                <div
                  className={`overflow-hidden rounded-3xl border transition-colors duration-300 ${
                    isOpen ? "border-emerald-100 bg-emerald-50/40" : "border-black/[0.06] bg-canvas"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[15.5px] font-semibold text-graphite">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                        isOpen ? "bg-emerald-500 text-white" : "bg-mist text-slate-ink"
                      }`}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }}
                      >
                        <p className="px-6 pb-6 text-[14.5px] leading-relaxed text-slate-ink">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
