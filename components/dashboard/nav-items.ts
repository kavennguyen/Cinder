import { Gauge, History, MessageSquare, Users } from "lucide-react";

export const navItems = [
  { label: "Overview", short: "Overview", href: "/dashboard", icon: Gauge },
  {
    label: "Tracked Prompts",
    short: "Prompts",
    href: "/dashboard/prompts",
    icon: MessageSquare,
  },
  {
    label: "Brands & Competitors",
    short: "Brands",
    href: "/dashboard/brands",
    icon: Users,
  },
  { label: "Changes", short: "Changes", href: "/dashboard/changes", icon: History },
];

/**
 * Overview matches exactly; every other item matches its subtree, so
 * /dashboard/prompts/<id> still lights up "Tracked Prompts".
 */
export function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function currentNavLabel(pathname: string) {
  if (pathname.startsWith("/dashboard/onboarding")) return "Set up";
  const match = navItems.find((i) => isActive(pathname, i.href));
  return match?.short ?? "Dashboard";
}
