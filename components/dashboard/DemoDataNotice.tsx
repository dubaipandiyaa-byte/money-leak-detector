"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, FlaskConical, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { loadReport, type LoadedReport } from "@/lib/reportStorage";

/**
 * Beta-stage honesty banner. Every widget below this point (Guardian card,
 * leaks, timeline, insights) renders illustrative sample data, not the
 * viewer's real finances — the Command Center isn't wired to a real
 * analysis yet. If a real analysis is saved locally, its true headline
 * numbers are surfaced here instead of inside the demo widgets, so nothing
 * on this page can be mistaken for the user's own information.
 */
export function DemoDataNotice() {
  const [saved, setSaved] = useState<LoadedReport | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // localStorage is client-only; reading it post-hydration (rather than
    // in a lazy initializer) avoids a server/client render mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadReport());
    setChecked(true);
  }, []);

  return (
    <Reveal blur={false} y={12} className="space-y-4">
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl bg-amber-soft px-4 py-3 text-[13px] font-medium text-amber-signal ring-1 ring-amber-signal/20">
        <FlaskConical className="h-4 w-4 shrink-0" />
        <span>
          <strong className="font-bold">Demo Dashboard —</strong> everything
          below (Guardian status, leaks, timeline, insights) is illustrative
          sample data for preview purposes. It is not connected to your real
          statement yet.
        </span>
      </div>

      {checked && saved && (
        <div className="card-luxe flex flex-wrap items-center justify-between gap-4 rounded-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Sparkles className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[13.5px] font-semibold text-graphite">
                Your real analysis is saved
                {saved.report.accountName ? ` for ${saved.report.accountName.split(" ")[0]}` : ""}
              </p>
              <p className="text-[12.5px] text-quiet">
                {saved.fileName} · kept {saved.report.currency}{" "}
                {Math.round(saved.report.net).toLocaleString()} of{" "}
                {saved.report.currency} {Math.round(saved.report.totalIncome).toLocaleString()} in
              </p>
            </div>
          </div>
          <Link
            href="/analyze"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-graphite px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-graphite/90"
          >
            View full report
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {checked && !saved && (
        <div className="card-luxe flex flex-wrap items-center justify-between gap-4 rounded-card p-5">
          <p className="text-[13px] text-quiet">
            Upload a statement to see your real numbers alongside this preview.
          </p>
          <Link
            href="/analyze"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-graphite px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-graphite/90"
          >
            Analyze a statement
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </Reveal>
  );
}
