"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Sparkles, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/dashboard/ui/Badge";
import { Card } from "@/components/dashboard/ui/Card";
import { Button } from "@/components/dashboard/ui/Button";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import SectionHeader from "@/components/dashboard/ui/SectionHeader";
import {
  inputClass,
  labelClass,
  noticeClass,
} from "@/components/dashboard/ui/Field";

interface Suggestion {
  text: string;
  category: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  best_of: "Best of",
  comparison: "Comparison",
  alternatives: "Alternatives",
  trust: "Trust",
  use_case: "Use case",
};

export interface PromptEngineResult {
  platform: string;
  ranAt: string;
  status: string;
  mentioned: boolean | null;
  position: number | null;
}

export interface TrackedPrompt {
  id: string;
  text: string;
  platforms: string[];
  is_active: boolean;
  created_at: string;
  results?: PromptEngineResult[];
}

const ALL_PLATFORMS = [
  { id: "chatgpt", label: "ChatGPT", soon: false },
  { id: "perplexity", label: "Perplexity", soon: false },
  { id: "gemini", label: "Gemini", soon: false },
  { id: "ai_overviews", label: "AI Overviews", soon: true },
];

const platformLabel = (id: string) =>
  ALL_PLATFORMS.find((p) => p.id === id)?.label ?? id;

/** One compact badge per engine: latest result for this prompt. */
function ResultBadges({
  results,
}: {
  results: PromptEngineResult[] | undefined;
}) {
  if (!results || results.length === 0) {
    return <Badge tone="outline">Not run yet</Badge>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 flex-wrap">
      {results.map((r) => {
        if (r.status === "error") {
          return (
            <Badge key={r.platform} tone="alert">
              {platformLabel(r.platform)} · failed
            </Badge>
          );
        }
        if (r.mentioned) {
          return (
            <Badge key={r.platform} tone="solid">
              {platformLabel(r.platform)}
              {r.position ? ` #${r.position}` : " ✓"}
            </Badge>
          );
        }
        return (
          <Badge key={r.platform} tone="outline">
            {platformLabel(r.platform)} ✗
          </Badge>
        );
      })}
    </span>
  );
}

interface PromptsManagerProps {
  orgId: string;
  initialPrompts: TrackedPrompt[];
  promptLimit: number | null;
  /** Open the suggestion picker automatically (post-onboarding handoff). */
  autoSuggest?: boolean;
}

