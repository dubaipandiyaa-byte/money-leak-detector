import { trustedCompanies } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";

/** Infinite logo marquee — duplicated list scrolls 50% for a seamless loop. */
export function TrustedBy() {
  const row = [...trustedCompanies, ...trustedCompanies];
  return (
    <section className="relative border-y border-black/[0.04] bg-white/60 py-10 backdrop-blur-sm">
      <Reveal blur={false} y={12}>
        <p className="mb-7 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-quiet">
          Trusted by teams at forward-thinking companies
        </p>
      </Reveal>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee items-center gap-16 px-8">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center gap-2.5 whitespace-nowrap text-[17px] font-semibold tracking-tight text-graphite/40"
              aria-hidden={i >= trustedCompanies.length}
            >
              <span className="h-2 w-2 rounded-sm bg-graphite/20" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
