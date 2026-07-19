/**
 * Minimal Gemini REST wrapper (no SDK dependency).
 * Free-tier keys: https://aistudio.google.com → Get API key.
 */

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

interface GeminiPart {
  text?: string;
}

async function callGemini(
  prompt: string,
  opts: { json?: boolean } = {},
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Get a free key at aistudio.google.com and add it to .env.local.",
    );
  }

  const res = await fetch(`${BASE}/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: opts.json
        ? {
            responseMimeType: "application/json",
            temperature: 0,
            maxOutputTokens: 8192,
          }
        : { temperature: 0.4, maxOutputTokens: 4096 },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const parts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p) => p.text ?? "").join("");
  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

/** Ask Gemini the tracked prompt the way a real user would. */
export async function generateAnswer(promptText: string): Promise<string> {
  return callGemini(promptText);
}

export interface BrandForExtraction {
  id: string;
  name: string;
  aliases: string[];
  domains: string[];
}

export interface ExtractedMention {
  brand_id: string;
  mentioned: boolean;
  position: number | null;
  sentiment: "positive" | "neutral" | "negative" | null;
  cited_urls: string[];
}

/**
 * Second pass: given an AI answer and the org's brand list (own brand +
 * competitors), extract who was mentioned, in what order, and how.
 */
export async function extractMentions(
  answer: string,
  brands: BrandForExtraction[],
): Promise<ExtractedMention[]> {
  const brandList = brands
    .map(
      (b) =>
        `- id: ${b.id} | name: ${b.name}` +
        (b.aliases.length ? ` | aliases: ${b.aliases.join(", ")}` : "") +
        (b.domains.length ? ` | domains: ${b.domains.join(", ")}` : ""),
    )
    .join("\n");

  const extractionPrompt = `You are analyzing an AI assistant's answer for brand visibility.

BRANDS TO CHECK:
${brandList}

ANSWER TO ANALYZE:
"""
${answer.slice(0, 12000)}
"""

For EACH brand in the list, determine:
- mentioned: true if the brand (or an alias/domain) appears in the answer, else false
- position: if multiple brands are mentioned, the 1-based order in which this brand first appears among the listed brands; null if not mentioned
- sentiment: "positive", "neutral", or "negative" toward the brand; null if not mentioned
- cited_urls: any URLs in the answer that belong to the brand's domains; [] if none

Respond with ONLY a JSON array, one object per brand, using exactly these keys:
[{"brand_id": "...", "mentioned": true, "position": 1, "sentiment": "positive", "cited_urls": []}]`;

  const raw = await callGemini(extractionPrompt, { json: true });

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Response may have been truncated mid-array — salvage the complete
    // objects: cut back to the last complete "}" and close the array.
    const lastBrace = raw.lastIndexOf("}");
    if (lastBrace > 0) {
      try {
        parsed = JSON.parse(raw.slice(0, lastBrace + 1) + "]");
      } catch {
        throw new Error(
          `Extraction returned invalid JSON: ${raw.slice(0, 200)}`,
        );
      }
    } else {
      throw new Error(`Extraction returned invalid JSON: ${raw.slice(0, 200)}`);
    }
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Extraction did not return a JSON array.");
  }

  const validIds = new Set(brands.map((b) => b.id));
  return (parsed as Record<string, unknown>[])
    .filter((m) => typeof m.brand_id === "string" && validIds.has(m.brand_id))
    .map((m) => ({
      brand_id: m.brand_id as string,
      mentioned: Boolean(m.mentioned),
      position:
        typeof m.position === "number" && m.position > 0 ? m.position : null,
      sentiment:
        m.sentiment === "positive" ||
        m.sentiment === "neutral" ||
        m.sentiment === "negative"
          ? m.sentiment
          : null,
      cited_urls: Array.isArray(m.cited_urls)
        ? (m.cited_urls as unknown[]).filter(
            (u): u is string => typeof u === "string",
          )
        : [],
    }));
}
