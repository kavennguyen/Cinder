import { redirect } from "next/navigation";

import ChangesManager, {
  type ChangeEntry,
} from "@/components/dashboard/ChangesManager";
import PageHeading from "@/components/dashboard/PageHeading";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function ChangesPage() {
  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();
  const { data: changes } = await supabase
    .from("changes")
    .select("id, changed_at, change_type, title, description, urls")
    .eq("org_id", org.orgId)
    .order("changed_at", { ascending: false });

  return (
    <div>
      <PageHeading eyebrow="Optimization" title="Change Log">
        Every optimization made to {org.orgName}&apos;s web presence, in one
        auditable timeline — the &ldquo;what we did&rdquo; behind every move
        in your visibility score.
      </PageHeading>

      <ChangesManager
        orgId={org.orgId}
        initialChanges={(changes ?? []) as ChangeEntry[]}
        canWrite={org.role === "admin"}
      />
    </div>
  );
}
