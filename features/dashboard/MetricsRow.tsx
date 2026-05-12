"use client";

import { MetricCard } from "@/components/ui/MetricCard";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type MetricsRowProps = {
  rmse: string;
  mae: string;
  stability: string;
  lastUpdated: ReactNode;
  className?: string;
};

export function MetricsRow({ rmse, mae, stability, lastUpdated, className }: MetricsRowProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      <MetricCard
        label="RMSE"
        value={rmse}
        sub="Root mean squared error"
        icon={<SigmaIcon />}
      />
      <MetricCard
        label="MAE"
        value={mae}
        sub="Mean absolute error"
        icon={<WaveIcon />}
      />
      <MetricCard
        label="Prediction Stability"
        value={stability}
        sub="Variance / drift score"
        icon={<ShieldIcon />}
      />
      <MetricCard
        label="Last Updated"
        value={lastUpdated}
        sub="Telemetry snapshot time"
        icon={<ClockIcon />}
      />
    </div>
  );
}

function SigmaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.5 4.5H7.8l6.4 7.5-6.4 7.5H18.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 14c2.2 0 2.2-4 4.4-4s2.2 4 4.4 4 2.2-4 4.4-4 2.2 4 4.4 4"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 19 6.8v6.2c0 5-3.5 8.3-7 9.5-3.5-1.2-7-4.5-7-9.5V6.8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8L15.8 9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 7.2v5.1l3.3 2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

