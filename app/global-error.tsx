"use client";

import { useEffect } from "react";

/**
 * Catches an error thrown in the root layout itself — the one place
 * app/error.tsx can't reach, since that boundary lives inside the layout.
 * This replaces the entire document, so it defines its own <html>/<body>
 * and avoids any component that could itself be the thing that crashed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled root-layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fbfcfd",
          color: "#14181d",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
            Something went wrong.
          </h1>
          <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6, color: "#5b6570" }}>
            This is on us, not your data — nothing you uploaded was lost.
            Reloading usually fixes it.
          </p>
          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 12 }}>
            <button
              type="button"
              onClick={reset}
              style={{
                borderRadius: 999,
                background: "#14181d",
                color: "#fff",
                padding: "12px 24px",
                fontSize: 13.5,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this
                boundary replaces the whole document root; a full page
                navigation is the safe choice when the router/layout itself
                may be the thing that crashed. */}
            <a
              href="/"
              style={{
                borderRadius: 999,
                background: "#fff",
                color: "#14181d",
                padding: "12px 24px",
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
