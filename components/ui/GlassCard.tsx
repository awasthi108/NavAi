"use client";

import { cn } from "@/lib/cn";
import type { PropsWithChildren } from "react";

type GlassCardProps = PropsWithChildren<{
  className?: string;
  variant?: "default" | "strong";
}>;

export function GlassCard({ className, variant = "default", children }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-xl)]",
        variant === "strong" ? "glass-strong" : "glass",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] opacity-60 [background:radial-gradient(900px_260px_at_22%_-18%,rgba(34,211,238,0.20),transparent_60%),radial-gradient(700px_260px_at_72%_-22%,rgba(59,130,246,0.16),transparent_60%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}

