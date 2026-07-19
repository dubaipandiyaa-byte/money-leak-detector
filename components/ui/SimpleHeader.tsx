import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

/**
 * Shared logo + single-CTA header used by utility pages (/privacy, /terms,
 * error and not-found states). Noir styling to match the rest of the app.
 * Shows the compact glyph-only logo below `sm` so the wordmark never
 * collides with the CTA button on narrow screens.
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
        className="glass-noir whitespace-nowrap rounded-full px-4 py-2.5 text-[12.5px] font-semibold text-ivory transition-colors hover:border-[rgba(212,175,55,0.4)] sm:px-5 sm:text-[13px]"
      >
        {ctaLabel}
      </Link>
    </header>
  );
}
