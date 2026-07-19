import type { Metadata } from "next";
import Link from "next/link";
import { Aurora } from "@/components/ui/Aurora";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden">
      <Aurora variant="dashboard" />
      <div className="relative mx-auto max-w-md px-6 text-center">
        <Link href="/" className="inline-block" aria-label="Money Leak Detector home">
          <Logo />
        </Link>
        <p className="eyebrow mt-10">404</p>
        <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-ivory sm:text-[36px]">
          This page leaked away.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-parchment">
          Whatever you were looking for isn&apos;t here. Let&apos;s get you
          back to somewhere real.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full btn-gold px-6 py-3 text-[13.5px] font-semibold"
          >
            Back to home
          </Link>
          <Link
            href="/analyze"
            className="rounded-full bg-white/[0.06] px-6 py-3 text-[13.5px] font-semibold text-ivory shadow-float ring-1 ring-white/10 transition-colors hover:bg-mist"
          >
            Analyze a statement
          </Link>
        </div>
      </div>
    </div>
  );
}
