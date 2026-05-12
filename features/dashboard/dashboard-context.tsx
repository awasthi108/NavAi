"use client";

import type { DashboardControls } from "@/features/dashboard/types";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type PredictionPhase = "idle" | "loading" | "predicting";

type DashboardState = {
  controls: DashboardControls;
  setControls: (next: DashboardControls) => void;

  phase: PredictionPhase;
  isLoading: boolean;
  isPredicting: boolean;

  runRequestedId: number;
  runCompletedId: number;
  runPrediction: () => Promise<void>;
};

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [controls, setControls] = useState<DashboardControls>({
    satellite: "GEO",
    errorType: "Clock",
    model: "GRU",
    horizonMinutes: 120,
  });

  const [phase, setPhase] = useState<PredictionPhase>("idle");
  const [runRequestedId, setRunRequestedId] = useState(0);
  const [runCompletedId, setRunCompletedId] = useState(0);
  const latestReq = useRef(0);

  const runPrediction = useCallback(async () => {
    if (phase !== "idle") return;

    setPhase("loading");
    const reqId = latestReq.current + 1;
    latestReq.current = reqId;
    setRunRequestedId(reqId);

    await new Promise((r) => setTimeout(r, 2000));
    // If user spam-clicked or component re-rendered, only finalize latest request.
    if (latestReq.current !== reqId) return;

    setRunCompletedId(reqId);
    setPhase("predicting");

    // Keep 3D “predicting” boost briefly for cinematic sync.
    await new Promise((r) => setTimeout(r, 1200));
    if (latestReq.current !== reqId) return;
    setPhase("idle");
  }, [phase]);

  const value = useMemo<DashboardState>(() => {
    return {
      controls,
      setControls,
      phase,
      isLoading: phase === "loading",
      isPredicting: phase === "predicting",
      runRequestedId,
      runCompletedId,
      runPrediction,
    };
  }, [controls, phase, runCompletedId, runPrediction, runRequestedId]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

