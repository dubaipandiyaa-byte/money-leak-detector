"use client";

import { useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteAccount } from "./actions";

/**
 * Two-step self-service account deletion. First click arms the control;
 * the second click actually deletes. Errors from the server action are
 * surfaced inline and the control disarms.
 */
export function DeleteAccountButton() {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!armed) {
      setArmed(true);
      setError(null);
      return;
    }
    startTransition(async () => {
      const result = await deleteAccount();
      if (result?.error) {
        setError(result.error);
        setArmed(false);
      }
    });
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          armed
            ? "rounded-full border border-risk bg-risk/20 px-6 py-2.5 text-[13.5px] font-bold uppercase tracking-[0.06em] text-[#f6a08a] transition-colors hover:bg-risk/30 disabled:opacity-60"
            : "rounded-full border border-risk/40 bg-risk/10 px-6 py-2.5 text-[13.5px] font-semibold text-[#f6a08a] transition-colors hover:border-risk/70 disabled:opacity-60"
        }
      >
        {pending
          ? "Deleting…"
          : armed
            ? "Click again to permanently delete"
            : "Delete my account"}
      </button>
      {armed && !pending && (
        <p className="mt-2.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ash">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk" />
          This permanently deletes your login and every saved report. It cannot
          be undone.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2.5 text-[12.5px] leading-relaxed text-[#f6a08a]">
          {error}
        </p>
      )}
    </div>
  );
}
