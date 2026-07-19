import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import RunHistory, {
  type RunEntry,
  type RunMention,
} from "@/components/dashboard/RunHistory";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

interface MentionRow {
  run_id: string;
  mentioned: boolean;
  position: number | null;
  sentiment: string | null;
  cited_urls: string[];
  brands: { name: string; is_competitor: boolean } | null;
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();

  const { data: prompt } = await supabase
    .from("tracked_prompts")
    .select("id, text, platforms, created_at")
    .eq("id", id)
    .eq("org_id", org.orgId)
    .maybeSingle();
  if (!prompt) notFound();

  const { data: runRows } = await supabase
    .from("prompt_runs")
    .select("id, ran_at, platform, status, error, raw_response")
    .eq("prompt_id", prompt.id)
    .order("ran_at", { ascending: false })
    .limit(50);

  const runIds = (runRows ?? []).map((r) => r.id);
  const mentionsByRun = new Map<string, RunMention[]>();
  if (runIds.length > 0) {
    const { data: mentionRows } = await supabase
      .from("mentions")
      .select(
        "run_id, mentioned, position, sentiment, cited_urls, brands(name, is_competitor)",
      )
      .in("run_id", runIds);
    for (const m of (mentionRows ?? []) as unknown as MentionRow[]) {
      const list = mentionsByRun.get(m.run_id) ?? [];
      list.push({
        brandName: m.brands?.name ?? "Unknown brand",
        isCompetitor: m.brands?.is_competitor ?? true,
        mentioned: m.mentioned,
        position: m.position,
        sentiment: m.sentiment,
        citedUrls: m.cited_urls ?? [],
      });
      mentionsByRun.set(m.run_id, list);
    }
    // Own brand first, then mentioned competitors, then the rest.
    for (const list of mentionsByRun.values()) {
      list.sort(
        (a, b) =>
          Number(a.isCompetitor) - Number(b.isCompetitor) ||
          Number(b.mentioned) - Number(a.mentioned),
      );
    }
  }

  const runs: RunEntry[] = (runRows ?? []).map((r) => ({
    id: r.id,
    ranAt: r.ran_at,
    platform: r.platform,
    status: r.status,
    error: r.error,
    rawResponse: r.raw_response,
    mentions: mentionsByRun.get(r.id) ?? [],
  }));

  return (
    <div className="max-w-3xl">
      <Link
        href="/dashboard/prompts"
        className="inline-flex items-center gap-2 text-black/50 text-sm mb-6 hover:text-black transition-colors duration-200"
      >
        <ArrowLeft className="w-4 h-4" />
        All prompts
      </Link>

      <p className="text-black/60 text-sm mb-2">Prompt detail</p>
      <h1
        className="text-black text-2xl md:text-3xl font-medium leading-snug mb-3"
        style={{ letterSpacing: "-0.02em" }}
      >
        &ldquo;{prompt.text}&rdquo;
      </h1>
      <p className="text-black/50 text-sm mb-10">
        Platforms: {prompt.platforms.join(", ")} · {runs.length} run
        {runs.length === 1 ? "" : "s"} recorded
      </p>

      <h2 className="text-black text-lg font-medium mb-4">Run history</h2>
      <RunHistory runs={runs} />
    </div>
  );
}
