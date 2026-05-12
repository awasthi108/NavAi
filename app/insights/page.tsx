const modelComparison = [
  {
    name: "Ridge Regression",
    summary: "Linear baseline with low variance under long horizon GEO drift.",
    rmse: "0.78 m",
    stability: "96.1%",
    score: 82,
    badges: ["Best for GEO", "Stable long horizon", "Low compute"],
    signals: [
      ["MEO short-term", "Moderate"],
      ["GEO drift", "Strong"],
      ["Clock spikes", "Limited"],
    ],
    accent: "cyan",
  },
  {
    name: "GRU Model",
    summary: "Temporal sequence learner tuned for short-term residual structure.",
    rmse: "0.62 m",
    stability: "91.4%",
    score: 91,
    badges: ["Best for MEO", "Short-term pattern", "Drift in GEO"],
    signals: [
      ["MEO short-term", "Strong"],
      ["GEO drift", "Watch"],
      ["Clock spikes", "Strong"],
    ],
    accent: "emerald",
  },
];

const horizonSeries = {
  short: [
    [8, 132],
    [20, 124],
    [32, 116],
    [44, 111],
    [56, 107],
    [68, 105],
    [80, 102],
    [92, 100],
  ],
  long: [
    [8, 132],
    [20, 121],
    [32, 108],
    [44, 92],
    [56, 76],
    [68, 60],
    [80, 42],
    [92, 24],
  ],
};

const histogramBins = [
  { label: "-1.8", value: 18 },
  { label: "-1.2", value: 42 },
  { label: "-0.6", value: 76 },
  { label: "0.0", value: 62 },
  { label: "0.6", value: 91 },
  { label: "1.2", value: 38 },
  { label: "1.8", value: 24 },
  { label: "2.4", value: 16 },
];

const keyInsights = [
  {
    title: "GRU performs better in short-term temporal patterns",
    detail:
      "Sequence memory tracks fast MEO residual changes and reduces near-term RMSE by 20.5% against the Ridge baseline.",
    impact: "High",
  },
  {
    title: "Ridge is stable for long-term GEO predictions",
    detail:
      "Lower variance behavior keeps 24 hr GEO drift projections bounded when the residual slope changes slowly.",
    impact: "Medium",
  },
  {
    title: "Clock error tails are not Gaussian",
    detail:
      "Distribution mass shifts into the positive tail, indicating burst behavior that should be modeled separately.",
    impact: "High",
  },
  {
    title: "Hybrid routing is recommended",
    detail:
      "Use GRU for short MEO windows and Ridge for long GEO windows until backend ensemble weighting is available.",
    impact: "Action",
  },
];

