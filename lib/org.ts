import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

export const ACTIVE_ORG_COOKIE = "cinder-active-org";

export interface UserOrg {
  orgId: string;
  orgName: string;
  role: string;
  isAdmin: boolean;
  planId: string | null;
  promptLimit: number | null;
  competitorLimit: number | null;
}

export interface OrgListItem {
  id: string;
  name: string;
}

export function isSupabaseConfiguredServer() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * The org the signed-in user is currently operating on.
 *
 * Regular users: their own org (first membership).
 * Cinder admins (any membership with role 'admin'): the org selected in the
 * org-switcher cookie, falling back to their own org. Admins can operate on
 * every org — RLS grants them read everywhere and change-log write.
 */
export async function getUserOrg(): Promise<UserOrg | null> {
  if (!isSupabaseConfiguredServer()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: myMemberships } = await supabase
    .from("memberships")
    .select("org_id, role")
    .eq("user_id", user.id);
  if (!myMemberships || myMemberships.length === 0) return null;

  const isAdmin = myMemberships.some((m) => m.role === "admin");
  const home = myMemberships[0];

  let orgId = home.org_id;
  let role = home.role;

  if (isAdmin) {
    const cookieStore = await cookies();
    const selected = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
    if (selected && selected !== orgId) {
      // Verify the selected org exists (admins can read all orgs via RLS).
      const { data: selectedOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("id", selected)
        .maybeSingle();
      if (selectedOrg) {
        orgId = selectedOrg.id;
        role = "admin";
      }
    } else {
      role = "admin";
    }
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", orgId)
    .maybeSingle();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("org_id", orgId)
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
    orgId,
    orgName: org?.name ?? "Your organization",
    role,
    isAdmin,
    planId: sub?.plan_id ?? null,
    promptLimit,
    competitorLimit,
  };
}

/** All orgs, for the admin org switcher. Returns [] for non-admins (RLS). */
export async function listAllOrgs(): Promise<OrgListItem[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("id, name")
    .order("name", { ascending: true });
  return (data ?? []) as OrgListItem[];
}
