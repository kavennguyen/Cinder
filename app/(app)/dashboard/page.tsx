import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { getUserOrg, isSupabaseConfiguredServer } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import {
  getShareOfVoice,
  getVisibilityHistory,
  getVisibilitySnapshot,
} from "@/lib/visibility";
import VisibilityChart from "@/components/dashboard/VisibilityChart";
import ShareOfVoiceChart from "@/components/dashboard/ShareOfVoiceChart";

export default async function DashboardPage() {
  if (!isSupabaseConfiguredServer()) {
    return (
      <div className="max-w-xl">
        <h1 className="text-black text-3xl font-medium mb-4">
          Supabase not configured
        </h1>
        <p className="text-black/60 text-base leading-relaxed">
          Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to
          .env.local, then restart the dev server.
        </p>
      </div>
    );
  }

  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();

  const [promptsRes, brandsRes, changesRes, snapshot] = await Promise.all([
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
      .from("changes")
      .select("id", { count: "exact", head: true })
      .eq("org_id", org.orgId),
    getVisibilitySnapshot(org.orgId),
  ]);

  const [history, shareOfVoice] = await Promise.all([
    getVisibilityHistory(org.orgId),
    getShareOfVoice(org.orgId),
  ]);

  const cards = [
    {
      label: "AI Visibility Score",
      value: snapshot.scorePct !== null ? `${snapshot.scorePct}%` : "—",
      href: "/dashboard/prompts",
    },
    {
      label: "Tracked Prompts",
      value: `${promptsRes.count ?? 0}${org.promptLimit ? ` / ${org.promptLimit}` : ""}`,
      href: "/dashboard/prompts",
    },
    { label: "Competitors Tracked", value: `${brandsRes.count ?? 0}`, href: null },
    { label: "Changes Logged", value: `${changesRes.count ?? 0}`, href: null },
  ];

  return (
    <div className="max-w-5xl">
      <p className="text-black/60 text-sm mb-2">Overview</p>
      <h1
        className="text-black text-3xl md:text-5xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        {org.orgName}
      </h1>
      <p className="text-black/60 text-base leading-relaxed max-w-xl mb-12">
        {org.planId
          ? `On the ${org.planId} plan. `
          : ""}
        Add the prompts your customers ask AI, and Cinder will start
        measuring where you show up.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-black/10 p-6"
          >
            <p className="text-black/60 text-sm mb-2">{card.label}</p>
            <p
              className="text-black text-4xl font-medium"
              style={{ letterSpacing: "-0.02em" }}
            >
              {card.value}
            </p>
            {card.href && (
              <Link
                href={card.href}
                className="inline-flex items-center gap-1.5 text-black/60 text-sm mt-3 hover:text-[#8A3220] transition-colors duration-200"
              >
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <VisibilityChart points={history} />
        <ShareOfVoiceChart rows={shareOfVoice} />
      </div>

      <div className="rounded-2xl bg-black p-8">
        <p className="text-white/50 text-sm mb-2">Next up</p>
        <p className="text-white text-lg font-medium mb-1">
          Run your prompts to get your first visibility score.
        </p>
        <p className="text-white/60 text-sm leading-relaxed max-w-lg">
          Go to Tracked Prompts and hit &ldquo;Run prompts now&rdquo; — Cinder
          will ask Gemini each question, detect whether your brand (and your
          competitors) appear, and update the score above.
        </p>
      </div>
    </div>
  );
}
