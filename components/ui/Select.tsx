"use client";

import { cn } from "@/lib/cn";
import type { SelectHTMLAttributes } from "react";

type Option<T extends string> = { value: T; label: string };

type SelectProps<T extends string> = Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  value: T;
  onChange: (value: T) => void;
  options: Array<Option<T>>;
};

export function Select<T extends string>({ className, value, onChange, options, ...props }: SelectProps<T>) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className={cn(
          "w-full appearance-none rounded-xl px-3 py-2.5 text-sm",
          "bg-[rgba(2,6,23,0.55)] text-slate-100",
          "border border-[rgba(148,163,184,0.20)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
          "transition-[border-color,box-shadow,transform] duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35 focus-visible:border-cyan-300/40",
          "hover:border-[rgba(148,163,184,0.34)]",
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-slate-950">
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300/70">
        <ChevronDownIcon />
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.75 9.75L12 15l5.25-5.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

