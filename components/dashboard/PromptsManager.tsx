"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export interface PromptLastResult {
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
  last?: PromptLastResult | null;
}

function ResultBadge({ last }: { last: PromptLastResult | null | undefined }) {
  if (!last) {
    return (
      <span className="text-xs font-medium px-3 py-1 rounded-full border border-black/10 text-black/40">
        Not run yet
      </span>
    );
  }
  if (last.status === "error") {
    return (
      <span className="text-xs font-medium px-3 py-1 rounded-full border border-[#8A3220]/40 text-[#8A3220]">
        Last run failed
      </span>
    );
  }
  if (last.mentioned) {
    return (
      <span className="text-xs font-medium px-3 py-1 rounded-full bg-black text-white">
        Mentioned{last.position ? ` · #${last.position}` : ""}
      </span>
    );
  }
  return (
    <span className="text-xs font-medium px-3 py-1 rounded-full border border-black/15 text-black/50">
      Not mentioned
    </span>
  );
}

const ALL_PLATFORMS = [
  { id: "chatgpt", label: "ChatGPT" },
  { id: "perplexity", label: "Perplexity" },
  { id: "gemini", label: "Gemini" },
  { id: "ai_overviews", label: "AI Overviews" },
];

interface PromptsManagerProps {
  orgId: string;
  initialPrompts: TrackedPrompt[];
  promptLimit: number | null;
}

export default function PromptsManager({
  orgId,
  initialPrompts,
  promptLimit,
}: PromptsManagerProps) {
  const router = useRouter();
  const [prompts, setPrompts] = useState<TrackedPrompt[]>(initialPrompts);
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
        <label htmlFor="prompt-text" className="block text-black/70 text-sm font-medium mb-2">
          Add a prompt to track
        </label>
        <div className="flex gap-2">
          <input
            id="prompt-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={atLimit}
            placeholder='e.g. "best accounting software for small business canada"'
            className="flex-1 rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || atLimit}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#8A3220] transition-colors duration-200 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {ALL_PLATFORMS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlatform(p.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                platforms.includes(p.id)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black/50 border-black/15 hover:border-black/40"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {atLimit && (
          <p className="text-[#8A3220] text-sm mt-3">
            You&apos;ve reached your plan&apos;s limit of {promptLimit} prompts.
          </p>
        )}
        {error && <p className="text-[#8A3220] text-sm mt-3">{error}</p>}
      </form>

      {/* List */}
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-black text-lg font-medium">Tracked prompts</h2>
        <span className="text-black/50 text-sm">
          {prompts.length}
          {promptLimit !== null ? ` / ${promptLimit}` : ""}
        </span>
      </div>

      {prompts.length === 0 ? (
        <div className="rounded-2xl border border-black/10 p-8 text-black/50 text-sm leading-relaxed">
          No prompts yet. Add the questions your customers ask AI — e.g.
          &ldquo;best {"{your category}"} in {"{your city}"}&rdquo; — and
          Cinder will track whether your brand appears in the answers.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {prompts.map((prompt) => (
            <li
              key={prompt.id}
              className="rounded-2xl border border-black/10 px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/dashboard/prompts/${prompt.id}`}
                  className="text-black text-sm font-medium mb-1 block hover:text-[#8A3220] transition-colors duration-200"
                >
                  {prompt.text}
                </Link>
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-black/50 text-xs">
                    {prompt.platforms
                      .map(
                        (p) =>
                          ALL_PLATFORMS.find((ap) => ap.id === p)?.label ?? p,
                      )
                      .join(" · ")}
                  </p>
                  <ResultBadge last={prompt.last} />
                </div>
              </div>
              <button
                onClick={() => deletePrompt(prompt.id)}
                aria-label={`Delete prompt: ${prompt.text}`}
                className="shrink-0 text-black/40 hover:text-[#8A3220] transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
