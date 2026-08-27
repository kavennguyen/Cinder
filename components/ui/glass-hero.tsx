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
const backdropAt = (w: number) =>
  `https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export function HeroBloom() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] md:h-[920px] overflow-hidden"
    >
      {/* srcset so a phone fetches an 800px skyline instead of the 1920px one.
          The image is greyscaled and masked down to texture, so the small
          source is indistinguishable at mobile sizes. */}
      <img
        src={backdropAt(1920)}
        srcSet={`${backdropAt(800)} 800w, ${backdropAt(1280)} 1280w, ${backdropAt(1920)} 1920w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.14] grayscale"
        style={{
          maskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
          WebkitMaskImage:
            "linear-gradient(180deg, black 0%, black 45%, transparent 92%)",
        }}
      />
      {/* Radial gradients rather than a solid circle behind a blur() filter.
          A 140px blur over a 576px element is a real per-frame cost on phones
          and the gradient is visually the same thing for free. */}
      <div
        className="absolute -top-24 right-0 h-[32rem] w-[32rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,110,0,0.20) 0%, rgba(255,110,0,0.10) 45%, rgba(255,110,0,0) 70%)",
        }}
      />
      <div
        className="absolute top-40 -left-24 h-[24rem] w-[24rem]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,110,0,0.11) 0%, rgba(255,110,0,0.05) 45%, rgba(255,110,0,0) 70%)",
        }}
      />
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
      // backdrop-blur is one of the most expensive things a phone can be asked
      // to do, and it re-samples on every scroll frame. On mobile the panels
      // span nearly the full width, so there is barely any backdrop showing
      // through to justify it — a near-opaque surface reads the same. The
      // glass effect is kept from md up, where it is both visible and cheap.
      className={`relative overflow-hidden rounded-3xl border border-black/10 bg-white/90 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.25)] md:bg-white/70 md:backdrop-blur-xl ${className}`}
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
