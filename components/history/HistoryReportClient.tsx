"use client";

import { useRouter } from "next/navigation";
import { ReportView } from "@/components/analyze/ReportView";
import type { Report } from "@/lib/analyzer";

/**
 * Thin client wrapper so the Server Component page can pass real data
 * straight into the existing ReportView while still supplying a working
 * client-side "back" handler (Server Components can't pass functions as
 * props across the boundary).
 */
export function HistoryReportClient({ report, fileName }: { report: Report; fileName: string }) {
  const router = useRouter();
  return (
    <ReportView
      report={report}
      fileName={fileName}
      syncStatus="saved"
      resetLabel="Back to history"
      onReset={() => router.push("/history")}
    />
  );
}
