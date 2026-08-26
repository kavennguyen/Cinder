import { ArrowRight, Minus, Play, Sparkles, TrendingDown, TrendingUp } from "lucide-react";

import type { PlatformScore } from "@/lib/visibility";
import EngineBreakdown from "@/components/dashboard/EngineBreakdown";
import { ButtonLink } from "@/components/dashboard/ui/Button";
import MetricInfo from "@/components/dashboard/ui/MetricInfo";
import { METHOD_SCORE, type WeekDelta } from "@/components/dashboard/rolling";

export type OverviewState = "fresh" | "armed" | "live";

const shell =
  "rounded-hero border border-rule bg-paper p-6 sm:p-8 lg:p-10";

function Label() {
  return (
    <div className="flex items-center gap-1.5">
      <h2 className="font-ui text-ink-55 text-[0.6875rem] font-semibold uppercase tracking-[0.09em]">
        AI Visibility Score
      </h2>
      <MetricInfo label="the AI Visibility Score">{METHOD_SCORE}</MetricInfo>
    </div>
  );
}

function Delta({ delta, spanDays }: { delta: WeekDelta | null; spanDays: number }) {
  if (delta) {
    const up = delta.delta > 0;
    const flat = delta.delta === 0;
    const Icon = flat ? Minus : up ? TrendingUp : TrendingDown;
    return (
      <p
        className={`font-ui text-sm inline-flex items-center gap-1.5 ${
          up ? "text-ink font-medium" : "text-ink-55"
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="tabular-nums">
          {flat
            ? "No change"
            : `${up ? "+" : "−"}${Math.abs(delta.delta)} pt${Math.abs(delta.delta) === 1 ? "" : "s"}`}
        </span>
        <span className="text-ink-45">vs previous week</span>
      </p>
    );
  }
  if (spanDays > 0) {
    const left = Math.max(1, 14 - spanDays);
    return (
      <p className="font-ui text-ink-45 text-sm">
        Building a baseline — about {left} more day{left === 1 ? "" : "s"} of runs
        before a week-on-week comparison means anything.
      </p>
    );
  }
  return null;
}

export default function ScoreHero({
  state,
  orgName,
  scorePct,
  promptCount,
  platforms,
  measurements,
  latestDate,
  delta,
  spanDays,
}: {
  state: OverviewState;
  orgName: string;
  scorePct: number | null;
  promptCount: number;
  platforms: PlatformScore[];
  measurements: number;
  latestDate: string | null;
  delta: WeekDelta | null;
  spanDays: number;
}) {
  if (state === "fresh") {
    return (
      <section className={shell} aria-labelledby="hero-title">
        <Label />
        <p
          id="hero-title"
          className="font-display text-ink text-[1.75rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.02em] mt-4"
        >
          Nothing measured yet.
        </p>
        <p className="font-ui text-ink-55 text-sm leading-relaxed mt-3 max-w-lg">
          Cinder asks ChatGPT, Perplexity and Gemini the questions your customers
          ask, then checks whether {orgName} is in the answer. Add your first
          prompts and your score appears here.
        </p>
        <div className="flex flex-wrap gap-3 mt-6">
          <ButtonLink href="/dashboard/prompts">
            Add prompts <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/dashboard/prompts?suggest=1" variant="ghost">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Suggest prompts for me
          </ButtonLink>
        </div>
      </section>
    );
  }

  if (state === "armed") {
    return (
      <section className={shell} aria-labelledby="hero-title">
        <Label />
        <p
          id="hero-title"
          className="font-display text-ink text-[1.75rem] sm:text-[2.25rem] leading-[1.1] tracking-[-0.02em] mt-4"
        >
          Not scored yet.
        </p>
        <p className="font-ui text-ink-70 text-sm leading-relaxed mt-3 max-w-lg">
          <span className="text-ink font-medium tabular-nums">
            {promptCount} prompt{promptCount === 1 ? "" : "s"}
          </span>{" "}
          ready to go. Run them and Cinder will ask each engine, detect whether{" "}
          {orgName} and your competitors appear, and score it.
        </p>
        <div className="mt-6">
          <ButtonLink href="/dashboard/prompts" variant="accent">
            <Play className="w-4 h-4" aria-hidden="true" />
            Run your prompts
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section className={shell} aria-labelledby="hero-title">
      <Label />
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3 mt-4">
        <p
          id="hero-title"
          className="font-display text-ink text-[3.5rem] sm:text-[5rem] lg:text-[6rem] leading-[0.95] tracking-[-0.035em] tabular-nums"
        >
          {scorePct}
          <span className="text-[0.55em] align-baseline ml-0.5">%</span>
        </p>
        <div className="pb-2 sm:pb-3">
          <Delta delta={delta} spanDays={spanDays} />
        </div>
      </div>

      <p className="font-ui text-ink-45 text-xs mt-4 tabular-nums">
        {promptCount} prompt{promptCount === 1 ? "" : "s"} × {platforms.length}{" "}
        engine{platforms.length === 1 ? "" : "s"}
        <span className="hidden sm:inline">
          {" · "}
          {measurements} measurement{measurements === 1 ? "" : "s"}
        </span>
        {latestDate && <span className="hidden sm:inline"> · latest {latestDate}</span>}
      </p>

      <div className="border-t border-rule mt-7 pt-7">
        <EngineBreakdown platforms={platforms} />
      </div>
    </section>
  );
}
