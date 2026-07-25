/**
 * Engine registry: one adapter per AI platform Cinder can query.
 *
 * Adding an engine = one entry here + an `ask` implementation. The runner
 * only runs engines that are (a) selected on the prompt, (b) included in
 * the org's plan, and (c) configured with an API key in this deployment.
 */

import { generateAnswer as askGemini } from "@/lib/ai/gemini";
import { askChatGpt, isOpenAiConfigured } from "@/lib/ai/openai";
import { askPerplexity, isPerplexityConfigured } from "@/lib/ai/perplexity";

export interface EngineAnswer {
  /** The engine's answer text. */
  text: string;
  /** Source URLs the engine itself cited (empty when not supported). */
  citedUrls: string[];
}

export interface Engine {
  /** Platform id — matches tracked_prompts.platforms and plans.platforms. */
  id: "chatgpt" | "perplexity" | "gemini";
  label: string;
  isConfigured(): boolean;
  ask(promptText: string): Promise<EngineAnswer>;
}

export const ENGINES: Engine[] = [
  {
    id: "chatgpt",
    label: "ChatGPT",
    isConfigured: isOpenAiConfigured,
    ask: async (promptText) => ({
      text: await askChatGpt(promptText),
      citedUrls: [],
    }),
  },
  {
    id: "perplexity",
    label: "Perplexity",
    isConfigured: isPerplexityConfigured,
    ask: async (promptText) => {
      const { text, citedUrls } = await askPerplexity(promptText);
      return { text, citedUrls };
    },
  },
  {
    id: "gemini",
    label: "Gemini",
    isConfigured: () => Boolean(process.env.GEMINI_API_KEY),
    ask: async (promptText) => ({
      text: await askGemini(promptText),
      citedUrls: [],
    }),
  },
];

export const ENGINE_IDS = ENGINES.map((e) => e.id) as string[];

export function engineById(id: string): Engine | undefined {
  return ENGINES.find((e) => e.id === id);
}
