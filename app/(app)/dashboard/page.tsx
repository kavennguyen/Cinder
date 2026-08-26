import { redirect } from "next/navigation";

import { getUserOrg, isSupabaseConfiguredServer } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import {
  getShareOfVoice,
  getVisibilityHistory,
  getVisibilitySnapshot,
} from "@/lib/visibility";
import PageHeading from "@/components/dashboard/PageHeading";
import Reveal from "@/components/dashboard/Reveal";
import ScoreHero, { type OverviewState } from "@/components/dashboard/ScoreHero";
import OverviewChecklist, {
  type ChecklistStep,
} from "@/components/dashboard/OverviewChecklist";
import WeekSummary from "@/components/dashboard/WeekSummary";
import VisibilityChart from "@/components/dashboard/VisibilityChart";
import ShareOfVoiceChart from "@/components/dashboard/ShareOfVoiceChart";
import Stat from "@/components/dashboard/ui/Stat";
import { Card } from "@/components/dashboard/ui/Card";
import {
  fmtDate,
  historySpanDays,
  weekOverWeekDelta,
} from "@/components/dashboard/rolling";

export default async function DashboardPage() {
  if (!isSupabaseConfiguredServer()) {
    return (
      <div className="max-w-xl">
        <PageHeading eyebrow="Setup" title="Supabase not configured">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the dev server.
        </PageHeading>
      </div>
    );
  }

  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [promptsRes, competitorsRes, ownBrandRes, changesRes, changesWeekRes, snapshot] =
    await Promise.all([
      supabase
        .from("tracked_prompts")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.orgId),
      supabase
        .from("brands")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.orgId)
        .eq("is_competitor", true),
      supabase
        .from("brands")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.orgId)
        .eq("is_competitor", false),
      supabase
        .from("changes")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.orgId),
      supabase
        .from("changes")
        .select("id", { count: "exact", head: true })
        .eq("org_id", org.orgId)
        .gte("changed_at", weekAgo.toISOString()),
      getVisibilitySnapshot(org.orgId),
    ]);

  const [history, shareOfVoice] = await Promise.all([
    getVisibilityHistory(org.orgId),
    getShareOfVoice(org.orgId),
  ]);

  const promptCount = promptsRes.count ?? 0;
  const competitorCount = competitorsRes.count ?? 0;
  const ownBrandCount = ownBrandRes.count ?? 0;
  const changeCount = changesRes.count ?? 0;
  const changesThisWeek = changesWeekRes.count ?? 0;

  const hasRuns = snapshot.scorePct !== null;
  const state: OverviewState =
    hasRuns ? "live" : promptCount > 0 ? "armed" : "fresh";

  const measurements = snapshot.byPlatform.reduce((sum, p) => sum + p.total, 0);
  const latestDate = history.length > 0 ? fmtDate(history[history.length - 1].date) : null;
  const delta = weekOverWeekDelta(history);
  const spanDays = historySpanDays(history);

  const steps: ChecklistStep[] = [
    {
      label: "Add your brand",
      done: ownBrandCount > 0 ? "Your brand is being matched in answers" : null,
      todo: "Cinder needs a brand to look for",
      href: "/dashboard/brands",
      cta: "Add",
    },
    {
      label: "Add tracked prompts",
      done: promptCount > 0 ? `${promptCount} being tracked` : null,
      todo: "The questions your customers ask AI",
      href: "/dashboard/prompts",
      cta: "Add",
    },
    {
      label: "Run them for the first time",
      done: hasRuns ? `Scored ${snapshot.scorePct}% across ${measurements} runs` : null,
      todo: "Ask every engine and score the answers",
      href: "/dashboard/prompts",
      cta: "Run",
    },
    {
      label: "Log what you change",
      done: changeCount > 0 ? `${changeCount} change${changeCount === 1 ? "" : "s"} logged` : null,
      todo: "So you can tie what you did to what moved",
      href: "/dashboard/changes",
      cta: "Log",
    },
  ];

  return (
    <>
      <PageHeading
        eyebrow={org.planId ? `Overview · ${org.planId} plan` : "Overview"}
        title={org.orgName}
        size="lg"
      />

      <div className="flex flex-col gap-4">
        <Reveal index={0}>
          <ScoreHero
            state={state}
            orgName={org.orgName}
            scorePct={snapshot.scorePct}
            promptCount={promptCount}
            platforms={snapshot.byPlatform}
            measurements={measurements}
            latestDate={latestDate}
            delta={delta}
            spanDays={spanDays}
          />
        </Reveal>

        <Reveal index={1} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {state === "live" ? (
              <WeekSummary
                platforms={snapshot.byPlatform}
                shareOfVoice={shareOfVoice}
                delta={delta}
                changesThisWeek={changesThisWeek}
                hasChanges={changeCount > 0}
              />
            ) : (
              <OverviewChecklist steps={steps} />
            )}
          </div>

          <Card className="px-5 sm:px-6 py-2">
            <Stat
              label="Tracked prompts"
              value={`${promptCount}${org.promptLimit ? ` / ${org.promptLimit}` : ""}`}
              href="/dashboard/prompts"
            />
            <Stat
              label="Competitors"
              value={`${competitorCount}`}
              href="/dashboard/brands"
            />
            <Stat
              label="Changes logged"
              value={`${changeCount}`}
              href="/dashboard/changes"
            />
          </Card>
        </Reveal>

        {state !== "fresh" && (
          <Reveal index={2} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 min-w-0">
              <VisibilityChart points={history} />
            </div>
            <div className="lg:col-span-5 min-w-0">
              <ShareOfVoiceChart rows={shareOfVoice} />
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}
