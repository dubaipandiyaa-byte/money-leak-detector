import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

/**
 * Shared logo + single-CTA header used by utility pages (/analyze,
 * /privacy, /terms). Shows the compact glyph-only logo below `sm` so the
 * wordmark never collides with the CTA button on narrow screens.
 */
export function SimpleHeader({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  return (
    <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 pt-8 sm:px-6">
      <Link href="/" aria-label="Back to home">
        <span className="sm:hidden">
          <Logo compact />
        </span>
        <span className="hidden sm:block">
          <Logo />
        </span>
      </Link>
      <Link
        href={ctaHref}
        className="whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-[12.5px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist sm:px-5 sm:text-[13px]"
      >
        {ctaLabel}
      </Link>
    </header>
  );
}
