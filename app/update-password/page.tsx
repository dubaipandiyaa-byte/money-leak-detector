import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { NoirField } from "@/components/auth/NoirField";
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
    <AuthShell ctaLabel="Sign in →" ctaHref="/login">
      <div className="mb-8">
        <p className="eyebrow-gold">Almost done</p>
        <h1 className="mt-3 text-balance text-[34px] font-bold leading-tight tracking-[-0.025em] text-ivory">
          Set a new{" "}
          <span className="headline-gold">password.</span>
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-ash">
          Choose a new password for your account.
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

        <form action={updatePassword} className="space-y-4">
          <NoirField
            label="New password"
            type="password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />
          <NoirField
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
            className="btn-gold w-full rounded-full py-3.5 text-[14px] font-bold uppercase tracking-[0.08em]"
          >
            Update password
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
