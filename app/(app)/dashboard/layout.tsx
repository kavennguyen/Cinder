import type { Metadata } from "next";
import Link from "next/link";

import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false },
};

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "AI Visibility", href: "/dashboard#prompts" },
  { label: "SEO", href: "/dashboard#seo" },
  { label: "Changes", href: "/dashboard#changes" },
  { label: "Settings", href: "/dashboard#settings" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-white flex selection:bg-[#8A3220] selection:text-white">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-black flex flex-col justify-between p-6">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-10">
            <img
              src="/images/cinder-logo.png"
              alt="Cinder logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-semibold text-lg">Cinder</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/60 text-sm font-medium rounded-lg px-3 py-2 hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <SignOutButton />
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 md:p-12">{children}</main>
    </div>
  );
}
