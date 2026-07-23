"use server";

import { cookies } from "next/headers";

import { ACTIVE_ORG_COOKIE } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

/** Switch the admin's active org (stored in a cookie). */
export async function setActiveOrg(orgId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Only meaningful for admins; RLS means non-admins can't read other orgs
  // anyway, but don't set a junk cookie for them.
  const { data: adminRow } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();
  if (!adminRow) return;

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_ORG_COOKIE, orgId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
}
