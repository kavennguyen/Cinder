"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isActive, navItems } from "./nav-items";

/** Rail navigation. The active item is the only one carrying flame. */
export default function DashboardNav({
  onNavigate,
  size = "rail",
}: {
  onNavigate?: () => void;
  size?: "rail" | "drawer";
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`group relative flex items-center gap-3 rounded-full font-ui font-medium transition-colors duration-200 focus-ring-rail ${
              size === "drawer" ? "px-4 py-3 text-[0.9375rem]" : "px-3.5 py-2.5 text-sm"
            } ${
              active
                ? "bg-rail-soft text-on-rail"
                : "text-on-rail-dim hover:text-on-rail hover:bg-white/5"
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-full bg-flame transition-all duration-200 ${
                active ? "h-5 opacity-100" : "h-0 opacity-0"
              }`}
            />
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                active ? "text-flame" : "text-on-rail-dim group-hover:text-on-rail"
              }`}
              aria-hidden="true"
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
