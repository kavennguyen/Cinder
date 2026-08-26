"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronsUpDown } from "lucide-react";

import { setActiveOrg } from "@/app/actions/set-active-org";
import type { OrgListItem } from "@/lib/org";

/**
 * Admin-only org switcher. Still a native <select> — it's the most reliable
 * control on a phone — but styled as a real affordance instead of a bare box:
 * the select sits transparently on top of the rendered row.
 */
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

  const active = orgs.find((o) => o.id === activeOrgId);

  return (
    <div>
      <span className="block font-ui text-on-rail-dim text-[0.625rem] font-semibold uppercase tracking-[0.1em] mb-2">
        Viewing org
      </span>
      <div
        className={`relative rounded-xl border border-white/10 bg-rail-soft transition-colors duration-200 hover:border-white/25 ${
          pending ? "opacity-50" : ""
        } focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-flame`}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 pointer-events-none">
          <Building2 className="w-3.5 h-3.5 text-on-rail-dim shrink-0" aria-hidden="true" />
          <span
            className="font-ui text-on-rail text-sm truncate flex-1"
            title={active?.name}
          >
            {active?.name ?? "Select org"}
          </span>
          <ChevronsUpDown className="w-3.5 h-3.5 text-on-rail-dim shrink-0" aria-hidden="true" />
        </div>
        <select
          id="org-switcher"
          aria-label="Viewing org"
          value={activeOrgId}
          disabled={pending}
          onChange={(e) => {
            const id = e.target.value;
            startTransition(async () => {
              await setActiveOrg(id);
              router.refresh();
            });
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        >
          {orgs.map((o) => (
            <option key={o.id} value={o.id} className="text-ink">
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
