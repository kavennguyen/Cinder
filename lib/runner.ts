import type { SupabaseClient } from "@supabase/supabase-js";

import { ENGINES, type Engine } from "@/lib/ai/engines";
import { extractMentions, type BrandForExtraction } from "@/lib/ai/gemini";

export interface RunSummary {
  /** Successful (prompt × engine) runs stored. */
  ran: number;
  errors: number;
  mentionsFound: number;
  /** Engines that were requested on prompts but have no API key set. */
  skippedEngines: string[];
}

const MAX_PROMPTS_PER_RUN = 25;
const DELAY_BETWEEN_PROMPTS_MS = 1200; // stay friendly to rate limits

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Compose the text we store + analyze: answer plus engine-cited sources. */
function composeRaw(text: string, citedUrls: string[]): string {
  if (citedUrls.length === 0) return text;
  return `${text}\n\nSOURCES CITED BY THE ENGINE:\n${citedUrls.join("\n")}`;
}

/**
 * Run one org's active prompts across every engine that is selected on the
 * prompt, included in the org's plan, and configured with an API key.
 * Stores one prompt_runs row per (prompt × engine) plus extracted mentions.
 */
export async function runPromptsForOrg(
  admin: SupabaseClient,
  orgId: string,
): Promise<RunSummary> {
  const summary: RunSummary = {
    ran: 0,
    errors: 0,
    mentionsFound: 0,
    skippedEngines: [],
  };

  const { data: prompts } = await admin
    .from("tracked_prompts")
    .select("id, text, platforms")
    .eq("org_id", orgId)
    .eq("is_active", true)
    .limit(MAX_PROMPTS_PER_RUN);

  if (!prompts || prompts.length === 0) return summary;

  // Plan gating: only run engines the org's plan includes. Orgs without a
  // subscription row fall back to the base trio.
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan_id, plans(platforms)")
    .eq("org_id", orgId)
    .maybeSingle();
  const planPlatformsRaw = (
    sub as { plans?: { platforms?: string[] } | null } | null
  )?.plans?.platforms;
  const planPlatforms = new Set(
    planPlatformsRaw ?? ["chatgpt", "perplexity", "gemini"],
  );

  const skipped = new Set<string>();

  const { data: brandRows } = await admin
    .from("brands")
    .select("id, name, aliases, domains")
    .eq("org_id", orgId);

  const brands: BrandForExtraction[] = (brandRows ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    aliases: b.aliases ?? [],
    domains: b.domains ?? [],
  }));

  for (const prompt of prompts) {
    const requested = ENGINES.filter(
      (e) => prompt.platforms?.includes(e.id) && planPlatforms.has(e.id),
    );
    const runnable: Engine[] = [];
    for (const engine of requested) {
      if (engine.isConfigured()) runnable.push(engine);
      else skipped.add(engine.label);
    }
    if (runnable.length === 0) continue;

    // Engines have independent rate limits — query them in parallel.
    await Promise.all(
      runnable.map(async (engine) => {
        try {
          const answer = await engine.ask(prompt.text);
          const raw = composeRaw(answer.text, answer.citedUrls);

          const { data: run, error: runError } = await admin
            .from("prompt_runs")
            .insert({
              prompt_id: prompt.id,
              org_id: orgId,
              platform: engine.id,
              raw_response: raw,
              status: "ok",
            })
            .select("id")
            .single();
          if (runError || !run)
            throw new Error(runError?.message ?? "run insert failed");

          if (brands.length > 0) {
            const extracted = await extractMentions(raw, brands);
            if (extracted.length > 0) {
              const { error: mentionError } = await admin
                .from("mentions")
                .insert(
                  extracted.map((m) => ({
                    run_id: run.id,
                    org_id: orgId,
                    brand_id: m.brand_id,
                    mentioned: m.mentioned,
                    position: m.position,
                    sentiment: m.sentiment,
                    cited_urls: m.cited_urls,
                  })),
                );
              if (mentionError) throw new Error(mentionError.message);
              summary.mentionsFound += extracted.filter(
                (m) => m.mentioned,
              ).length;
            }
          }

          summary.ran += 1;
        } catch (e) {
          summary.errors += 1;
          await admin.from("prompt_runs").insert({
            prompt_id: prompt.id,
            org_id: orgId,
            platform: engine.id,
            status: "error",
            error:
              e instanceof Error ? e.message.slice(0, 500) : "Unknown error",
          });
        }
      }),
    );

    await sleep(DELAY_BETWEEN_PROMPTS_MS);
  }

  summary.skippedEngines = [...skipped];
  return summary;
}
