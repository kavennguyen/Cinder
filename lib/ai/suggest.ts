/**
 * Prompt suggestions: generate the AEO prompts a business SHOULD be
 * tracking, from its brand, competitors, and (when reachable) its own
 * homepage. Built for the non-technical owner staring at an empty textbox.
 */

import { generateJson } from "@/lib/ai/gemini";

export const SUGGESTION_CATEGORIES = [
  "best_of",
  "alternatives",
  "use_case",
] as const;

export type SuggestionCategory = (typeof SUGGESTION_CATEGORIES)[number];

export interface PromptSuggestion {
  text: string;
  category: SuggestionCategory;
}

export interface SuggestionInput {
  brandName: string;
  /** Primary domain of the org's own brand, if set. */
  domain: string | null;
  competitors: string[];
  /** Existing tracked prompt texts — never suggest duplicates. */
  existingPrompts: string[];
  /** Hard cap (already limited to the plan's remaining slots). */
  maxCount: number;
}

/**
 * SSRF guard for the homepage fetch: only public-looking hostnames.
 * Raw IPs, localhost, and internal-style suffixes are all refused.
 */
function isSafeHost(hostname: string): boolean {
  if (!hostname || !hostname.includes(".")) return false;
  if (hostname === "localhost" || hostname.endsWith(".localhost")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return false; // any raw IPv4
  if (hostname.includes(":")) return false; // IPv6 literal
  if (/\.(local|internal|lan|home|corp)$/i.test(hostname)) return false;
  return true;
}

/**
 * Best-effort homepage snapshot: title + meta description + visible text,
 * capped small. Returns null on any failure — suggestions still work,
 * they're just less specific.
 */
export async function fetchSiteContext(domain: string): Promise<string | null> {
  const host = domain
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim()
    .toLowerCase();
  if (!isSafeHost(host)) return null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://${host}`, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "CinderBot/1.0 (AEO visibility; +cinder)" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;

    const html = (await res.text()).slice(0, 300_000);
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
    const desc =
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
        .exec(html)?.[1]
        ?.trim() ?? "";
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z#0-9]+;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const combined = [title, desc, text].filter(Boolean).join("\n").slice(0, 3500);
    return combined || null;
  } catch {
    return null;
  }
}

const CATEGORY_SET = new Set<string>(SUGGESTION_CATEGORIES);

export async function generatePromptSuggestions(
  input: SuggestionInput,
): Promise<PromptSuggestion[]> {
  const { brandName, domain, competitors, existingPrompts, maxCount } = input;

  const siteContext = domain ? await fetchSiteContext(domain) : null;

  const generationPrompt = `You are an AEO (Answer Engine Optimization) strategist. Generate ${Math.max(maxCount + 4, 8)} search-style prompts that REAL CUSTOMERS would type into AI assistants (ChatGPT, Perplexity, Gemini) when they need what this business sells. The business will track whether AI answers mention it.

BUSINESS:
- Brand: ${brandName}
- Website: ${domain ?? "(not provided)"}
- Competitors: ${competitors.length > 0 ? competitors.join(", ") : "(none listed)"}
${
  siteContext
    ? `\nWEBSITE CONTENT (use this to infer what they sell, their city/region, and their products):\n"""\n${siteContext}\n"""\n`
    : ""
}
${
  existingPrompts.length > 0
    ? `ALREADY TRACKED (do NOT duplicate or closely paraphrase these):\n${existingPrompts.map((p) => `- ${p}`).join("\n")}\n`
    : ""
}
RULES:
- Write from the CUSTOMER's point of view, in natural search language (lowercase is fine).
- NEVER include the brand name "${brandName}" in any prompt — a prompt that names the brand automatically mentions it, which defeats the measurement.
- NEVER write head-to-head comparisons ("x vs y") — a third brand almost never appears in those answers.
- Competitor names may appear ONLY in alternatives prompts ("alternatives to <competitor>", "<competitor> is too expensive, what else is there") — nowhere else.
- If the website suggests a local business, include its city/region in several prompts.
- Spread across these categories: best_of ("best <category> in <city>"), alternatives (switching away from a named competitor), use_case (a real situation, e.g. "where should i order catering for a 20 person office party").
- Each prompt under 15 words. No numbering. No quotation marks inside the text.

Respond with ONLY a JSON array, one object per prompt, using exactly these keys:
[{"text": "best tacos near downtown toronto", "category": "best_of"}]
category must be one of: ${SUGGESTION_CATEGORIES.join(", ")}`;

  const raw = await generateJson(generationPrompt, 0.9);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Salvage a truncated array the same way extraction does.
    const lastBrace = raw.lastIndexOf("}");
    if (lastBrace > 0) {
      parsed = JSON.parse(raw.slice(0, lastBrace + 1) + "]");
    } else {
      throw new Error(`Suggestions returned invalid JSON: ${raw.slice(0, 200)}`);
    }
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Suggestions did not return a JSON array.");
  }

  const seen = new Set(existingPrompts.map((p) => p.trim().toLowerCase()));
  const brandLc = brandName.trim().toLowerCase();
  const competitorsLc = competitors
    .map((c) => c.trim().toLowerCase())
    .filter((c) => c.length > 2);

  const out: PromptSuggestion[] = [];
  for (const item of parsed as Record<string, unknown>[]) {
    if (out.length >= maxCount) break;
    const text =
      typeof item?.text === "string" ? item.text.trim().replace(/^["']|["']$/g, "") : "";
    if (text.length < 5 || text.length > 160) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    const category = CATEGORY_SET.has(String(item?.category))
      ? (item.category as SuggestionCategory)
      : "use_case";

    // Hard guardrails, enforced regardless of what the model returned:
    // no client brand name (auto-mention inflates the score), no "x vs y"
    // head-to-heads (unwinnable for third brands), and competitor names
    // only inside alternatives-style prompts.
    if (brandLc.length > 2 && key.includes(brandLc)) continue;
    if (/\bvs\.?\b|\bversus\b/.test(key)) continue;
    if (
      category !== "alternatives" &&
      competitorsLc.some((c) => key.includes(c))
    )
      continue;

    seen.add(key);
    out.push({ text, category });
  }
  return out;
}
