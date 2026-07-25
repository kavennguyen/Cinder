import { createClient } from "@/lib/supabase/server";

/** Display order for engines throughout the dashboard. */
const PLATFORM_ORDER = ["chatgpt", "perplexity", "gemini", "ai_overviews"];

const platformRank = (p: string) => {
  const i = PLATFORM_ORDER.indexOf(p);
  return i === -1 ? PLATFORM_ORDER.length : i;
};

export interface PromptEngineResult {
  platform: string;
  ranAt: string;
  status: string;
  mentioned: boolean | null;
  position: number | null;
}

export interface PlatformScore {
  platform: string;
  /** % of this platform's latest-per-prompt successful runs mentioning the brand. */
  scorePct: number | null;
  mentioned: number;
  total: number;
}

export interface VisibilitySnapshot {
  /** % across the latest successful run of every (prompt × platform) pair. */
  scorePct: number | null;
  /** promptId → latest result per platform (ordered chatgpt, perplexity, …). */
  byPrompt: Record<string, PromptEngineResult[]>;
  /** Per-engine score across the org's prompts. */
  byPlatform: PlatformScore[];
}

export async function getVisibilitySnapshot(
  orgId: string,
): Promise<VisibilitySnapshot> {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("org_id", orgId)
    .eq("is_competitor", false)
    .limit(1)
    .maybeSingle();

  const { data: runs } = await supabase
    .from("prompt_runs")
    .select("id, prompt_id, platform, ran_at, status")
    .eq("org_id", orgId)
    .order("ran_at", { ascending: false })
    .limit(600);

  // Latest run per (prompt × platform).
  const latest = new Map<
    string,
    {
      id: string;
      promptId: string;
      platform: string;
      ranAt: string;
      status: string;
    }
  >();
  for (const r of runs ?? []) {
    const key = `${r.prompt_id}:${r.platform}`;
    if (!latest.has(key)) {
      latest.set(key, {
        id: r.id,
        promptId: r.prompt_id,
        platform: r.platform,
        ranAt: r.ran_at,
        status: r.status,
      });
    }
  }

  const mentionsByRun = new Map<
    string,
    { mentioned: boolean; position: number | null }
  >();
  if (brand && latest.size > 0) {
    const runIds = [...latest.values()].map((l) => l.id);
    for (let i = 0; i < runIds.length; i += 200) {
      const chunk = runIds.slice(i, i + 200);
      const { data: mentions } = await supabase
        .from("mentions")
        .select("run_id, mentioned, position")
        .eq("brand_id", brand.id)
        .in("run_id", chunk);
      for (const m of mentions ?? []) {
        mentionsByRun.set(m.run_id, {
          mentioned: m.mentioned,
          position: m.position,
        });
      }
    }
  }

  const byPrompt: Record<string, PromptEngineResult[]> = {};
  const perPlatform = new Map<string, { mentioned: number; total: number }>();
  let okCount = 0;
  let mentionedCount = 0;

  for (const l of latest.values()) {
    const m = mentionsByRun.get(l.id);
    const entry: PromptEngineResult = {
      platform: l.platform,
      ranAt: l.ranAt,
      status: l.status,
      mentioned: l.status === "ok" ? (m?.mentioned ?? false) : null,
      position: m?.position ?? null,
    };
    (byPrompt[l.promptId] ??= []).push(entry);

    if (l.status === "ok") {
      okCount += 1;
      const p = perPlatform.get(l.platform) ?? { mentioned: 0, total: 0 };
      p.total += 1;
      if (m?.mentioned) {
        mentionedCount += 1;
        p.mentioned += 1;
      }
      perPlatform.set(l.platform, p);
    }
  }

  for (const list of Object.values(byPrompt)) {
    list.sort((a, b) => platformRank(a.platform) - platformRank(b.platform));
  }

  const byPlatform: PlatformScore[] = [...perPlatform.entries()]
    .map(([platform, { mentioned, total }]) => ({
      platform,
      scorePct: total > 0 ? Math.round((mentioned / total) * 100) : null,
      mentioned,
      total,
    }))
    .sort((a, b) => platformRank(a.platform) - platformRank(b.platform));

  return {
    scorePct: okCount > 0 ? Math.round((mentionedCount / okCount) * 100) : null,
    byPrompt,
    byPlatform,
  };
}

