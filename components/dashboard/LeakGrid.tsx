"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { LeakCard } from "@/components/leaks/LeakCard";
import type { Leak } from "@/lib/data";

/** Active leaks inside the command center, derived from the user's real latest report. */
export function LeakGrid({ leaks, currency }: { leaks: Leak[]; currency: string }) {
  const top = leaks.slice(0, 6);
  return (
    <section aria-label="Active leaks">
      <Reveal blur={false} y={14}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[20px] font-bold tracking-tight text-graphite">
              Active Leaks
            </h2>
            <p className="mt-0.5 text-[13.5px] text-quiet">
              From your latest report — each one a real recurring or duplicate charge.
            </p>
          </div>
          <Link
            href="/history"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist"
          >
            View full report →
          </Link>
        </div>
      </Reveal>
      {top.length === 0 ? (
        <div className="card-luxe rounded-card-lg p-8 text-center text-[14px] text-quiet">
          No leaks detected in your latest report — nice.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {top.map((leak, i) => (
            <LeakCard key={leak.id} leak={leak} index={i} currency={currency} />
          ))}
        </div>
      )}
    </section>
  );
}
