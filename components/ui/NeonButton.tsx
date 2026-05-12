"use client";

import { cn } from "@/lib/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type NeonButtonProps = Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
  children: ReactNode;
  glow?: "cyan" | "none";
};

export function NeonButton({ className, glow = "cyan", disabled, children, ...props }: NeonButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 30 }}
      disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-tight",
        "text-slate-950",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        glow === "cyan" &&
          "bg-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.30),0_12px_40px_rgba(34,211,238,0.16)]",
        glow === "none" && "bg-slate-200",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(closest-side,rgba(34,211,238,0.55),transparent_70%)]" />
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-80 [background:linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,255,255,0.0))] mix-blend-overlay" />
      {children}
    </motion.button>
  );
}

