import { Logo } from "@/components/ui/Logo";

/** Branded fallback shown by Next.js during route/data loading. */
export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas">
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid h-14 w-14 place-items-center">
          <span className="absolute inset-0 animate-breathe rounded-full bg-emerald-500/15" />
          <Logo compact />
        </div>
        <p className="text-[13px] font-medium text-quiet">Loading…</p>
      </div>
    </div>
  );
}
