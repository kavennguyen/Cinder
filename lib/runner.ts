import type { SupabaseClient } from "@supabase/supabase-js";

import {
  extractMentions,
  generateAnswer,
  type BrandForExtraction,
} from "@/lib/ai/gemini";

export interface RunSummary {
  ran: number;
  errors: number;
  mentionsFound: number;
}

const MAX_PROMPTS_PER_RUN = 25;
const DELAY_BETWEEN_PROMPTS_MS = 1500; // stay friendly to free-tier rate limits

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Run all active Gemini prompts for one org and store runs + mentions. */
export async function runPromptsForOrg(
  admin: SupabaseClient,
  orgId: string,
): Promise<RunSummary> {
  const { data: prompts } = await admin
    .from("tracked_prompts")
    .select("id, text, platforms")
    .eq("org_id", orgId)
    .eq("is_active", true)
    .contains("platforms", ["gemini"])
    .limit(MAX_PROMPTS_PER_RUN);

  if (!prompts || prompts.length === 0) {
    return { ran: 0, errors: 0, mentionsFound: 0 };
  }

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

  let ran = 0;
  let errors = 0;
  let mentionsFound = 0;

  for (const prompt of prompts) {
    try {
      const answer = await generateAnswer(prompt.text);

      const { data: run, error: runError } = await admin
        .from("prompt_runs")
        .insert({
          prompt_id: prompt.id,
          org_id: orgId,
          platform: "gemini",
          raw_response: answer,
          status: "ok",
        })
        .select("id")
        .single();
      if (runError || !run)
        throw new Error(runError?.message ?? "run insert failed");

      if (brands.length > 0) {
        const extracted = await extractMentions(answer, brands);
        if (extracted.length > 0) {
          const { error: mentionError } = await admin.from("mentions").insert(
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
          mentionsFound += extracted.filter((m) => m.mentioned).length;
        }
      }

      ran += 1;
    } catch (e) {
      errors += 1;
      await admin.from("prompt_runs").insert({
        prompt_id: prompt.id,
        org_id: orgId,
        platform: "gemini",
        status: "error",
        error: e instanceof Error ? e.message.slice(0, 500) : "Unknown error",
      });
    }

    await sleep(DELAY_BETWEEN_PROMPTS_MS);
  }

  return { ran, errors, mentionsFound };
}
