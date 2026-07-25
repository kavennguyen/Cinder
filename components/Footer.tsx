"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const linkSections = [
  {
    title: "Product",
    links: [
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/pricing" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black pb-8 pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <div className="relative z-10 mx-auto max-w-[88rem] px-6">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="col-span-1 flex flex-col gap-6 md:col-span-5">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/cinder-logo.png"
                alt="Cinder logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-2xl font-medium tracking-tight text-white">
                Cinder
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              The AI visibility platform for Canada. Track and grow your
              brand&apos;s presence across every major answer engine.
            </p>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="email"
                placeholder="you@company.com"
                className="w-full max-w-xs rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#FF6E00]/50"
              />
              <button
                type="button"
                aria-label="Subscribe"
                className="rounded-lg bg-[#FF6E00] p-2.5 text-white transition-colors hover:bg-[#FF8A2E]"
              >
                <ArrowRight className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>

          {linkSections.map((section) => (
            <div
              key={section.title}
              className="col-span-1 flex flex-col gap-4 md:col-span-2"
            >
              <h4 className="text-xs font-medium uppercase tracking-wide text-white/50">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group flex w-fit items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-all duration-200 group-hover:w-3 group-hover:bg-[#FF6E00]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white/30">
            © 2026 Cinder. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 border-r border-white/10 pr-6">
              <a href="#" className="text-white/40 transition-colors hover:text-white">
                <X size={18} />
              </a>
              <a href="#" className="text-white/40 transition-colors hover:text-white">
                <LinkedinIcon />
              </a>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF6E00]" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
                All Engines Monitored
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
