import { redirect } from "next/navigation";

import PromptsManager, {
  type TrackedPrompt,
} from "@/components/dashboard/PromptsManager";
import RunPromptsButton from "@/components/dashboard/RunPromptsButton";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { getVisibilitySnapshot } from "@/lib/visibility";

export default async function PromptsPage() {
  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();
  const [{ data: prompts }, snapshot] = await Promise.all([
    supabase
      .from("tracked_prompts")
      .select("id, text, platforms, is_active, created_at")
      .eq("org_id", org.orgId)
      .order("created_at", { ascending: false }),
    getVisibilitySnapshot(org.orgId),
  ]);

  const withResults: TrackedPrompt[] = (prompts ?? []).map((p) => ({
    ...(p as TrackedPrompt),
    last: snapshot.byPrompt[p.id] ?? null,
  }));

  return (
    <div>
      <p className="text-black/60 text-sm mb-2">AI Visibility</p>
      <h1
        className="text-black text-3xl md:text-4xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        Tracked Prompts
      </h1>
      <p className="text-black/60 text-base leading-relaxed max-w-xl mb-6">
        These are the questions Cinder asks each AI engine to measure whether{" "}
        {org.orgName} shows up in the answer. Gemini runs are live; more
        engines are coming.
      </p>

      <div className="mb-10">
        <RunPromptsButton />
      </div>

      <PromptsManager
        orgId={org.orgId}
        initialPrompts={withResults}
        promptLimit={org.promptLimit}
      />
    </div>
  );
}
