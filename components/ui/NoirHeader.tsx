import Link from "next/link";
import { NoirLogo } from "@/components/ui/NoirLogo";

/**
 * Noir counterpart of SimpleHeader — logo + single CTA on the dark premium
 * surfaces (auth pages, statement upload). SimpleHeader stays untouched for
 * the light utility pages.
 */
export function NoirHeader({ ctaLabel, ctaHref }: { ctaLabel: string; ctaHref: string }) {
  return (
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pt-7 sm:px-6">
      <Link href="/" aria-label="Back to home">
        <span className="sm:hidden">
          <NoirLogo compact />
        </span>
        <span className="hidden sm:block">
          <NoirLogo />
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
