"use client";

import { Field } from "@/components/ui/Field";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { RangeSlider } from "@/components/ui/RangeSlider";
import { Select } from "@/components/ui/Select";
import { useDashboard } from "@/features/dashboard/dashboard-context";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import type { ErrorAxis, ModelType, SatelliteClass } from "@/features/dashboard/types";

type ControlPanelProps = { className?: string };

export function ControlPanel({ className }: ControlPanelProps) {
  const { controls: value, setControls: onChange, runPrediction, isLoading } = useDashboard();
  const horizonLabel = formatHorizon(value.horizonMinutes);

  return (
    <GlassCard variant="strong" className={cn("p-5 glow-cyan", className)}>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-200/70">
            Control Panel
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight text-slate-50">
            Prediction configuration
          </div>
          <div className="mt-1 text-sm text-muted">
            Configure satellite class, error axis, and model. Run a forecast with neon-grade responsiveness.
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 rounded-2xl border border-[rgba(34,211,238,0.18)] bg-[rgba(2,6,23,0.46)] px-3 py-2 shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_26px_rgba(34,211,238,0.10)]">
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.45)]" />
          <span className="text-xs font-semibold tracking-tight text-slate-50">Inference Ready</span>
          <span className="text-xs text-muted">•</span>
          <span className="text-xs text-muted">Low-latency pipeline</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Field label="Satellite" hint="Orbital class">
            <Select<SatelliteClass>
              value={value.satellite}
              onChange={(satellite) => onChange({ ...value, satellite })}
              options={[
                { value: "GEO", label: "GEO – Geostationary" },
                { value: "MEO", label: "MEO – Medium Earth Orbit" },
              ]}
            />
          </Field>
        </div>

        <div className="lg:col-span-3">
          <Field label="Error Type" hint="Axis / clock">
            <Select<ErrorAxis>
              value={value.errorType}
              onChange={(errorType) => onChange({ ...value, errorType })}
              options={[
                { value: "X", label: "X Axis" },
                { value: "Y", label: "Y Axis" },
                { value: "Z", label: "Z Axis" },
                { value: "Clock", label: "Clock Bias" },
              ]}
            />
          </Field>
        </div>

        <div className="lg:col-span-3">
          <Field label="Model" hint="Forecast engine">
            <Select<ModelType>
              value={value.model}
              onChange={(model) => onChange({ ...value, model })}
              options={[
                { value: "Ridge", label: "Ridge Regression" },
                { value: "GRU", label: "GRU – Recurrent Net" },
              ]}
            />
          </Field>
        </div>

        <div className="lg:col-span-3">
          <Field label="Prediction Horizon" hint={horizonLabel}>
            <div className="rounded-xl border border-[rgba(148,163,184,0.18)] bg-[rgba(2,6,23,0.48)] px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <RangeSlider
                value={value.horizonMinutes}
                onChange={(horizonMinutes) => onChange({ ...value, horizonMinutes })}
                min={15}
                max={24 * 60}
                step={15}
                aria-label="Prediction horizon"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-muted">
                <span>15 min</span>
                <span>24 hr</span>
              </div>
            </div>
          </Field>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="text-xs text-muted">
          Output is a premium placeholder today; wire your real model endpoint later without changing UI contracts.
        </div>
        <motion.div whileHover={{ y: -1 }} transition={{ type: "spring", stiffness: 420, damping: 34 }}>
          <NeonButton onClick={runPrediction} disabled={isLoading}>
            <RocketIcon />
            {isLoading ? "Running…" : "Run Prediction"}
          </NeonButton>
        </motion.div>
      </div>
    </GlassCard>
  );
}

function formatHorizon(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const rem = minutes % 60;
  if (rem === 0) return `${hrs} hr`;
  return `${hrs} hr ${rem} min`;
}

function RocketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 4.5c2.9.3 5 2.5 5 5.4 0 5.3-5.6 9.9-11 9.9l-2 2-1-1 2-2c0-5.4 4.6-11 9.9-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 13.8l-2.9-2.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12.7 11.3a1.6 1.6 0 1 0-2.3-2.3 1.6 1.6 0 0 0 2.3 2.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

