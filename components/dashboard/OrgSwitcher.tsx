"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { setActiveOrg } from "@/app/actions/set-active-org";
import type { OrgListItem } from "@/lib/org";

export default function OrgSwitcher({
  orgs,
  activeOrgId,
}: {
  orgs: OrgListItem[];
  activeOrgId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (orgs.length <= 1) return null;

  return (
    <div className="mb-6">
      <label
        htmlFor="org-switcher"
        className="block text-white/40 text-xs font-medium uppercase tracking-wide mb-2"
      >
        Viewing org
      </label>
      <select
        id="org-switcher"
        value={activeOrgId}
        disabled={pending}
        onChange={(e) => {
          const id = e.target.value;
          startTransition(async () => {
            await setActiveOrg(id);
            router.refresh();
          });
        }}
        className="w-full rounded-lg bg-white/10 text-white text-sm px-3 py-2 outline-none border border-white/10 focus:border-white/30 transition-colors disabled:opacity-50"
      >
        {orgs.map((o) => (
          <option key={o.id} value={o.id} className="text-black">
            {o.name}
          </option>
        ))}
      </select>
    </div>
  );
}
