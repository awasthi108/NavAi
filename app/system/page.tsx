const pipelineSteps = [
  {
    title: "Dataset",
    description: "GNSS residual streams, satellite class, clock error, and axis history.",
    icon: "database",
  },
  {
    title: "Preprocessing",
    description: "Windowing, normalization, feature alignment, and horizon encoding.",
    icon: "filter",
  },
  {
    title: "Model",
    description: "Ridge baseline and GRU sequence model selected by mission context.",
    icon: "model",
  },
  {
    title: "Prediction",
    description: "Forecast packets return error vectors, confidence, RMSE, and MAE.",
    icon: "pulse",
  },
  {
    title: "Output",
    description: "Charts, satellite state, insight cards, and operator telemetry update.",
    icon: "display",
  },
];

const flowNodes = [
  ["Next.js UI", "Controls, charts, satellite scene"],
  ["API Layer", "lib/api.ts contract"],
  ["FastAPI", "Prediction endpoint"],
  ["ML Runtime", "Ridge and GRU inference"],
  ["Response", "predictions, rmse, mae"],
];

const simulationEvents = [
  ["Run trigger", "Operator selects satellite, error axis, model, and horizon."],
  ["Prediction packet", "API response updates RMSE, MAE, and future residual points."],
  ["Graph extension", "Forecast line reveals ahead of historical telemetry."],
  ["Satellite feedback", "Scene speed and glow respond to active prediction state."],
];

