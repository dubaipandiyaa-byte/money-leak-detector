/**
 * DONRITHIK noir wordmark — gold infinity mark (clock ∞ dollar, "time and
 * money") with the brand strapline, for dark surfaces only.
 */
export function NoirLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <svg width="40" height="22" viewBox="0 0 44 24" fill="none" aria-hidden>
        {/* left loop: clock */}
        <circle cx="11" cy="12" r="8.5" stroke="#d4af37" strokeWidth="2.2" />
        <path d="M11 7.5V12l3 2" stroke="#d4af37" strokeWidth="1.7" strokeLinecap="round" />
        {/* crossing strokes joining the loops */}
        <path d="M18.5 7.5C21.5 10 22.5 14 25.5 16.5" stroke="#d4af37" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18.5 16.5C21.5 14 22.5 10 25.5 7.5" stroke="#d4af37" strokeWidth="2.2" strokeLinecap="round" />
        {/* right loop: dollar */}
        <circle cx="33" cy="12" r="8.5" stroke="#d4af37" strokeWidth="2.2" />
        <text x="33" y="16.2" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#d4af37" fontFamily="inherit">
          $
        </text>
      </svg>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="whitespace-nowrap text-[13.5px] font-bold tracking-[0.14em] text-ivory">
            MONEY LEAK DETECTOR
          </span>
          <span className="mt-1 whitespace-nowrap text-[8.5px] font-semibold tracking-[0.24em] text-gold">
            WE CAUGHT YOU. WE SAVE YOU.
          </span>
        </span>
      )}
    </span>
  );
}
