"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ErrorChart } from "@/features/dashboard/ErrorChart";
import { EarthScene } from "@/features/dashboard/EarthScene";
import { SketchfabEmbed } from "@/features/dashboard/SketchfabEmbed";
import type { DashboardControls } from "@/features/dashboard/types";
import { cn } from "@/lib/cn";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
  const [view, setView] = useState<"r3f" | "sketchfab-earth" | "sketchfab-launch">("r3f");

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
            <div className="mt-1 text-xs text-muted">R3F scene + optional Sketchfab embed view.</div>
          </div>
          <SegmentedTabs
            value={view}
            onChange={setView}
            tabs={[
              { id: "r3f", label: "NavAI Earth" },
              { id: "sketchfab-earth", label: "Sketchfab Earth" },
              { id: "sketchfab-launch", label: "Launch" },
            ]}
          />
        </div>

        <div className="mt-4 overflow-hidden rounded-[18px] border border-[rgba(148,163,184,0.14)] bg-[rgba(2,6,23,0.46)]">
          <div className="relative h-[320px]">
            <div className="pointer-events-none absolute inset-0 navai-grid opacity-[0.20]" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.992 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.992 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                {view === "r3f" ? (
                  <EarthScene isRunning={!!isRunning} anomalyDetected={!!anomalyDetected} />
                ) : view === "sketchfab-earth" ? (
                  <div className="h-full p-3">
                    <SketchfabEmbed
                      title="LEGO Animated Saturn V Apollo 11 Rocket launch"
                      modelId="6d25ada102844d81b0b9b4149f720531"
                      className="h-full"
                    />
                  </div>
                ) : (
                  <div className="h-full p-3">
                    <SketchfabEmbed
                      title="Rocket animation"
                      modelId="f6a9a9be9605457cbdc00ac6914ff783"
                      className="h-full"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 text-xs text-muted">
              <span>{view === "r3f" ? "Orbit: 1.66 R⊕" : "External: Sketchfab"}</span>
              <span className="text-cyan-200/85">
                {view === "r3f" ? "GNSS constellation overlay" : "XR-ready embed"}
              </span>
              <span>{anomalyDetected ? "Integrity: Anomaly" : isRunning ? "Prediction: Active" : "Integrity: Nominal"}</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
