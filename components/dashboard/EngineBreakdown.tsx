import type { PlatformScore } from "@/lib/visibility";
import {
  AiOverviewsIcon,
  ChatGPTIcon,
  GeminiIcon,
  PerplexityIcon,
} from "@/components/AiEngineIcons";

export const PLATFORM_LABELS: Record<string, string> = {
  chatgpt: "ChatGPT",
  perplexity: "Perplexity",
  gemini: "Gemini",
  ai_overviews: "AI Overviews",
};

const PLATFORM_ICONS: Record<string, () => React.ReactElement> = {
  chatgpt: ChatGPTIcon,
  perplexity: PerplexityIcon,
  gemini: GeminiIcon,
  ai_overviews: AiOverviewsIcon,
};

/**
 * Per-engine scores — second in weight after the headline number. Display
 * order is whatever `getVisibilitySnapshot` hands over; it is already sorted.
 */
export default function EngineBreakdown({
  platforms,
}: {
  platforms: PlatformScore[];
}) {
  if (platforms.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
      {platforms.map((p) => {
        const Icon = PLATFORM_ICONS[p.platform];
        const label = PLATFORM_LABELS[p.platform] ?? p.platform;
        const pct = p.scorePct ?? 0;
        return (
          <div key={p.platform}>
            <div className="flex items-center gap-2 text-ink-55 mb-2">
              {Icon && (
                <span className="shrink-0" aria-hidden="true">
                  <Icon />
                </span>
              )}
              <span className="font-ui text-xs font-semibold uppercase tracking-[0.08em]">
                {label}
              </span>
            </div>
            <p className="font-display text-ink text-[2rem] leading-none tracking-[-0.02em] tabular-nums">
              {p.scorePct !== null ? `${p.scorePct}%` : "—"}
            </p>
            <div
              className="h-1 rounded-full bg-wash mt-3 overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-ember"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="font-ui text-ink-45 text-xs mt-2 tabular-nums">
              {p.mentioned} of {p.total} prompt{p.total === 1 ? "" : "s"} mention you
            </p>
          </div>
        );
      })}
    </div>
  );
}
