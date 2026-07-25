/**
 * Minimal Perplexity REST wrapper (no SDK dependency) — the "perplexity"
 * engine. OpenAI-compatible chat format at https://api.perplexity.ai.
 *
 * Perplexity searches the web for every answer and returns the sources it
 * used (`citations` / `search_results`), which feeds cited_urls directly.
 */

const PERPLEXITY_MODEL = process.env.PERPLEXITY_MODEL ?? "sonar";
const ENDPOINT = "https://api.perplexity.ai/chat/completions";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const RETRYABLE_STATUS = new Set([429, 500, 502, 503]);
const MAX_ATTEMPTS = 4;
const BACKOFF_MS = [0, 3000, 10000, 30000];

export interface PerplexityAnswer {
  text: string;
  citedUrls: string[];
}

export function isPerplexityConfigured() {
  return Boolean(process.env.PERPLEXITY_API_KEY);
}

/** Ask Perplexity the tracked prompt the way a real user would. */
export async function askPerplexity(
  promptText: string,
): Promise<PerplexityAnswer> {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error("PERPLEXITY_API_KEY is not set. Add it to .env.local.");
  }

  let lastError = "";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (BACKOFF_MS[attempt]) await sleep(BACKOFF_MS[attempt]);

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: PERPLEXITY_MODEL,
        messages: [{ role: "user", content: promptText }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      lastError = `Perplexity API ${res.status}: ${body.slice(0, 300)}`;
      if (RETRYABLE_STATUS.has(res.status)) continue;
      throw new Error(lastError);
    }

    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    if (!text) {
      lastError = "Perplexity returned an empty response.";
      continue;
    }

    // Sources: newer responses use search_results [{title,url,...}];
    // older ones a flat citations string array. Read both defensively.
    const fromSearchResults: string[] = Array.isArray(data?.search_results)
      ? (data.search_results as Array<{ url?: unknown }>)
          .map((r) => r?.url)
          .filter((u): u is string => typeof u === "string")
      : [];
    const fromCitations: string[] = Array.isArray(data?.citations)
      ? (data.citations as unknown[]).filter(
          (u): u is string => typeof u === "string",
        )
      : [];
    const citedUrls = [...new Set([...fromSearchResults, ...fromCitations])];

    return { text, citedUrls };
  }
  throw new Error(`${lastError} (after ${MAX_ATTEMPTS} attempts)`);
}
