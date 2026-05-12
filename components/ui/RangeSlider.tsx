"use client";

import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type RangeSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> & {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
};

export function RangeSlider({ className, value, onChange, min, max, step, ...props }: RangeSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-8">
        <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-[rgba(148,163,184,0.14)]" />
        <div
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full [background:linear-gradient(90deg,rgba(34,211,238,0.95),rgba(59,130,246,0.75))] shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_0_20px_rgba(34,211,238,0.18)]"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={cn(
            "absolute inset-0 w-full appearance-none bg-transparent",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-slate-950",
            "[&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(34,211,238,0.42),0_0_0_6px_rgba(34,211,238,0.12),0_14px_40px_rgba(0,0,0,0.55)]",
            "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150",
            "hover:[&::-webkit-slider-thumb]:scale-105 active:[&::-webkit-slider-thumb]:scale-95",
            "focus-visible:outline-none",
          )}
          aria-label={props["aria-label"] ?? "Range"}
          {...props}
        />
      </div>
    </div>
  );
}

