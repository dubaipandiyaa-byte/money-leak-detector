import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { NoirField } from "@/components/auth/NoirField";
import { signup } from "./actions";

export const metadata: Metadata = {
  title: "Create Your Account",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; "check-email"?: string }>;
}) {
  const { error, "check-email": checkEmail } = await searchParams;

  return (
    <AuthShell ctaLabel="Sign in →" ctaHref="/login">
      {checkEmail ? (
        <div className="glass-noir rounded-[2rem] p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[rgba(212,175,55,0.35)] bg-[rgba(212,175,55,0.08)] text-gold">
            <MailCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-[22px] font-bold tracking-tight text-ivory">
            Check your email
          </h1>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ash">
            We sent a confirmation link to{" "}
            <strong className="font-semibold text-ivory">{checkEmail}</strong>. Click it to
            activate your account, then come back and sign in.
          </p>
          <Link
            href="/login"
            className="btn-gold mt-6 inline-block rounded-full px-7 py-3 text-[13.5px] font-bold uppercase tracking-[0.08em]"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <p className="eyebrow-gold">Free during Beta</p>
            <h1 className="mt-3 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory">
              Create your{" "}
              <span className="headline-gold">AI account.</span>
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ash">
              Save every report and pick up where you left off, on any device.
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

            <form action={signup} className="space-y-4">
              <NoirField
                label="Name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
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
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
              <NoirField
                label="Confirm Password"
                type="password"
                name="confirm"
                autoComplete="new-password"
                placeholder="Retype your password"
                minLength={8}
                required
              />
              <button
                type="submit"
                className="btn-gold w-full rounded-full py-3.5 text-[14px] font-bold uppercase tracking-[0.08em]"
              >
                Create My AI Account
              </button>
              <p className="text-center text-[12px] leading-relaxed text-ash">
                By continuing you agree to our{" "}
                <Link href="/terms" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </div>

          <p className="mt-6 text-center text-[13.5px] text-ash">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-gold-bright underline-offset-2 hover:underline">
              Sign In
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
