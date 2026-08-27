"use client";

import type { ReactNode } from "react";

/**
 * Light-theme adaptation of a glassmorphism hero.
 *
 * Differences from the source: rendered in the site's white / orange /
 * Palatino system rather than zinc-950 dark, no hotlinked background image,
 * and none of the demo's invented proof (award badge, "150+ projects",
 * "98% satisfaction", client logos). Glass panels sit over a soft brand-orange
 * bloom so the blur has something to work against on a white page.
 */

/** Toronto skyline, the city Cinder is based in. Rendered greyscale at low
 *  opacity and masked away before the copy starts, so it reads as texture and
 *  gives the glass panels something to blur against on an otherwise flat white
 *  page. The brand colour comes from the blooms layered over it. */
const BACKDROP =
  "https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=1920";

export function HeroBloom() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] md:h-[920px] overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.14] grayscale"
        style={{
          backgroundImage: `url(${BACKDROP})`,
          maskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
        }}
      />
      <div className="absolute -top-24 right-0 h-[32rem] w-[32rem] rounded-full bg-[#FF6E00]/20 blur-[140px]" />
      <div className="absolute top-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-[#FF6E00]/10 blur-[130px]" />
    </div>
  );
}

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function HeroBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#FF6E00]/25 bg-[#FF6E00]/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-[#FF6E00]">
      {children}
    </span>
  );
}
