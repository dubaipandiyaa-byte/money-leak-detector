"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteReport } from "@/lib/supabase/actions";

/**
 * Permanently deletes one saved report. The confirm step is a noir modal
 * (matching the app's design language) instead of the native browser
 * dialog; the actual deletion still goes through the same server action.
 */
export function DeleteReportButton({ reportId, fileName }: { reportId: string; fileName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={`Delete ${fileName}`}
        title="Delete this report"
        onClick={() => setOpen(true)}
        className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/[0.05] text-ash opacity-0 ring-1 ring-white/10 transition-opacity hover:text-risk focus:opacity-100 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-6 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Confirm report deletion"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="glass-noir w-full max-w-sm rounded-[2rem] p-7 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-risk/40 bg-risk/10 text-risk">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-[18px] font-bold tracking-tight text-ivory">
                Delete this report?
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ash">
                <span className="font-semibold text-parchment">{fileName}</span> will be
                permanently removed from your account. This can&apos;t be undone.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[13px] font-semibold text-ivory transition-colors hover:bg-white/[0.08]"
                >
                  Keep it
                </button>
                <form action={deleteReport.bind(null, reportId)}>
                  <button
                    type="submit"
                    className="rounded-full bg-risk px-5 py-2.5 text-[13px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
                  >
                    Delete permanently
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
