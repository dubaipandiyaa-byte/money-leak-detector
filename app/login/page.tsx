import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { NoirField } from "@/components/auth/NoirField";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next = "/dashboard" } = await searchParams;

  return (
    <AuthShell ctaLabel="Create account →" ctaHref="/signup">
      <div className="mb-8">
        <p className="eyebrow-gold">Welcome back</p>
        <h1 className="mt-3 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory">
          Continue your Financial
          <br />
          <span className="headline-gold">Intelligence journey.</span>
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ash">
          Your reports and savings plans, on any device.
        </p>
      </div>

      <div className="glass-noir rounded-[2rem] p-6 sm:p-8">
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-2xl border border-risk/30 bg-risk/10 px-4 py-3 text-[13.5px] leading-relaxed text-[#f6a08a]"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <NoirField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <NoirField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="text-ash">You&apos;ll stay signed in on this device.</span>
            <Link
              href="/forgot-password"
              className="font-semibold text-gold-bright underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="btn-gold w-full rounded-full py-3.5 text-[14px] font-bold uppercase tracking-[0.08em]"
          >
            Sign In
          </button>
        </form>

        {/* Google sign-in stays hidden until the Google provider is enabled
         * in Supabase (Authentication → Providers). Set
         * NEXT_PUBLIC_GOOGLE_AUTH=1 in .env.local to show it — the button
         * itself is already fully wired. */}
        {process.env.NEXT_PUBLIC_GOOGLE_AUTH === "1" && (
          <>
            <div className="my-6 flex items-center gap-4" aria-hidden>
              <span className="rule-gold flex-1" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ash">or</span>
              <span className="rule-gold flex-1" />
            </div>
            <GoogleButton next={next} />
          </>
        )}
      </div>

      <p className="mt-6 text-center text-[13.5px] text-ash">
        New to DONRITHIK?{" "}
        <Link href="/signup" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
          Create Account
        </Link>
      </p>
    </AuthShell>
  );
}
