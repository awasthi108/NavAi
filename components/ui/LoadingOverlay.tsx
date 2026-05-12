"use client";

import { AnimatePresence, motion } from "framer-motion";

type LoadingOverlayProps = {
  show: boolean;
  title?: string;
  subtitle?: string;
};

export function LoadingOverlay({ show, title = "Running prediction", subtitle = "Synthesizing GNSS error forecast…" }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-md" />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 520, damping: 38 }}
            className="relative w-[min(520px,calc(100vw-32px))] overflow-hidden rounded-[22px] border border-[rgba(148,163,184,0.16)] bg-[rgba(2,6,23,0.78)] p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_26px_90px_rgba(0,0,0,0.65)]"
          >
            <div className="pointer-events-none absolute -inset-24 opacity-70 blur-3xl [background:radial-gradient(circle,rgba(34,211,238,0.22),transparent_60%)]" />

            <div className="relative flex items-center gap-4">
              <Spinner />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-200/75">
                  {title}
                </div>
                <div className="mt-1 text-sm font-semibold tracking-tight text-slate-50">{subtitle}</div>
                <div className="mt-1 text-xs text-muted">Secure telemetry • Low-latency inference • Stability scoring</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Spinner() {
  return (
    <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-[rgba(34,211,238,0.22)] bg-[rgba(2,6,23,0.55)] shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_0_26px_rgba(34,211,238,0.12)]">
      <motion.div
        className="h-7 w-7 rounded-full border-2 border-cyan-300/20 border-t-cyan-300"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

