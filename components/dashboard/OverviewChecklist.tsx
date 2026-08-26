import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Card } from "@/components/dashboard/ui/Card";

export interface ChecklistStep {
  label: string;
  /** Shown once the step is done — the evidence it's done. */
  done: string | null;
  /** Shown while it isn't. */
  todo: string;
  href: string;
  cta: string;
}

/**
 * The guided start. Every step is derived from data already on the page, and
 * the whole card is replaced by WeekSummary once there's a score.
 */
export default function OverviewChecklist({
  steps,
}: {
  steps: ChecklistStep[];
}) {
  const complete = steps.filter((s) => s.done !== null).length;

  return (
    <Card className="p-5 sm:p-6 h-full">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-ui text-ink-55 text-[0.6875rem] font-semibold uppercase tracking-[0.09em]">
          Get set up
        </h2>
        <span className="font-ui text-ink-45 text-xs tabular-nums">
          {complete} of {steps.length}
        </span>
      </div>

      <ol className="mt-5 flex flex-col">
        {steps.map((step) => {
          const done = step.done !== null;
          return (
            <li
              key={step.label}
              className="flex items-start gap-3 py-3 border-b border-rule last:border-0"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 w-4 h-4 shrink-0 rounded-full border flex items-center justify-center ${
                  done ? "bg-ink border-ink" : "border-rule-strong"
                }`}
              >
                {done && <Check className="w-2.5 h-2.5 text-paper" strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block font-ui text-sm ${done ? "text-ink-45" : "text-ink font-medium"}`}
                >
                  {step.label}
                  <span className="sr-only">{done ? " — done" : " — not done"}</span>
                </span>
                <span className="block font-ui text-ink-45 text-xs mt-0.5 leading-snug">
                  {done ? step.done : step.todo}
                </span>
              </span>
              {!done && (
                <Link
                  href={step.href}
                  className="shrink-0 inline-flex items-center gap-1 font-ui text-ember text-xs font-medium hover:text-ember-deep transition-colors duration-200 focus-ring rounded-sm mt-0.5"
                >
                  {step.cta}
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
