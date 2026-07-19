import { createClient } from "@/lib/supabase/server";

export interface UserOrg {
  orgId: string;
  orgName: string;
  role: string;
  planId: string | null;
  promptLimit: number | null;
  competitorLimit: number | null;
}

export function isSupabaseConfiguredServer() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/** The signed-in user's first organization (Phase 1: one org per user). */
export async function getUserOrg(): Promise<UserOrg | null> {
  if (!isSupabaseConfiguredServer()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (!membership) return null;

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", membership.org_id)
    .maybeSingle();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("org_id", membership.org_id)
    .maybeSingle();

  let promptLimit: number | null = null;
  let competitorLimit: number | null = null;
  if (sub?.plan_id) {
    const { data: plan } = await supabase
      .from("plans")
      .select("prompt_limit, competitor_limit")
      .eq("id", sub.plan_id)
      .maybeSingle();
    promptLimit = plan?.prompt_limit ?? null;
    competitorLimit = plan?.competitor_limit ?? null;
  }

  return {
    orgId: membership.org_id,
    orgName: org?.name ?? "Your organization",
    role: membership.role,
    planId: sub?.plan_id ?? null,
    promptLimit,
    competitorLimit,
  };
}
