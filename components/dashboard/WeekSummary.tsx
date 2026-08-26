import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PlatformScore, ShareOfVoiceRow } from "@/lib/visibility";
import { Card } from "@/components/dashboard/ui/Card";
import { PLATFORM_LABELS } from "@/components/dashboard/EngineBreakdown";
import type { WeekDelta } from "@/components/dashboard/rolling";

function Line({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-rule last:border-0">
      <span className="font-ui text-ink-55 text-sm shrink-0">{label}</span>
      <span className="min-w-0 text-right">
        <span className="font-ui text-ink text-sm font-medium tabular-nums truncate block">
          {value}
        </span>
        {detail && (
          <span className="font-ui text-ink-45 text-xs tabular-nums">{detail}</span>
        )}
      </span>
    </div>
  );
}

/**
 * What the checklist becomes once there's data. Everything here is
 * descriptive — no causation is claimed between a logged change and a move.
 */
export default function WeekSummary({
  platforms,
  shareOfVoice,
  delta,
  changesThisWeek,
  hasChanges,
}: {
  platforms: PlatformScore[];
  shareOfVoice: ShareOfVoiceRow[];
  delta: WeekDelta | null;
  changesThisWeek: number;
  hasChanges: boolean;
}) {
  const strongest = [...platforms]
    .filter((p) => p.scorePct !== null)
    .sort((a, b) => (b.scorePct ?? 0) - (a.scorePct ?? 0))[0];
  const leader = shareOfVoice[0];
  const own = shareOfVoice.find((r) => !r.isCompetitor);

  return (
    <Card className="p-5 sm:p-6 h-full flex flex-col">
      <h2 className="font-ui text-ink-55 text-[0.6875rem] font-semibold uppercase tracking-[0.09em]">
        This week
      </h2>

      <div className="mt-4 flex-1">
        {delta && (
          <Line
            label="Visibility"
            value={`${delta.current}%`}
            detail={`${delta.previous}% the week before · ${delta.currentRuns} runs`}
          />
        )}
        {strongest && (
          <Line
            label="Strongest engine"
            value={PLATFORM_LABELS[strongest.platform] ?? strongest.platform}
            detail={`${strongest.scorePct}% · ${strongest.mentioned} of ${strongest.total} prompts`}
          />
        )}
        {leader && (
          <Line
            label="Share-of-voice lead"
            value={leader.name}
            detail={
              own && own.brandId === leader.brandId
                ? `${leader.pct}% — that's you`
                : `${leader.pct}%${own ? ` · you ${own.pct}%` : ""}`
            }
          />
        )}
        <Line
          label="Changes logged"
          value={`${changesThisWeek}`}
          detail="in the last 7 days"
        />
      </div>

      {!hasChanges && (
        <Link
          href="/dashboard/changes"
          className="inline-flex items-center gap-1.5 font-ui text-ember text-xs font-medium mt-4 hover:text-ember-deep transition-colors duration-200 focus-ring rounded-sm w-fit"
        >
          Log what you changed on the site
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      )}
    </Card>
  );
}
