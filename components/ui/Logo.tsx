/** Money Leak Detector wordmark + glyph. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-graphite shadow-[0_4px_12px_rgba(20,24,29,0.25)]">
        {/* droplet being caught by a ring — "leak, sealed" */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3.5c2.8 3.4 5.5 6.4 5.5 9.6a5.5 5.5 0 1 1-11 0c0-3.2 2.7-6.2 5.5-9.6Z"
            fill="#b6f04a"
          />
          <circle cx="12" cy="13.4" r="2.3" fill="#14181d" opacity="0.85" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-lime-electric shadow-[0_0_8px_rgba(182,240,74,0.9)]" />
      </span>
      {!compact && (
        <span className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-graphite">
          Money Leak Detector
          <span className="ml-2 hidden rounded-full bg-mist px-2 py-0.5 text-[10px] font-medium tracking-wide text-quiet lg:inline">
            by DONRITHIK LABS
          </span>
        </span>
      )}
    </span>
  );
}
