"use client";

import { Reveal } from "@/components/ui/Reveal";
import { LeakCard } from "@/components/leaks/LeakCard";
import { leaks } from "@/lib/data";

/** Active leaks inside the command center — the signature experience. */
export function LeakGrid() {
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
              Each fix takes one click. I&apos;ve already done the math.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist"
          >
            View all {leaks.length} leaks →
          </button>
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {top.map((leak, i) => (
          <LeakCard key={leak.id} leak={leak} index={i} />
        ))}
      </div>
    </section>
  );
}
