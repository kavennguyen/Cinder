import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";

import DashboardNav from "@/components/dashboard/DashboardNav";
import MobileNav from "@/components/dashboard/MobileNav";
import OrgSwitcher from "@/components/dashboard/OrgSwitcher";
import SignOutButton from "@/components/SignOutButton";
import { getUserOrg, listAllOrgs } from "@/lib/org";

// Loaded here rather than in the root layout so the marketing tree never
// sees the variable and its rendering is provably unchanged.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const org = await getUserOrg();
  const orgs = org?.isAdmin ? await listAllOrgs() : [];

  // /dashboard/onboarding renders inside this shell with no org yet.
  const switcher =
    org?.isAdmin && orgs.length > 1 ? (
      <OrgSwitcher orgs={orgs} activeOrgId={org.orgId} />
    ) : null;

  return (
    <div
      className={`${inter.variable} dash-root font-ui min-h-screen bg-ground text-ink-70 selection:bg-ember selection:text-paper lg:flex`}
    >
      <MobileNav
        showNav={Boolean(org)}
        orgSwitcher={switcher}
        signOut={<SignOutButton />}
      />

      <aside className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen w-54 shrink-0 bg-ink flex-col justify-between p-5">
        <div className="min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 mb-8 px-1 focus-ring-rail rounded-full"
          >
            <img
              src="/images/cinder-logo.png"
              alt="Cinder"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <span className="font-display text-paper text-lg tracking-[-0.01em]">
              Cinder
            </span>
          </Link>

          {switcher && <div className="mb-7">{switcher}</div>}
          {org && <DashboardNav />}
        </div>

        <div className="border-t border-white/10 pt-3">
          {org && (
            <p
              className="font-ui text-on-rail-dim text-xs px-3.5 pb-2 truncate"
              title={org.orgName}
            >
              {org.orgName}
            </p>
          )}
          <SignOutButton />
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-5 pt-8 pb-20 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mx-auto w-full max-w-[70rem]">{children}</div>
      </main>
    </div>
  );
}
