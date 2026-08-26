import { redirect } from "next/navigation";

import PromptsManager, {
  type TrackedPrompt,
} from "@/components/dashboard/PromptsManager";
import RunPromptsButton from "@/components/dashboard/RunPromptsButton";
import PageHeading from "@/components/dashboard/PageHeading";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { getVisibilitySnapshot } from "@/lib/visibility";

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ suggest?: string }>;
}) {
  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");
  const { suggest } = await searchParams;

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
    results: snapshot.byPrompt[p.id] ?? [],
  }));

  return (
    <div>
      <PageHeading
        eyebrow="AI Visibility"
        title="Tracked Prompts"
        action={<RunPromptsButton />}
      >
        These are the questions Cinder asks each AI engine to measure whether{" "}
        {org.orgName} shows up in the answer. ChatGPT, Perplexity, and Gemini
        run live; AI Overviews is coming soon.
      </PageHeading>

      <PromptsManager
        orgId={org.orgId}
        initialPrompts={withResults}
        promptLimit={org.promptLimit}
        autoSuggest={suggest === "1"}
      />
    </div>
  );
}