export default function PromptsManager({
  orgId,
  initialPrompts,
  promptLimit,
  autoSuggest = false,
}: PromptsManagerProps) {
  const router = useRouter();
  const [prompts, setPrompts] = useState<TrackedPrompt[]>(initialPrompts);

  // router.refresh() (e.g. after "Run prompts now") re-renders the server
  // page with fresh results — re-sync local state so badges update without
  // a full reload. Render-phase adjustment per React's "adjusting state
  // when props change" pattern (avoids an effect + extra render pass).
  const [prevInitialPrompts, setPrevInitialPrompts] = useState(initialPrompts);
  if (prevInitialPrompts !== initialPrompts) {
    setPrevInitialPrompts(initialPrompts);
    setPrompts(initialPrompts);
  }

  // --- Suggestions ---
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [suggestAdding, setSuggestAdding] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setSuggestLoading(true);
    setSuggestError(null);
    setSelected(new Set());
    try {
      const res = await fetch("/api/suggest-prompts", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSuggestError(data.error ?? "Couldn't generate suggestions.");
        setSuggestions(null);
      } else {
        setSuggestions(data.suggestions ?? []);
      }
    } catch {
      setSuggestError("Network error while generating suggestions.");
      setSuggestions(null);
    }
    setSuggestLoading(false);
  }, []);

  // Post-onboarding handoff: open the picker for a brand-new org. Deferred
  // a tick so the fetch kickoff isn't a synchronous setState in the effect.
  useEffect(() => {
    if (!autoSuggest || initialPrompts.length > 0) return;
    const t = setTimeout(() => {
      void fetchSuggestions();
    }, 0);
    return () => clearTimeout(t);
    // Run once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSuggestion = (text: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(text)) next.delete(text);
      else next.add(text);
      return next;
    });
  };

  const addSelected = async () => {
    if (!suggestions) return;
    const chosen = suggestions.filter((s) => selected.has(s.text));
    if (chosen.length === 0) return;
    if (promptLimit !== null && prompts.length + chosen.length > promptLimit) {
      setSuggestError(
        `That's ${chosen.length} prompts but your plan has ${promptLimit - prompts.length} slot${promptLimit - prompts.length === 1 ? "" : "s"} left.`,
      );
      return;
    }
    setSuggestAdding(true);
    setSuggestError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracked_prompts")
      .insert(
        chosen.map((s) => ({
          org_id: orgId,
          text: s.text,
          platforms: ["chatgpt", "perplexity", "gemini"],
        })),
      )
      .select();

    if (error) {
      setSuggestError(error.message);
    } else if (data) {
      setPrompts((prev) => [...(data as TrackedPrompt[]), ...prev]);
      setSuggestions((prev) =>
        prev ? prev.filter((s) => !selected.has(s.text)) : prev,
      );
      setSelected(new Set());
      router.refresh();
    }
    setSuggestAdding(false);
  };
  const [text, setText] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([
    "chatgpt",
    "perplexity",
    "gemini",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const atLimit = promptLimit !== null && prompts.length >= promptLimit;

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const addPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!text.trim()) return;
    if (platforms.length === 0) {
      setError("Pick at least one platform.");
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracked_prompts")
      .insert({ org_id: orgId, text: text.trim(), platforms })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setPrompts((prev) => [data as TrackedPrompt, ...prev]);
      setText("");
      router.refresh();
    }
    setLoading(false);
  };

  const deletePrompt = async (id: string) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("tracked_prompts")
      .delete()
      .eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Add form */}
      <form onSubmit={addPrompt} className="mb-10">
        <label htmlFor="prompt-text" className={labelClass}>
          Add a prompt to track
        </label>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <input
            id="prompt-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={atLimit}
            placeholder='e.g. "best accounting software for small business canada"'
            className={`flex-1 min-w-0 ${inputClass}`}
          />
          <Button type="submit" disabled={loading || atLimit}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {ALL_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              disabled={p.soon}
              onClick={() => togglePlatform(p.id)}
              title={p.soon ? "Coming soon" : undefined}
              aria-pressed={!p.soon && platforms.includes(p.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-200 focus-ring ${
                p.soon
                  ? "bg-paper text-ink-45 border-rule cursor-not-allowed"
                  : platforms.includes(p.id)
                    ? "bg-ink text-paper border-ink"
                    : "bg-paper text-ink-55 border-rule-strong hover:border-ink hover:text-ink"
              }`}
            >
              {p.label}
              {p.soon ? " · soon" : ""}
            </button>
          ))}
        </div>

        {atLimit && (
          <p className={`${noticeClass} mt-3`}>
            You&apos;ve reached your plan&apos;s limit of {promptLimit} prompts.
          </p>
        )}
        {error && <p className={`${noticeClass} mt-3`}>{error}</p>}
      </form>

      {/* Suggestions */}
      <div className="mb-10">
        {suggestions === null && !suggestLoading && (
          <button
            type="button"
            onClick={fetchSuggestions}
            disabled={atLimit}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-55 hover:text-ember transition-colors duration-200 disabled:opacity-50 focus-ring rounded-full"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Not sure what to track? Suggest prompts for me
          </button>
        )}

        {suggestLoading && (
          <p className="text-ink-45 text-sm">
            Reading your brand and generating prompt ideas… (a few seconds)
          </p>
        )}

        {suggestions && !suggestLoading && (
          <Card className="p-5 sm:p-6">
            <SectionHeader
              title="Suggested prompts"
              hint="The kinds of questions your customers ask AI — tap to select, then add them to tracking."
              right={
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(new Set(suggestions.map((s) => s.text)))
                    }
                    className="text-ink-45 text-xs font-medium hover:text-ember transition-colors duration-200 focus-ring rounded-full"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={fetchSuggestions}
                    className="inline-flex items-center gap-1.5 text-ink-45 text-xs font-medium hover:text-ember transition-colors duration-200 focus-ring rounded-full"
                  >
                    <RefreshCw className="w-3 h-3" aria-hidden="true" />
                    Regenerate
                  </button>
                </div>
              }
              className="mb-5"
            />

            {suggestions.length === 0 ? (
              <p className="text-ink-45 text-sm">
                Nothing new to suggest right now — try regenerating.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 mb-5">
                  {suggestions.map((s) => {
                    const isSelected = selected.has(s.text);
                    return (
                      <button
                        key={s.text}
                        type="button"
                        onClick={() => toggleSuggestion(s.text)}
                        aria-pressed={isSelected}
                        className={`text-left text-sm px-4 py-2 rounded-full border transition-colors duration-200 focus-ring ${
                          isSelected
                            ? "bg-ink text-paper border-ink"
                            : "bg-paper text-ink-70 border-rule-strong hover:border-ink"
                        }`}
                      >
                        {s.text}
                        <span
                          className={`ml-2 text-[10px] font-medium uppercase tracking-wide ${
                            isSelected ? "text-paper/60" : "text-ink-45"
                          }`}
                        >
                          {CATEGORY_LABELS[s.category] ?? s.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  onClick={addSelected}
                  disabled={selected.size === 0 || suggestAdding}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  {suggestAdding
                    ? "Adding…"
                    : `Add ${selected.size || ""} selected`.replace("  ", " ")}
                </Button>
              </>
            )}
          </Card>
        )}

        {suggestError && <p className={`${noticeClass} mt-3`}>{suggestError}</p>}
      </div>

      {/* List */}
      <SectionHeader
        title="Tracked prompts"
        className="mb-4"
        right={
          <span className="text-ink-45 text-sm tabular-nums">
            {prompts.length}
            {promptLimit !== null ? ` / ${promptLimit}` : ""}
          </span>
        }
      />

      {prompts.length === 0 ? (
        <EmptyState title="No prompts yet">
          Add the questions your customers ask AI — e.g. &ldquo;best{" "}
          {"{your category}"} in {"{your city}"}&rdquo; — and Cinder will track
          whether your brand appears in the answers.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2">
          {prompts.map((prompt) => (
            <li
              key={prompt.id}
              className="rounded-2xl border border-rule bg-paper px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/dashboard/prompts/${prompt.id}`}
                  className="text-ink text-sm font-medium mb-1.5 block hover:text-ember transition-colors duration-200 focus-ring rounded-sm"
                >
                  {prompt.text}
                </Link>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-ink-45 text-xs">
                    {prompt.platforms.map(platformLabel).join(" · ")}
                  </p>
                  <ResultBadges results={prompt.results} />
                </div>
              </div>
              <button
                onClick={() => deletePrompt(prompt.id)}
                aria-label={`Delete prompt: ${prompt.text}`}
                className="shrink-0 text-ink-45 hover:text-ember transition-colors duration-200 focus-ring rounded-full p-1"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
