"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ErrorChart } from "@/features/dashboard/ErrorChart";
import { EarthScene } from "@/features/dashboard/EarthScene";
import type { DashboardControls } from "@/features/dashboard/types";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "framer-motion";

type VisualizationGridProps = {
  controls: DashboardControls;
  runNonce: number;
  isRunning?: boolean;
  anomalyDetected?: boolean;
  className?: string;
};

export function VisualizationGrid({
  controls,
  runNonce,
  isRunning,
  anomalyDetected,
  className,
}: VisualizationGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", className)}>
      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-200/70">
              Forecast Trace
            </div>
            <div className="mt-1 text-sm font-semibold tracking-tight text-slate-50">
              Predicted vs measured error dynamics
            </div>
            <div className="mt-1 text-xs text-muted">
              Production-grade telemetry chart (Recharts) with glow + trading-style tooltip.
            </div>
          </div>
          <div className="rounded-xl border border-[rgba(148,163,184,0.14)] bg-[rgba(2,6,23,0.45)] px-3 py-2 text-xs text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            Sampling: 1 Hz
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.14)] bg-[rgba(2,6,23,0.46)]">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 navai-grid opacity-[0.22]" />
            <div className="min-h-[320px]">
              <ErrorChart controls={controls} runNonce={runNonce} />
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-200/70">
              Orbital View
            </div>
            <div className="mt-1 text-sm font-semibold tracking-tight text-slate-50">
              3D Earth & satellite visualization
            </div>
            <div className="mt-1 text-xs text-muted">
              Live GNSS constellation scene with synchronized telemetry.
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.14)] bg-[rgba(2,6,23,0.46)]">
          <div className="relative h-[320px]">
            <div className="pointer-events-none absolute inset-0 navai-grid opacity-[0.20]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key="navai-earth"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.992 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.992 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <EarthScene isRunning={!!isRunning} anomalyDetected={!!anomalyDetected} />
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 text-xs text-muted">
              <span>Orbit: 1.66 R_E</span>
              <span className="text-cyan-200/85">GNSS constellation overlay</span>
              <span>{anomalyDetected ? "Integrity: Anomaly" : isRunning ? "Prediction: Active" : "Integrity: Nominal"}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
