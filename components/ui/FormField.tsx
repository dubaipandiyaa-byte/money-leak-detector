import { useId, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

/** Labeled text input reusing the existing color/radius tokens — no new design system. */
export function FormField({ label, ...props }: FormFieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-graphite">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-2xl bg-mist px-4 py-3 text-[14.5px] text-graphite outline-none ring-1 ring-black/[0.06] transition-all placeholder:text-quiet focus:bg-white focus:ring-2 focus:ring-emerald-400"
      />
    </div>
  );
}
