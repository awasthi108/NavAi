"use client";

import { cn } from "@/lib/cn";
import type { PropsWithChildren, ReactNode } from "react";

type FieldProps = PropsWithChildren<{
  label: string;
  hint?: ReactNode;
  className?: string;
}>;

export function Field({ label, hint, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[11px] font-semibold tracking-[0.14em] text-slate-200/85 uppercase">
          {label}
        </div>
        {hint ? <div className="text-[11px] text-muted">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

