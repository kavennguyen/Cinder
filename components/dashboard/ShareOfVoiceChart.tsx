import type { ShareOfVoiceRow } from "@/lib/visibility";

const ACCENT = "#8A3220";
const MUTED = "rgba(0,0,0,0.22)"; // de-emphasis fill for competitor bars

/**
 * Share of voice — horizontal bars. Identity comes from the row labels;
 * color highlights the org's own brand (accent) vs competitors (muted).
 * Every bar is direct-labeled, so no tooltip layer is needed.
 */
export default function ShareOfVoiceChart({
  rows,
}: {
  rows: ShareOfVoiceRow[];
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 p-8 text-black/50 text-sm leading-relaxed">
        Share of voice appears after your first prompt runs — it compares how
        often you and your competitors are named in AI answers.
      </div>
    );
  }

  const max = Math.max(...rows.map((r) => r.pct), 1);

  return (
    <div className="rounded-2xl border border-black/10 p-6">
      <div className="mb-5">
        <p className="text-black/60 text-sm">Share of voice</p>
        <p className="text-black/40 text-xs">
          % of AI answers (last 30 days, {rows[0].totalRuns} run
          {rows[0].totalRuns === 1 ? "" : "s"}) mentioning each brand
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.brandId} className="grid grid-cols-[8rem_1fr_3rem] items-center gap-3">
            <span
              className="text-sm text-black/70 truncate text-right"
              title={r.name}
            >
              {r.name}
              {!r.isCompetitor && (
                <span className="text-black/40 text-xs"> (you)</span>
              )}
            </span>
            <div className="h-6 relative">
              <div
                className="absolute inset-y-0 left-0 rounded-r-[4px]"
                style={{
                  width: `${(r.pct / max) * 100}%`,
                  minWidth: r.pct > 0 ? "4px" : "0px",
                  backgroundColor: r.isCompetitor ? MUTED : ACCENT,
                }}
              />
            </div>
            <span className="text-sm text-black font-medium">{r.pct}%</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-5 mt-5">
        <span className="flex items-center gap-2 text-xs text-black/50">
          <span
            className="w-3 h-3 rounded-[3px]"
            style={{ backgroundColor: ACCENT }}
          />
          Your brand
        </span>
        <span className="flex items-center gap-2 text-xs text-black/50">
          <span
            className="w-3 h-3 rounded-[3px]"
            style={{ backgroundColor: MUTED }}
          />
          Competitors
        </span>
      </div>
    </div>
  );
}