export default function InsightsRoute() {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-2">
        {modelComparison.map((model) => (
          <ModelCard key={model.name} model={model} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[var(--radius-xl)] border border-cyan-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_22px_70px_rgba(0,0,0,0.42)]">
          <SectionHeader
            label="Prediction Horizon Analysis"
            title="15 min forecast stays compact while 24 hr drift diverges"
            meta="Residual envelope comparison"
          />

          <div className="mt-5 overflow-hidden rounded-[18px] border border-slate-400/10 bg-black/28 p-4">
            <HorizonChart />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <HorizonStat label="15 min endpoint" value="0.41 m" tone="cyan" />
            <HorizonStat label="24 hr endpoint" value="1.92 m" tone="amber" />
            <HorizonStat label="Divergence ratio" value="4.7x" tone="rose" />
          </div>
        </div>

        <div className="rounded-[var(--radius-xl)] border border-blue-300/20 bg-slate-950/55 p-5 shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_22px_70px_rgba(0,0,0,0.38)]">
          <SectionHeader
            label="Error Distribution"
            title="Histogram exposes asymmetric residual tails"
            meta="Clock axis residuals"
          />

          <div className="mt-5 rounded-[18px] border border-slate-400/10 bg-black/28 px-4 pb-4 pt-6">
            <Histogram />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <DistributionMetric label="Skew" value="+0.74" />
            <DistributionMetric label="Kurtosis" value="4.8" />
          </div>
        </div>
      </section>

      <section className="rounded-[var(--radius-xl)] border border-cyan-300/20 bg-slate-950/50 p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_22px_70px_rgba(0,0,0,0.38)]">
        <SectionHeader
          label="Key Insights"
          title="Model intelligence summary"
          meta="Operational recommendations"
        />

        <div className="mt-5 grid gap-4 lg:grid-cols-4">
          {keyInsights.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ModelCard({ model }: { model: (typeof modelComparison)[number] }) {
  const glow =
    model.accent === "emerald"
      ? "border-emerald-300/22 shadow-[0_0_0_1px_rgba(52,211,153,0.12),0_22px_70px_rgba(0,0,0,0.42)]"
      : "border-cyan-300/22 shadow-[0_0_0_1px_rgba(34,211,238,0.12),0_22px_70px_rgba(0,0,0,0.42)]";
  const bar =
    model.accent === "emerald"
      ? "bg-[linear-gradient(90deg,rgba(52,211,153,0.95),rgba(34,211,238,0.72))]"
      : "bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(59,130,246,0.72))]";

  return (
    <article className={`rounded-[var(--radius-xl)] border bg-slate-950/58 p-5 ${glow}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-50">{model.name}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">{model.summary}</p>
        </div>
        <div className="rounded-2xl border border-slate-400/10 bg-black/30 px-4 py-3 text-right">
          <div className="text-xs text-slate-300/70">Model score</div>
          <div className="mt-1 text-2xl font-semibold text-slate-50">{model.score}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MetricBlock label="RMSE" value={model.rmse} />
        <MetricBlock label="Stability" value={model.stability} />
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800/80">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${model.score}%` }} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {model.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-cyan-300/18 bg-cyan-300/8 px-3 py-1 text-xs font-semibold text-cyan-100"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-5 divide-y divide-slate-400/10 rounded-2xl border border-slate-400/10 bg-black/22">
        {model.signals.map(([signal, status]) => (
          <div key={signal} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-slate-200/82">{signal}</span>
            <span className="text-sm font-semibold text-slate-50">{status}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function SectionHeader({
  label,
  title,
  meta,
}: {
  label: string;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="text-xs font-semibold uppercase text-cyan-200/80">{label}</div>
        <h2 className="mt-2 text-lg font-semibold text-slate-50">{title}</h2>
      </div>
      <div className="rounded-full border border-slate-400/12 bg-black/24 px-3 py-1.5 text-xs font-semibold text-slate-200/76">
        {meta}
      </div>
    </div>
  );
}

function HorizonChart() {
  const shortLine = toPolyline(horizonSeries.short);
  const longLine = toPolyline(horizonSeries.long);
  const divergenceArea = `${horizonSeries.short
    .map(([x, y]) => `${x},${y}`)
    .join(" ")} ${[...horizonSeries.long]
    .reverse()
    .map(([x, y]) => `${x},${y}`)
    .join(" ")}`;

  return (
    <div className="relative">
      <svg viewBox="0 0 100 150" className="h-[300px] w-full" role="img" aria-label="Prediction horizon divergence chart">
        <defs>
          <linearGradient id="divergenceFill" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(34,211,238,0.08)" />
            <stop offset="100%" stopColor="rgba(251,191,36,0.26)" />
          </linearGradient>
          <filter id="horizonGlow">
            <feDropShadow dx="0" dy="0" stdDeviation="1.4" floodColor="rgba(34,211,238,0.55)" />
          </filter>
        </defs>

        {[24, 48, 72, 96, 120].map((y) => (
          <line key={y} x1="8" x2="94" y1={y} y2={y} stroke="rgba(148,163,184,0.12)" strokeDasharray="1 3" />
        ))}
        {[8, 36, 64, 92].map((x) => (
          <line key={x} x1={x} x2={x} y1="18" y2="132" stroke="rgba(148,163,184,0.08)" />
        ))}

        <polygon points={divergenceArea} fill="url(#divergenceFill)" />
        <polyline points={longLine} fill="none" stroke="rgba(251,191,36,0.92)" strokeWidth="2.8" strokeLinecap="round" />
        <polyline points={shortLine} fill="none" stroke="rgba(34,211,238,0.96)" strokeWidth="2.8" strokeLinecap="round" filter="url(#horizonGlow)" />

        <text x="8" y="145" fill="rgba(226,232,240,0.55)" fontSize="4">Now</text>
        <text x="80" y="145" fill="rgba(226,232,240,0.55)" fontSize="4">24 hr</text>
        <text x="10" y="18" fill="rgba(226,232,240,0.55)" fontSize="4">Low error</text>
      </svg>

      <div className="absolute right-4 top-4 space-y-2 rounded-2xl border border-slate-400/10 bg-black/48 p-3">
        <Legend color="bg-cyan-300" label="15 min" />
        <Legend color="bg-amber-300" label="24 hr" />
      </div>
    </div>
  );
}

function Histogram() {
  return (
    <div>
      <div className="flex h-[230px] items-end gap-2">
        {histogramBins.map((bin, index) => {
          const isTail = index >= 4;
          return (
            <div key={bin.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-xl border ${
                  isTail
                    ? "border-amber-300/26 bg-[linear-gradient(180deg,rgba(251,191,36,0.72),rgba(251,191,36,0.18))]"
                    : "border-cyan-300/24 bg-[linear-gradient(180deg,rgba(34,211,238,0.70),rgba(34,211,238,0.16))]"
                }`}
                style={{ height: `${bin.value}%` }}
              />
              <div className="text-[11px] text-slate-300/62">{bin.label}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-300/64">
        <span>Negative residual</span>
        <span>Positive tail</span>
      </div>
    </div>
  );
}

function MetricBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-400/10 bg-black/24 p-4">
      <div className="text-xs text-slate-300/68">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-50">{value}</div>
    </div>
  );
}

function HorizonStat({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "rose" }) {
  const toneClass = {
    cyan: "text-cyan-200 border-cyan-300/18",
    amber: "text-amber-200 border-amber-300/18",
    rose: "text-rose-200 border-rose-300/18",
  }[tone];

  return (
    <div className={`rounded-2xl border bg-black/22 p-4 ${toneClass}`}>
      <div className="text-xs text-slate-300/68">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function DistributionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-blue-300/16 bg-black/24 p-4">
      <div className="text-xs text-slate-300/68">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-blue-100">{value}</div>
    </div>
  );
}

function InsightCard({ insight }: { insight: (typeof keyInsights)[number] }) {
  return (
    <article className="min-h-[210px] rounded-[18px] border border-cyan-300/18 bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(2,6,23,0.54))] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_18px_54px_rgba(0,0,0,0.34)]">
      <div className="mb-4 inline-flex rounded-full border border-cyan-300/16 bg-cyan-300/8 px-3 py-1 text-xs font-semibold text-cyan-100">
        {insight.impact}
      </div>
      <h3 className="text-base font-semibold leading-6 text-slate-50">{insight.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{insight.detail}</p>
    </article>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200/80">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </div>
  );
}

function toPolyline(points: number[][]) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}
