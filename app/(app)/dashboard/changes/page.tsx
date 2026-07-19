import { redirect } from "next/navigation";

import ChangesManager, {
  type ChangeEntry,
} from "@/components/dashboard/ChangesManager";
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
      <p className="text-black/60 text-sm mb-2">Optimization</p>
      <h1
        className="text-black text-3xl md:text-4xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        Change Log
      </h1>
      <p className="text-black/60 text-base leading-relaxed max-w-xl mb-10">
        Every optimization made to {org.orgName}&apos;s web presence, in one
        auditable timeline — the &ldquo;what we did&rdquo; behind every move
        in your visibility score.
      </p>

      <ChangesManager
        orgId={org.orgId}
        initialChanges={(changes ?? []) as ChangeEntry[]}
        canWrite={org.role === "admin"}
      />
    </div>
  );
}
