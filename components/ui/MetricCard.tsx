"use client";

import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function MetricCard({ label, value, sub, icon, className }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className={cn(
        "group relative overflow-hidden rounded-[18px] p-[1px]",
        "bg-[linear-gradient(135deg,rgba(34,211,238,0.35),rgba(59,130,246,0.18),rgba(148,163,184,0.10))]",
        className,
      )}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-24 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(34,211,238,0.0), rgba(34,211,238,0.65), rgba(59,130,246,0.25), rgba(34,211,238,0.0))",
        }}
      />

      <div className="relative rounded-[17px] glass p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-200/75">
              {label}
            </div>
            <div className="text-2xl font-semibold tracking-tight text-slate-50">{value}</div>
            {sub ? <div className="text-xs text-muted">{sub}</div> : null}
          </div>
          {icon ? (
            <div className="mt-0.5 text-cyan-300/85 opacity-80 transition-opacity duration-200 group-hover:opacity-100">
              {icon}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