export default function SystemRoute() {
  return (
    <div className="space-y-5">
      <section className="rounded-[var(--radius-xl)] border border-cyan-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_22px_70px_rgba(0,0,0,0.42)]">
        <SectionHeader
          eyebrow="Pipeline Visualization"
          title="GNSS prediction pipeline"
          meta="Dataset to operator output"
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-5">
          {pipelineSteps.map((step, index) => (
            <PipelineStep
              key={step.title}
              step={step}
              index={index}
              isLast={index === pipelineSteps.length - 1}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ModelFormulaCard />
        <GruDetailCard />
      </section>

      <section className="rounded-[var(--radius-xl)] border border-blue-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_22px_70px_rgba(0,0,0,0.38)]">
        <SectionHeader
          eyebrow="Data Flow"
          title="Frontend to backend prediction contract"
          meta="FastAPI integration ready"
        />

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.72fr]">
          <DataFlowDiagram />
          <div className="space-y-3">
            {flowNodes.map(([title, detail], index) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-400/10 bg-black/24 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-50">{title}</div>
                  <div className="rounded-full border border-cyan-300/16 bg-cyan-300/8 px-2.5 py-1 text-[11px] font-semibold text-cyan-100">
                    0{index + 1}
                  </div>
                </div>
                <div className="mt-2 text-sm leading-6 text-muted">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] border border-cyan-300/20 bg-slate-950/50 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_22px_70px_rgba(0,0,0,0.38)]">
        <SectionHeader
          eyebrow="Real-time Simulation"
          title="Prediction state drives both graph and satellite"
          meta="UI synchronization loop"
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          {simulationEvents.map(([title, detail], index) => (
            <SimulationCard key={title} title={title} detail={detail} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
}

function PipelineStep({
  step,
  index,
  isLast,
}: {
  step: (typeof pipelineSteps)[number];
  index: number;
  isLast: boolean;
}) {
  return (
    <article className="relative rounded-[18px] border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.70),rgba(2,6,23,0.52))] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_18px_54px_rgba(0,0,0,0.34)]">
      {!isLast ? (
        <div className="pointer-events-none absolute left-[calc(100%-8px)] top-10 z-10 hidden h-px w-8 bg-[linear-gradient(90deg,rgba(34,211,238,0.78),rgba(59,130,246,0.08))] shadow-[0_0_16px_rgba(34,211,238,0.45)] lg:block">
          <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-200 motion-safe:animate-pulse" />
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.14)]">
          <StepIcon type={step.icon} />
        </div>
        <div className="rounded-full border border-slate-400/12 bg-black/28 px-2.5 py-1 text-[11px] font-semibold text-slate-200/70">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      <h2 className="mt-4 text-base font-semibold text-slate-50">{step.title}</h2>
      <p className="mt-2 min-h-[72px] text-sm leading-6 text-muted">{step.description}</p>
    </article>
  );
}

function ModelFormulaCard() {
  return (
    <article className="rounded-[var(--radius-xl)] border border-cyan-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.10),0_22px_70px_rgba(0,0,0,0.38)]">
      <SectionHeader
        eyebrow="Model Details"
        title="Ridge Regression control baseline"
        meta="Long-horizon stability"
      />

      <div className="mt-5 rounded-[18px] border border-cyan-300/14 bg-black/30 p-5 font-mono text-sm text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="text-cyan-200/80">Objective</div>
        <div className="mt-3 text-lg font-semibold tracking-tight text-slate-50">
          y_hat = X * beta
        </div>
        <div className="mt-3 text-slate-300/78">
          beta = argmin ||y - Xb||2 + lambda ||b||2
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ModelMetric label="Best use" value="GEO drift" />
        <ModelMetric label="Runtime" value="Low" />
        <ModelMetric label="Behavior" value="Stable" />
      </div>
    </article>
  );
}

function GruDetailCard() {
  return (
    <article className="rounded-[var(--radius-xl)] border border-emerald-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(52,211,153,0.10),0_22px_70px_rgba(0,0,0,0.38)]">
      <SectionHeader
        eyebrow="Sequence Model"
        title="GRU temporal prediction path"
        meta="Short-window dynamics"
      />

      <div className="mt-5 grid gap-3">
        {[
          ["Input window", "Recent residuals and encoded mission controls enter as a time sequence."],
          ["Hidden state", "h_t carries short-term temporal memory across the forecast window."],
          ["Forecast head", "Dense output projects the next residual path and uncertainty metrics."],
        ].map(([title, detail]) => (
          <div key={title} className="rounded-2xl border border-emerald-300/12 bg-black/24 p-4">
            <div className="text-sm font-semibold text-emerald-100">{title}</div>
            <div className="mt-2 text-sm leading-6 text-muted">{detail}</div>
          </div>
        ))}
      </div>
    </article>
  );
}

function DataFlowDiagram() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-slate-400/10 bg-black/28 p-4">
      <svg viewBox="0 0 760 360" className="h-[360px] w-full" role="img" aria-label="NavAI frontend backend data flow">
        <defs>
          <marker id="flowArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(34,211,238,0.92)" />
          </marker>
          <linearGradient id="flowStroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0.95)" />
            <stop offset="55%" stopColor="rgba(59,130,246,0.82)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.82)" />
          </linearGradient>
          <filter id="flowGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="rgba(34,211,238,0.52)" />
          </filter>
        </defs>

        <FlowBox x={28} y={92} title="Next.js Frontend" detail="Operator controls + visualization" />
        <FlowBox x={220} y={92} title="API Adapter" detail="predictTimeSeries()" />
        <FlowBox x={412} y={92} title="FastAPI Service" detail="/predict endpoint" />
        <FlowBox x={604} y={92} title="ML Runtime" detail="Ridge + GRU" />
        <FlowBox x={316} y={244} title="Structured Response" detail="predictions, rmse, mae" wide />

        <AnimatedPath d="M 178 132 L 220 132" />
        <AnimatedPath d="M 370 132 L 412 132" />
        <AnimatedPath d="M 562 132 L 604 132" />
        <AnimatedPath d="M 684 172 C 684 238 558 282 496 282" />
        <AnimatedPath d="M 316 282 C 188 282 104 226 104 172" />

        <text x="314" y="42" fill="rgba(226,232,240,0.68)" fontSize="15" fontWeight="700">
          closed-loop inference path
        </text>
      </svg>
    </div>
  );
}

function FlowBox({
  x,
  y,
  title,
  detail,
  wide,
}: {
  x: number;
  y: number;
  title: string;
  detail: string;
  wide?: boolean;
}) {
  const width = wide ? 184 : 150;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="80"
        rx="18"
        fill="rgba(2,6,23,0.82)"
        stroke="rgba(34,211,238,0.24)"
        filter="url(#flowGlow)"
      />
      <text x={x + 18} y={y + 32} fill="rgba(248,250,252,0.95)" fontSize="14" fontWeight="700">
        {title}
      </text>
      <text x={x + 18} y={y + 56} fill="rgba(203,213,225,0.72)" fontSize="12">
        {detail}
      </text>
    </g>
  );
}

function AnimatedPath({ d }: { d: string }) {
  return (
    <path
      d={d}
      fill="none"
      stroke="url(#flowStroke)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="10 12"
      markerEnd="url(#flowArrow)"
      filter="url(#flowGlow)"
    >
      <animate attributeName="stroke-dashoffset" from="0" to="-44" dur="1.8s" repeatCount="indefinite" />
    </path>
  );
}

function SimulationCard({
  title,
  detail,
  index,
}: {
  title: string;
  detail: string;
  index: number;
}) {
  return (
    <article className="relative min-h-[210px] overflow-hidden rounded-[18px] border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.54))] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_18px_54px_rgba(0,0,0,0.34)]">
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(34,211,238,0.9),transparent)] motion-safe:animate-pulse" />
      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/18 bg-cyan-300/8 text-sm font-semibold text-cyan-100">
        {String(index + 1).padStart(2, "0")}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-50">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
    </article>
  );
}

function SectionHeader({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/80">
          {eyebrow}
        </div>
        <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-50">{title}</h1>
      </div>
      <div className="rounded-full border border-slate-400/12 bg-black/24 px-3 py-1.5 text-xs font-semibold text-slate-200/76">
        {meta}
      </div>
    </div>
  );
}

function ModelMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-400/10 bg-black/24 p-4">
      <div className="text-xs text-slate-300/68">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-50">{value}</div>
    </div>
  );
}

function StepIcon({ type }: { type: string }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "database") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3" {...common} />
        <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" {...common} />
        <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" {...common} />
      </svg>
    );
  }

  if (type === "filter") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z" {...common} />
      </svg>
    );
  }

  if (type === "model") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 7h10v10H7V7Z" {...common} />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" {...common} />
      </svg>
    );
  }

  if (type === "pulse") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3.5 12h4l2-5 5 12 2-7h4" {...common} />
      </svg>
    );
  }

  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16v11H4V5Z" {...common} />
      <path d="M9 20h6M12 16v4" {...common} />
    </svg>
  );
}
