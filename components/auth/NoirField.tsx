import { useId, type InputHTMLAttributes } from "react";

interface NoirFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Labeled input for the noir auth surfaces — dark glass, gold focus ring. */
export function NoirField({ label, ...props }: NoirFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-parchment">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[14.5px] text-ivory outline-none transition-all placeholder:text-ash/60 focus:border-[rgba(212,175,55,0.5)] focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)]"
      />
    </div>
  );
}
