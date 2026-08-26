"use client";

import { useMemo, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";

import { Card, CardHeader } from "@/components/dashboard/ui/Card";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import MetricInfo from "@/components/dashboard/ui/MetricInfo";
import {
  METHOD_TREND,
  dayToIso,
  fmtDate,
  withRollingAverage,
} from "@/components/dashboard/rolling";

export interface ChartPoint {
  date: string; // YYYY-MM-DD
  score: number; // 0–100
  runs: number;
}

const W = 680;
const H = 250;
const PAD = { l: 34, r: 14, t: 14, b: 30 };
const INNER_W = W - PAD.l - PAD.r;
const INNER_H = H - PAD.t - PAD.b;

export default function VisibilityChart({ points }: { points: ChartPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const rolling = useMemo(() => withRollingAverage(points), [points]);

  const geom = useMemo(() => {
    if (rolling.length === 0) return null;
    const days = rolling.map((p) => p.day);
    const minDay = Math.min(...days);
    const maxDay = Math.max(...days);
    const span = maxDay - minDay;
    const maxRuns = Math.max(...rolling.map((p) => p.runs), 1);

    // x is a real time scale — a gap in the data must read as a gap.
    const x = (day: number) =>
      PAD.l + (span === 0 ? INNER_W / 2 : ((day - minDay) / span) * INNER_W);
    const y = (score: number) => PAD.t + INNER_H - (score / 100) * INNER_H;

    const avgPath = rolling
      .map((p, i) => `${i === 0 ? "M" : "L"}${x(p.day).toFixed(1)},${y(p.avg).toFixed(1)}`)
      .join(" ");
    const areaPath =
      rolling.length > 1
        ? `${avgPath} L${x(maxDay).toFixed(1)},${(PAD.t + INNER_H).toFixed(1)} ` +
          `L${x(minDay).toFixed(1)},${(PAD.t + INNER_H).toFixed(1)} Z`
        : null;

    // Up to five ticks spread across the calendar span, not the array.
    const tickCount = span === 0 ? 1 : Math.min(5, span + 1);
    const ticks =
      tickCount === 1
        ? [minDay]
        : Array.from({ length: tickCount }, (_, i) =>
            Math.round(minDay + (span * i) / (tickCount - 1)),
          );

    return { minDay, maxDay, span, maxRuns, x, y, avgPath, areaPath, ticks };
  }, [rolling]);

  if (rolling.length === 0 || !geom) {
    return (
      <EmptyState
        icon={<TrendingUp className="w-5 h-5" aria-hidden="true" />}
        title="No trend yet"
        className="h-full"
      >
        Once your prompts have run, this charts your visibility day by day, with
        a 7-day average so one noisy day doesn&apos;t read as a drop.
      </EmptyState>
    );
  }

  const latest = rolling[rolling.length - 1];
  const active = hover !== null ? rolling[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    rolling.forEach((p, i) => {
      const d = Math.abs(geom.x(p.day) - px);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover(nearest);
  };

  // Dot radius carries the sample size, so a one-run day looks like one run.
  const dotR = (runs: number) =>
    1.5 + 2 * Math.sqrt(Math.min(runs, geom.maxRuns) / geom.maxRuns);

  const tooltipLeft = active
    ? Math.min(88, Math.max(12, (geom.x(active.day) / W) * 100))
    : 0;

  return (
    <Card className="p-5 sm:p-6 h-full flex flex-col">
      <CardHeader
        title="Visibility over time"
        info={<MetricInfo label="the visibility trend">{METHOD_TREND}</MetricInfo>}
        right={
          <span className="font-ui text-right block">
            <span className="text-ink text-lg font-medium tabular-nums">
              {latest.avg}%
            </span>
            <span className="block text-ink-45 text-[0.6875rem]">7-day avg</span>
          </span>
        }
      />

      <div className="flex items-center gap-4 mt-3 mb-1 font-ui text-[0.6875rem] text-ink-45">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded-full bg-ember" aria-hidden="true" />
          7-day average
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full bg-ember/40"
            aria-hidden="true"
          />
          daily · dot size = runs
        </span>
      </div>

      <div className="relative mt-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`AI visibility score by day. Latest 7-day average ${latest.avg} percent across ${rolling.length} days with runs.`}
        >
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <line
                x1={PAD.l}
                y1={geom.y(v)}
                x2={W - PAD.r}
                y2={geom.y(v)}
                stroke="var(--color-grid)"
                strokeWidth="1"
              />
              <text
                x={PAD.l - 8}
                y={geom.y(v) + 3.5}
                textAnchor="end"
                fontSize="11"
                fill="var(--color-ink-45)"
                className="font-ui tabular-nums"
              >
                {v}
              </text>
            </g>
          ))}

          {geom.ticks.map((day, i) => (
            <text
              key={day}
              x={geom.x(day)}
              y={H - 8}
              // Edge ticks anchor inward so the first and last dates can't clip.
              textAnchor={
                i === 0 ? "start" : i === geom.ticks.length - 1 ? "end" : "middle"
              }
              fontSize="11"
              fill="var(--color-ink-45)"
              className="font-ui"
            >
              {fmtDate(dayToIso(day))}
            </text>
          ))}

          {geom.areaPath && (
            <path d={geom.areaPath} fill="var(--color-ember-wash)" />
          )}

          {active && (
            <line
              x1={geom.x(active.day)}
              y1={PAD.t}
              x2={geom.x(active.day)}
              y2={PAD.t + INNER_H}
              stroke="var(--color-rule-strong)"
              strokeWidth="1"
            />
          )}

          {/* Daily scores sit behind the average, deliberately faint. */}
          {rolling.map((p) => (
            <circle
              key={`d-${p.date}`}
              cx={geom.x(p.day)}
              cy={geom.y(p.score)}
              r={dotR(p.runs)}
              fill="var(--color-ember)"
              opacity="0.35"
            />
          ))}

          {rolling.length > 1 && (
            <path
              d={geom.avgPath}
              fill="none"
              stroke="var(--color-ember)"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {active && (
            <circle
              cx={geom.x(active.day)}
              cy={geom.y(active.avg)}
              r="5"
              fill="var(--color-ember)"
              stroke="var(--color-paper)"
              strokeWidth="2"
            />
          )}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-xl border border-rule bg-paper px-3 py-2 font-ui shadow-none"
            style={{ left: `${tooltipLeft}%` }}
          >
            <p className="text-ink text-xs font-medium">
              {fmtDate(active.date)}
            </p>
            <p className="text-ink-70 text-xs tabular-nums mt-1">
              {active.avg}% 7-day avg
              <span className="text-ink-45">
                {" "}
                ({active.windowDays} day{active.windowDays === 1 ? "" : "s"})
              </span>
            </p>
            <p className="text-ink-55 text-xs tabular-nums">
              {active.score}% that day · {active.runs} run
              {active.runs === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>

      <details className="mt-4 group">
        <summary className="font-ui text-ink-45 text-xs cursor-pointer hover:text-ember transition-colors duration-200 focus-ring rounded-sm w-fit">
          View data
        </summary>
        <div className="mt-3 max-h-56 overflow-y-auto">
          <table className="w-full font-ui text-xs text-ink-70">
            <caption className="sr-only">
              Daily AI visibility score, 7-day average and run count
            </caption>
            <thead className="sticky top-0 bg-paper">
              <tr className="text-left text-ink-45 border-b border-rule">
                <th className="pr-4 py-1.5 font-medium">Date</th>
                <th className="pr-4 py-1.5 font-medium">Daily</th>
                <th className="pr-4 py-1.5 font-medium">7-day avg</th>
                <th className="py-1.5 font-medium">Runs</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {rolling.map((p) => (
                <tr key={p.date} className="border-b border-rule last:border-0">
                  <td className="pr-4 py-1">{p.date}</td>
                  <td className="pr-4 py-1">{p.score}%</td>
                  <td className="pr-4 py-1">{p.avg}%</td>
                  <td className="py-1">{p.runs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Card>
  );
}
