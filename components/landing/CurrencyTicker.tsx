import { Globe2 } from "lucide-react";
import { WORLD_CURRENCIES } from "@/lib/analyzer";
import { Reveal } from "@/components/ui/Reveal";

const mask = {
  maskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
} as const;

function Row({ items, reverse = false }: { items: typeof WORLD_CURRENCIES; reverse?: boolean }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden" style={mask}>
      <div
        className="flex w-max animate-marquee items-center gap-3 px-4 py-1.5"
        style={reverse ? { animationDirection: "reverse", animationDuration: "56s" } : undefined}
      >
        {row.map((c, i) => (
          <span
            key={`${c.code}-${i}`}
            aria-hidden={i >= items.length}
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-4 py-2 shadow-float ring-1 ring-black/[0.05]"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-700">
              {c.symbol.slice(0, 2)}
            </span>
            <span className="text-[13px] font-bold tracking-wide text-graphite">{c.code}</span>
            <span className="hidden text-[11.5px] font-medium text-quiet sm:inline">{c.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Flowing wall of world currencies — every code the AI auto-detects. */
export function CurrencyTicker() {
  const half = Math.ceil(WORLD_CURRENCIES.length / 2);
  const top = WORLD_CURRENCIES.slice(0, half);
  const bottom = WORLD_CURRENCIES.slice(half);

  return (
    <section aria-label="Supported currencies" className="relative overflow-hidden py-20">
      <Reveal className="mx-auto max-w-2xl px-6 text-center">
        <p className="eyebrow inline-flex items-center gap-2">
          <Globe2 className="h-3.5 w-3.5" /> Every currency on Earth
        </p>
        <h2 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[38px]">
          Upload in any currency. The AI just knows.
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-slate-ink">
          Drop a statement from any bank, anywhere — DONRITHIK AI detects the
          currency automatically and builds your report in it. No settings, no
          dropdowns.
        </p>
      </Reveal>

      <div className="mt-12 space-y-4">
        <Row items={top} />
        <Row items={bottom} reverse />
      </div>
    </section>
  );
}