export interface ShareOfVoiceRow {
  brandId: string;
  name: string;
  isCompetitor: boolean;
  pct: number; // % of successful runs (last 30 days) mentioning this brand
  mentionRuns: number;
  totalRuns: number;
}

/** Share of voice: per brand, % of the org's successful runs mentioning it. */
export async function getShareOfVoice(
  orgId: string,
  days = 30,
): Promise<ShareOfVoiceRow[]> {
  const supabase = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: runs } = await supabase
    .from("prompt_runs")
    .select("id")
    .eq("org_id", orgId)
    .eq("status", "ok")
    .gte("ran_at", since.toISOString())
    .limit(2000);
  const totalRuns = runs?.length ?? 0;
  if (totalRuns === 0) return [];

  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, is_competitor")
    .eq("org_id", orgId);
  if (!brands || brands.length === 0) return [];

  const counts = new Map<string, Set<string>>();
  const runIds = runs!.map((r) => r.id);
  for (let i = 0; i < runIds.length; i += 200) {
    const chunk = runIds.slice(i, i + 200);
    const { data: mentions } = await supabase
      .from("mentions")
      .select("run_id, brand_id, mentioned")
      .eq("org_id", orgId)
      .in("run_id", chunk);
    for (const m of mentions ?? []) {
      if (!m.mentioned) continue;
      const set = counts.get(m.brand_id) ?? new Set<string>();
      set.add(m.run_id);
      counts.set(m.brand_id, set);
    }
  }

  return brands
    .map((b) => {
      const mentionRuns = counts.get(b.id)?.size ?? 0;
      return {
        brandId: b.id,
        name: b.name,
        isCompetitor: b.is_competitor,
        pct: Math.round((mentionRuns / totalRuns) * 100),
        mentionRuns,
        totalRuns,
      };
    })
    .sort((a, b) => b.pct - a.pct || Number(a.isCompetitor) - Number(b.isCompetitor));
}

export interface VisibilityPoint {
  date: string; // YYYY-MM-DD
  score: number; // 0–100
  runs: number;
}

/**
 * Daily visibility score for the org's own brand over the last `days` days:
 * per day, % of successful runs whose answer mentioned the brand.
 */
export async function getVisibilityHistory(
  orgId: string,
  days = 30,
): Promise<VisibilityPoint[]> {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("id")
    .eq("org_id", orgId)
    .eq("is_competitor", false)
    .limit(1)
    .maybeSingle();
  if (!brand) return [];

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: runs } = await supabase
    .from("prompt_runs")
    .select("id, ran_at, status")
    .eq("org_id", orgId)
    .eq("status", "ok")
    .gte("ran_at", since.toISOString())
    .order("ran_at", { ascending: true })
    .limit(2000);
  if (!runs || runs.length === 0) return [];

  const runIds = runs.map((r) => r.id);
  const mentionedRuns = new Set<string>();
  // .in() has practical limits; chunk to stay safe.
  for (let i = 0; i < runIds.length; i += 200) {
    const chunk = runIds.slice(i, i + 200);
    const { data: mentions } = await supabase
      .from("mentions")
      .select("run_id, mentioned")
      .eq("brand_id", brand.id)
      .in("run_id", chunk);
    for (const m of mentions ?? []) {
      if (m.mentioned) mentionedRuns.add(m.run_id);
    }
  }

  const byDay = new Map<string, { total: number; mentioned: number }>();
  for (const r of runs) {
    const day = r.ran_at.slice(0, 10);
    const entry = byDay.get(day) ?? { total: 0, mentioned: 0 };
    entry.total += 1;
    if (mentionedRuns.has(r.id)) entry.mentioned += 1;
    byDay.set(day, entry);
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, { total, mentioned }]) => ({
      date,
      score: Math.round((mentioned / total) * 100),
      runs: total,
    }));
}
