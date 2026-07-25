/**
 * Minimal OpenAI REST wrapper (no SDK dependency) — the "chatgpt" engine.
 *
 * Default model is `chat-latest`, which OpenAI documents as pointing to the
 * latest Instant model currently used in ChatGPT — the closest the API gets
 * to what a real ChatGPT user sees, which is exactly what AEO tracking wants.
 */

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "chat-latest";
const ENDPOINT = "https://api.openai.com/v1/chat/completions";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const RETRYABLE_STATUS = new Set([429, 500, 502, 503]);
const MAX_ATTEMPTS = 4;
const BACKOFF_MS = [0, 3000, 10000, 30000];

export function isOpenAiConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Ask ChatGPT the tracked prompt the way a real user would. */
export async function askChatGpt(promptText: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env.local.");
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
      // Deliberately no temperature/max tokens overrides: defaults are what
      // real users get, and some models reject non-default sampling params.
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: "user", content: promptText }],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      lastError = `OpenAI API ${res.status}: ${body.slice(0, 300)}`;
      if (RETRYABLE_STATUS.has(res.status)) continue;
      throw new Error(lastError);
    }

    const data = await res.json();
    const text: string = data?.choices?.[0]?.message?.content ?? "";
    if (!text) {
      lastError = "OpenAI returned an empty response.";
      continue;
    }
    return text;
  }
  throw new Error(`${lastError} (after ${MAX_ATTEMPTS} attempts)`);
}
