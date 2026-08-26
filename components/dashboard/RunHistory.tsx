"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Badge from "@/components/dashboard/ui/Badge";
import EmptyState from "@/components/dashboard/ui/EmptyState";

export interface RunMention {
  brandName: string;
  isCompetitor: boolean;
  mentioned: boolean;
  position: number | null;
  sentiment: string | null;
  citedUrls: string[];
}

export interface RunEntry {
  id: string;
  ranAt: string;
  platform: string;
  status: string;
  error: string | null;
  rawResponse: string | null;
  mentions: RunMention[];
}

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function RunHistory({ runs }: { runs: RunEntry[] }) {
  const [open, setOpen] = useState<string | null>(runs[0]?.id ?? null);

  if (runs.length === 0) {
    return (
      <EmptyState title="Not run yet">
        Hit &ldquo;Run prompts now&rdquo; on the Tracked Prompts page and every
        engine&apos;s answer will be recorded here.
      </EmptyState>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {runs.map((run) => {
        const isOpen = open === run.id;
        const ownMention = run.mentions.find((m) => !m.isCompetitor);
        return (
          <li key={run.id} className="rounded-2xl border border-rule bg-paper">
            <button
              onClick={() => setOpen(isOpen ? null : run.id)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-ring rounded-2xl"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-ink text-sm font-medium tabular-nums">
                  {fmtDateTime(run.ranAt)}
                </span>
                <span className="text-ink-45 text-xs capitalize">
                  {run.platform}
                </span>
                {run.status === "error" ? (
                  <Badge tone="alert">Failed</Badge>
                ) : ownMention?.mentioned ? (
                  <Badge tone="solid">
                    Mentioned
                    {ownMention.position ? ` · #${ownMention.position}` : ""}
                  </Badge>
                ) : (
                  <Badge tone="outline">Not mentioned</Badge>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-ink-45 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-rule pt-4">
                {run.status === "error" ? (
                  <p className="text-ember text-sm leading-relaxed">
                    {run.error ?? "Run failed."}
                  </p>
                ) : (
                  <>
                    {run.mentions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-ink-45 text-xs font-medium uppercase tracking-wide mb-2">
                          Brands detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {run.mentions.map((m) => (
                            <Badge
                              key={m.brandName}
                              tone={
                                m.mentioned
                                  ? m.isCompetitor
                                    ? "muted"
                                    : "accent"
                                  : "outline"
                              }
                            >
                              {m.brandName}
                              {m.mentioned && m.position
                                ? ` · #${m.position}`
                                : ""}
                              {m.mentioned && m.sentiment
                                ? ` · ${m.sentiment}`
                                : ""}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-ink-45 text-xs font-medium uppercase tracking-wide mb-2">
                      Raw answer
                    </p>
                    <div className="rounded-xl bg-wash border border-rule p-4 max-h-80 overflow-y-auto">
                      <p className="text-ink-70 text-sm leading-relaxed whitespace-pre-wrap">
                        {run.rawResponse ?? "(empty)"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
