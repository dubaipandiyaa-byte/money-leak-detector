"use client";

import { Trash2 } from "lucide-react";
import { deleteReport } from "@/lib/supabase/actions";

/** Permanently deletes one saved report, with a confirm step since it can't be undone. */
export function DeleteReportButton({ reportId, fileName }: { reportId: string; fileName: string }) {
  return (
    <form
      action={deleteReport.bind(null, reportId)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${fileName}"? This can't be undone.`)) e.preventDefault();
      }}
      className="absolute right-3 top-3 z-10"
    >
      <button
        type="submit"
        aria-label={`Delete ${fileName}`}
        title="Delete this report"
        className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-quiet opacity-0 shadow-float ring-1 ring-black/5 transition-opacity hover:text-risk focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
