"use client";

import { useNow } from "@/hooks/useNow";
import { cn } from "@/lib/cn";

type TopHeaderProps = {
  className?: string;
};

export function TopHeader({ className }: TopHeaderProps) {
  const { formatted } = useNow({ timeZone: "UTC" });

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16",
        "bg-[linear-gradient(180deg,rgba(0,0,0,0.72),rgba(0,0,0,0.22))]",
        "backdrop-blur-xl",
        "border-b border-[rgba(148,163,184,0.14)]",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex min-w-0 items-baseline gap-3">
          <div className="truncate text-[13px] font-semibold tracking-[0.18em] uppercase text-slate-200/80">
            NavAI
          </div>
          <div className="hidden sm:block text-sm font-semibold tracking-tight text-slate-50">
            NavAI – Real-Time GNSS Intelligence
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-full border border-[rgba(34,211,238,0.20)] bg-[rgba(2,6,23,0.45)] px-3 py-1.5 shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_18px_rgba(34,211,238,0.10)]">
            <span className="relative inline-flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/55" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.45)]" />
            </span>
            <span className="text-xs font-semibold tracking-[0.14em] uppercase text-slate-200/85">
              Live
            </span>
          </div>

          <div className="rounded-xl border border-[rgba(148,163,184,0.16)] bg-[rgba(2,6,23,0.48)] px-3 py-2 text-xs text-slate-200/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="text-muted">UTC</span>{" "}
            <span className="font-semibold tracking-tight text-slate-50">{formatted}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

