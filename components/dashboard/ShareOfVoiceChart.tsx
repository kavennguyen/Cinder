import { BarChart3 } from "lucide-react";

import type { ShareOfVoiceRow } from "@/lib/visibility";
import Badge from "@/components/dashboard/ui/Badge";
import { Card, CardHeader } from "@/components/dashboard/ui/Card";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import MetricInfo from "@/components/dashboard/ui/MetricInfo";
import { METHOD_SOV } from "@/components/dashboard/rolling";

/** How many bars stay visible before the rest go behind a disclosure. */
const VISIBLE = 8;

function Row({ row, max }: { row: ShareOfVoiceRow; max: number }) {
  return (
    <li
      className="sm:grid sm:grid-cols-[minmax(0,8.5rem)_1fr_auto] sm:items-center sm:gap-3"
      aria-label={`${row.name}${row.isCompetitor ? "" : " (your brand)"}: ${row.pct} percent, ${row.mentionRuns} of ${row.totalRuns} runs`}
    >
      <div className="flex items-center gap-2 min-w-0 sm:justify-end mb-1 sm:mb-0">
        <span
          className={`font-ui text-sm truncate ${row.isCompetitor ? "text-ink-70" : "text-ink font-medium"}`}
          title={row.name}
        >
          {row.name}
        </span>
        {!row.isCompetitor && (
          <Badge tone="accent" className="shrink-0 px-2 py-0.5">
            You
          </Badge>
        )}
      </div>

      <div className="h-6 relative rounded-r-[4px] bg-wash/60">
        <div
          className={`absolute inset-y-0 left-0 rounded-r-[4px] ${
            row.isCompetitor ? "bg-bar-muted" : "bg-ember"
          }`}
          style={{
            width: `${(row.pct / max) * 100}%`,
            minWidth: row.pct > 0 ? "4px" : "0px",
          }}
        />
      </div>

      <div className="flex items-baseline gap-2 mt-1 sm:mt-0 sm:justify-end">
        <span className="font-ui text-ink text-sm font-medium tabular-nums w-10 text-right">
          {row.pct}%
        </span>
        <span className="font-ui text-ink-45 text-[0.6875rem] tabular-nums hidden md:inline w-16">
          {row.mentionRuns} of {row.totalRuns}
        </span>
      </div>
    </li>
  );
}

/**
 * Share of voice — horizontal bars. Ember is your brand, warm grey is
 * everyone else; every bar is direct-labelled so no tooltip layer is needed.
 * Sort order comes from the data and is left alone.
 */
export default function ShareOfVoiceChart({ rows }: { rows: ShareOfVoiceRow[] }) {
  if (rows.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="w-5 h-5" aria-hidden="true" />}
        title="No share of voice yet"
        className="h-full"
      >
        After your first runs this compares how often you and your competitors
        are named in the same AI answers.
      </EmptyState>
    );
  }

  const max = Math.max(...rows.map((r) => r.pct), 1);

  // Cap the visible list, but never let the org's own brand fall off it.
  let visible = rows.slice(0, VISIBLE);
  const own = rows.find((r) => !r.isCompetitor);
  if (own && !visible.includes(own)) {
    visible = [...visible.slice(0, VISIBLE - 1), own];
  }
  const hidden = rows.filter((r) => !visible.includes(r));
  const ownRank = own ? rows.indexOf(own) + 1 : null;

  return (
    <Card className="p-5 sm:p-6 h-full flex flex-col">
      <CardHeader
        title="Share of voice"
        hint={`Last 30 days · ${rows[0].totalRuns} run${rows[0].totalRuns === 1 ? "" : "s"}`}
        info={
          <MetricInfo label="share of voice" align="right">
            {METHOD_SOV}
          </MetricInfo>
        }
      />

      <ul className="flex flex-col gap-3 sm:gap-2.5 mt-5">
        {visible.map((r) => (
          <Row key={r.brandId} row={r} max={max} />
        ))}
      </ul>

      {hidden.length > 0 && (
        <details className="mt-4">
          <summary className="font-ui text-ink-45 text-xs cursor-pointer hover:text-ember transition-colors duration-200 focus-ring rounded-sm w-fit">
            {hidden.length} more brand{hidden.length === 1 ? "" : "s"}
          </summary>
          <ul className="flex flex-col gap-3 sm:gap-2.5 mt-3">
            {hidden.map((r) => (
              <Row key={r.brandId} row={r} max={max} />
            ))}
          </ul>
        </details>
      )}

      {ownRank && rows.length > 1 && (
        <p className="font-ui text-ink-45 text-xs mt-5 pt-4 border-t border-rule">
          You rank {ownRank} of {rows.length} brands tracked.
        </p>
      )}
    </Card>
  );
}
