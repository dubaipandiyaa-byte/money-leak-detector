"use client";

import { Cpu, FileText, Radar, IndianRupee } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Honest product facts — the stats-bar treatment without fabricated numbers.
 * Every figure here is a verifiable property of the product itself.
 */
const facts = [
  { icon: Cpu, value: "100%", label: "On-device analysis — statements never uploaded" },
  { icon: FileText, value: "16 sections", label: "In every AI Financial Intelligence Report" },
  { icon: Radar, value: "6 leak types", label: "Detected automatically in every scan" },
  { icon: IndianRupee, value: "₹0", label: "Full product, free during Beta" },
];

export function FactsBar() {
  return (
    <section className="border-y border-[rgba(212,175,55,0.14)] bg-noir-deep">
      <Reveal blur={false} y={14}>
        <div className="mx-auto grid max-w-7xl grid-cols-4 divide-x divide-white/5 px-6">
          {facts.map((f) => (
            <div key={f.value} className="flex items-center gap-4 px-8 py-7">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[rgba(212,175,55,0.3)] bg-[rgba(212,175,55,0.06)] text-gold">
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[22px] font-bold leading-tight tracking-tight text-ivory">{f.value}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-ash">{f.label}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
