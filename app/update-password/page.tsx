import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { FormField } from "@/components/ui/FormField";
import { updatePassword } from "./actions";

export const metadata: Metadata = {
  title: "Set a New Password",
};

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="Sign in →" ctaHref="/login" />

      <main className="relative mx-auto flex max-w-md flex-col px-5 pb-24 pt-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="eyebrow">Almost done</p>
          <h1 className="mt-4 text-balance text-[30px] font-bold leading-tight tracking-[-0.025em] text-graphite sm:text-[36px]">
            Set a new password
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-ink">
            Choose a new password for your account.
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

          <form action={updatePassword} className="space-y-4">
            <FormField
              label="New password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />
            <FormField
              label="Confirm new password"
              type="password"
              name="confirm"
              autoComplete="new-password"
              placeholder="Retype your new password"
              minLength={8}
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-graphite py-3 text-[14px] font-semibold text-white shadow-[0_12px_32px_-8px_rgba(20,24,29,0.5)] transition-shadow hover:shadow-[0_16px_40px_-8px_rgba(20,24,29,0.6)]"
            >
              Update password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
