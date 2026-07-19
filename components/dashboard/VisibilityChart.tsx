"use client";

import { useRef, useState } from "react";

export interface ChartPoint {
  date: string; // YYYY-MM-DD
  score: number; // 0–100
  runs: number;
}

const ACCENT = "#8A3220";
const SURFACE = "#ffffff";
const GRID = "#ececea"; // one step off surface, hairline
const W = 640;
const H = 240;
const PAD = { l: 40, r: 16, t: 12, b: 28 };

function fmtDate(iso: string) {
  const [, m, d] = iso.split("-");
  return `${["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m)]} ${Number(d)}`;
}

export default function VisibilityChart({ points }: { points: ChartPoint[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  if (points.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 p-8 text-black/50 text-sm leading-relaxed">
        No visibility data yet — run your prompts and the trend will chart
        here.
      </div>
    );
  }

  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const x = (i: number) =>
    PAD.l + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
  const y = (score: number) => PAD.t + innerH - (score / 100) * innerH;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`)
    .join(" ");
  const areaPath =
    points.length > 1
      ? `${linePath} L${x(points.length - 1).toFixed(1)},${(PAD.t + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD.t + innerH).toFixed(1)} Z`
      : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    let best = Infinity;
    points.forEach((_, i) => {
      const d = Math.abs(x(i) - px);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setHover(nearest);
  };

  // x tick labels: first, last, and up to 2 in between
  const tickIdx = new Set<number>([0, points.length - 1]);
  if (points.length > 3) {
    tickIdx.add(Math.round((points.length - 1) / 3));
    tickIdx.add(Math.round(((points.length - 1) * 2) / 3));
  }

  const last = points[points.length - 1];
  const hovered = hover !== null ? points[hover] : null;

  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="text-black/60 text-sm">AI Visibility Score over time</p>
          <p className="text-black/40 text-xs">
            % of prompt runs mentioning your brand, per day
          </p>
        </div>
        {hovered ? (
          <p className="text-sm">
            <span className="text-black font-semibold">{hovered.score}%</span>{" "}
            <span className="text-black/50">
              · {fmtDate(hovered.date)} · {hovered.runs} run
              {hovered.runs === 1 ? "" : "s"}
            </span>
          </p>
        ) : (
          <p className="text-sm">
            <span className="text-black font-semibold">{last.score}%</span>{" "}
            <span className="text-black/50">latest</span>
          </p>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto touch-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`AI visibility score by day, latest ${last.score} percent`}
      >
        {/* gridlines + y ticks */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line
              x1={PAD.l}
              y1={y(v)}
              x2={W - PAD.r}
              y2={y(v)}
              stroke={GRID}
              strokeWidth="1"
            />
            <text
              x={PAD.l - 8}
              y={y(v) + 3}
              textAnchor="end"
              fontSize="10"
              fill="rgba(0,0,0,0.45)"
            >
              {v}
            </text>
          </g>
        ))}

        {/* x tick labels */}
        {points.map((p, i) =>
          tickIdx.has(i) ? (
            <text
              key={p.date}
              x={x(i)}
              y={H - 8}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(0,0,0,0.45)"
            >
              {fmtDate(p.date)}
            </text>
          ) : null,
        )}

        {/* area wash */}
        {areaPath && <path d={areaPath} fill={ACCENT} opacity="0.1" />}

        {/* crosshair */}
        {hovered && hover !== null && (
          <line
            x1={x(hover)}
            y1={PAD.t}
            x2={x(hover)}
            y2={PAD.t + innerH}
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1"
          />
        )}

        {/* line */}
        {points.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* dots: 2px surface ring, r=4 */}
        {points.map((p, i) => (
          <circle
            key={p.date}
            cx={x(i)}
            cy={y(p.score)}
            r={hover === i ? 5 : 4}
            fill={ACCENT}
            stroke={SURFACE}
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* table view — the non-hover path to every value */}
      <details className="mt-3">
        <summary className="text-black/40 text-xs cursor-pointer hover:text-black/60 transition-colors">
          View data
        </summary>
        <table className="mt-2 text-xs text-black/70">
          <thead>
            <tr className="text-left text-black/40">
              <th className="pr-6 py-1 font-medium">Date</th>
              <th className="pr-6 py-1 font-medium">Score</th>
              <th className="py-1 font-medium">Runs</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.date}>
                <td className="pr-6 py-0.5">{p.date}</td>
                <td className="pr-6 py-0.5">{p.score}%</td>
                <td className="py-0.5">{p.runs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
