"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";

export type SegmentedTab<T extends string> = { id: T; label: string };

type SegmentedTabsProps<T extends string> = {
  value: T;
  onChange: (id: T) => void;
  tabs: Array<SegmentedTab<T>>;
  className?: string;
};

export function SegmentedTabs<T extends string>({ value, onChange, tabs, className }: SegmentedTabsProps<T>) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-1 rounded-2xl p-1",
        "border border-[rgba(148,163,184,0.16)] bg-[rgba(2,6,23,0.55)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
      role="tablist"
      aria-label="View selector"
    >
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={cn(
              "relative rounded-2xl px-3 py-1.5 text-xs font-semibold tracking-tight",
              "transition-colors duration-150",
              active ? "text-slate-50" : "text-slate-200/70 hover:text-slate-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/35",
            )}
            role="tab"
            aria-selected={active}
          >
            {active ? (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-2xl border border-[rgba(34,211,238,0.22)] bg-[rgba(34,211,238,0.10)] shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_22px_rgba(34,211,238,0.10)]"
                transition={{ type: "spring", stiffness: 520, damping: 36 }}
              />
            ) : null}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

