"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      <p className="rounded-2xl border border-black/10 p-8 text-black/50 text-sm">
        This prompt hasn&apos;t been run yet. Hit &ldquo;Run prompts now&rdquo;
        on the Tracked Prompts page.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {runs.map((run) => {
        const isOpen = open === run.id;
        const ownMention = run.mentions.find((m) => !m.isCompetitor);
        return (
          <li key={run.id} className="rounded-2xl border border-black/10">
            <button
              onClick={() => setOpen(isOpen ? null : run.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-black text-sm font-medium">
                  {fmtDateTime(run.ranAt)}
                </span>
                <span className="text-black/40 text-xs capitalize">
                  {run.platform}
                </span>
                {run.status === "error" ? (
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-[#8A3220]/40 text-[#8A3220]">
                    Failed
                  </span>
                ) : ownMention?.mentioned ? (
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-black text-white">
                    Mentioned
                    {ownMention.position ? ` · #${ownMention.position}` : ""}
                  </span>
                ) : (
                  <span className="text-xs font-medium px-3 py-1 rounded-full border border-black/15 text-black/50">
                    Not mentioned
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-black/40 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-black/5 pt-4">
                {run.status === "error" ? (
                  <p className="text-[#8A3220] text-sm leading-relaxed">
                    {run.error ?? "Run failed."}
                  </p>
                ) : (
                  <>
                    {run.mentions.length > 0 && (
                      <div className="mb-4">
                        <p className="text-black/40 text-xs font-medium uppercase tracking-wide mb-2">
                          Brands detected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {run.mentions.map((m) => (
                            <span
                              key={m.brandName}
                              className={`text-xs font-medium px-3 py-1 rounded-full ${
                                m.mentioned
                                  ? m.isCompetitor
                                    ? "bg-black/10 text-black/70"
                                    : "bg-[#8A3220] text-white"
                                  : "border border-black/10 text-black/35"
                              }`}
                            >
                              {m.brandName}
                              {m.mentioned && m.position
                                ? ` · #${m.position}`
                                : ""}
                              {m.mentioned && m.sentiment
                                ? ` · ${m.sentiment}`
                                : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-black/40 text-xs font-medium uppercase tracking-wide mb-2">
                      Raw answer
                    </p>
                    <div className="rounded-xl bg-black/[0.03] border border-black/5 p-4 max-h-80 overflow-y-auto">
                      <p className="text-black/70 text-sm leading-relaxed whitespace-pre-wrap">
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
