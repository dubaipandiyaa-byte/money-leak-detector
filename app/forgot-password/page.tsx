import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, MailCheck } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { FormField } from "@/components/ui/FormField";
import { requestPasswordReset } from "./actions";

export const metadata: Metadata = {
  title: "Reset Your Password",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const { error, sent } = await searchParams;

  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Sign in →" ctaHref="/login" />

      <main className="relative mx-auto flex max-w-md flex-col px-5 pb-24 pt-16 sm:px-6">
        {sent ? (
          <div className="card-luxe rounded-card-lg p-8 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <MailCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-5 text-[22px] font-bold tracking-tight text-graphite">
              Check your email
            </h1>
            <p className="mt-3 text-[14.5px] leading-relaxed text-slate-ink">
              If an account exists for <strong className="font-semibold text-graphite">{sent}</strong>,
              a password reset link is on its way.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block rounded-full bg-graphite px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="eyebrow">Forgot password</p>
              <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[36px]">
                Reset your password
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-ink">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <div className="card-luxe rounded-card-lg p-6 sm:p-8">
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-2xl bg-risk-soft px-4 py-3 text-[13.5px] leading-relaxed text-risk"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <form action={requestPasswordReset} className="space-y-4">
                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-graphite py-3 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
                >
                  Send reset link
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-[13.5px] text-quiet">
              Remembered it?{" "}
              <Link href="/login" className="font-semibold text-emerald-600 underline-offset-2 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
