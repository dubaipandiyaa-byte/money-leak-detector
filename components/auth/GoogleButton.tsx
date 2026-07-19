"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type CapacitorGlobal = {
  isNativePlatform?: () => boolean;
  Plugins?: {
    GoogleAuth?: { signIn: () => Promise<{ idToken: string }> };
  };
};

/**
 * "Continue with Google" via Supabase OAuth. Requires the Google provider to
 * be enabled in the Supabase dashboard (Authentication → Providers) — until
 * then Supabase returns an error, which is surfaced inline.
 *
 * Inside the Android shell the browser-redirect flow is impossible — Google
 * blocks OAuth in embedded WebViews (disallowed_useragent) — so there the
 * native GoogleAuth plugin obtains a Google ID token via Credential Manager
 * and it is exchanged directly with signInWithIdToken.
 */
export function GoogleButton({ next = "/" }: { next?: string }) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function signIn() {
    if (busy) return;
    setBusy(true);
    setErr(null);
    const supabase = createClient();

    const cap = (window as { Capacitor?: CapacitorGlobal }).Capacitor;
    if (cap?.isNativePlatform?.() && cap.Plugins?.GoogleAuth) {
      try {
        const { idToken } = await cap.Plugins.GoogleAuth.signIn();
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });
        if (error) throw new Error(error.message);
        location.assign(next);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Google sign-in failed.");
        setBusy(false);
      }
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setErr(error.message);
      setBusy(false);
    }
    // on success the browser navigates away to Google
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void signIn()}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-3 text-[14px] font-semibold text-ivory transition-colors hover:border-[rgba(212,175,55,0.35)] hover:bg-white/[0.06] disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
          <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.48 12c0-.73.13-1.43.35-2.09L2.18 7.07A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.86-3c-1.01.68-2.3 1.08-3.42 1.08-2.86 0-5.29-1.93-6.16-4.53l-3.66 2.84C3.99 20.53 7.7 23 12 23Z" />
        </svg>
        Continue with Google
      </button>
      {err && (
        <p role="alert" className="mt-2 text-center text-[12px] leading-relaxed text-[#f6a08a]">
          {err}
        </p>
      )}
    </div>
  );
}
