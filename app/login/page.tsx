import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { FormField } from "@/components/ui/FormField";
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
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Create account →" ctaHref="/signup" />

      <main className="relative mx-auto flex max-w-md flex-col px-5 pb-24 pt-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[36px]">
            Sign in
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-ink">
            Access your saved reports from any device.
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

          <form action={login} className="space-y-4">
            <input type="hidden" name="next" value={next} />
            <FormField
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
            <FormField
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[12.5px] font-semibold text-emerald-600 underline-offset-2 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-graphite py-3 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13.5px] text-quiet">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-emerald-600 underline-offset-2 hover:underline">
            Create a free account
          </Link>
        </p>
      </main>
    </div>
  );
}
