"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { Logo } from "@/components/ui/Logo";

/** Branded error boundary for uncaught rendering errors on any page. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface real errors to the console for debugging — this is genuine
    // error telemetry, not the removed debug tracing.
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden">
      <Aurora variant="dashboard" />
      <div className="relative mx-auto max-w-md px-6 text-center">
        <Link href="/" className="inline-block" aria-label="Money Leak Detector home">
          <Logo />
        </Link>
        <span className="mt-10 inline-grid h-12 w-12 place-items-center rounded-2xl bg-risk-soft text-risk">
          <AlertTriangle className="h-5.5 w-5.5" />
        </span>
        <h1 className="mt-5 text-balance text-[26px] font-bold leading-tight tracking-[-0.025em] text-graphite">
          Something went wrong.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-ink">
          This is on us, not your data — nothing you uploaded was lost.
          Reloading usually fixes it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-graphite px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-[13.5px] font-semibold text-graphite shadow-float ring-1 ring-black/5 transition-colors hover:bg-mist"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
