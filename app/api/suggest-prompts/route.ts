import { NextResponse } from "next/server";

import { generatePromptSuggestions } from "@/lib/ai/suggest";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // homepage fetch + Gemini generation

/**
 * Suggest tracked prompts for the caller's org, from its brand, competitors,
 * and homepage. Returns suggestions only — nothing is written until the
 * user picks which to add (the normal insert path enforces plan limits).
 */
export async function POST() {
  const org = await getUserOrg();
  if (!org) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const [{ data: brands }, { data: existing }] = await Promise.all([
    supabase
      .from("brands")
      .select("name, domains, is_competitor")
      .eq("org_id", org.orgId),
    supabase.from("tracked_prompts").select("text").eq("org_id", org.orgId),
  ]);

  const own = (brands ?? []).find((b) => !b.is_competitor);
  const competitors = (brands ?? [])
    .filter((b) => b.is_competitor)
    .map((b) => b.name);
  const existingPrompts = (existing ?? []).map((p) => p.text);

  const remaining =
    org.promptLimit !== null ? org.promptLimit - existingPrompts.length : null;
  if (remaining !== null && remaining <= 0) {
    return NextResponse.json(
      { error: "You've reached your plan's prompt limit — remove a prompt or upgrade to add more." },
      { status: 400 },
    );
  }

  try {
    const suggestions = await generatePromptSuggestions({
      brandName: own?.name ?? org.orgName,
      domain: own?.domains?.[0] ?? null,
      competitors,
      existingPrompts,
      maxCount: Math.min(10, remaining ?? 10),
    });
    return NextResponse.json({ suggestions });
  } catch (e) {
    return NextResponse.json(
      {
        error:
          e instanceof Error
            ? `Couldn't generate suggestions: ${e.message.slice(0, 200)}`
            : "Couldn't generate suggestions.",
      },
      { status: 500 },
    );
  }
}
