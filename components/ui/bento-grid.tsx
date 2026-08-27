"use client";

import type { ReactNode } from "react";

/**
 * Bento grid shell.
 *
 * Adapted from an Aceternity feature grid. Differences: no `cn` helper (there
 * is no shadcn here), plain <img> rather than next/image, `motion` rather than
 * framer-motion, lucide rather than @tabler/icons-react, no dark-mode variants,
 * and none of the demo's hotlinked Aceternity CDN assets.
 */

export interface BentoCell {
  title: string;
  description: ReactNode;
  /** Column span at lg, on a 6-column grid. */
  span: 2 | 3 | 4;
  visual: ReactNode;
}

export function BentoGrid({ cells }: { cells: BentoCell[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {cells.map((cell) => (
        <div
          key={cell.title}
          className={`group relative flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-[#FAF9F6] p-7 md:p-8 transition-all duration-300 hover:border-[#FF6E00]/40 hover:shadow-[0_10px_34px_-8px_rgba(255,110,0,0.28)] ${
            cell.span === 4
              ? "md:col-span-6 lg:col-span-4"
              : cell.span === 3
                ? "md:col-span-3"
                : "md:col-span-3 lg:col-span-2"
          }`}
        >
          <h3
            className="text-black text-xl md:text-2xl font-bold leading-snug mb-2"
            style={{ letterSpacing: "-0.02em" }}
          >
            {cell.title}
          </h3>
          <p className="text-black/60 text-sm md:text-base leading-relaxed max-w-md">
            {cell.description}
          </p>
          {/* justify-end pins every visual to the bottom of its card. Cards in
              a row are already equal height, so the visuals line up across the
              row even when the titles and copy wrap to different depths. */}
          <div className="relative mt-6 flex grow flex-col justify-end">
            {cell.visual}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Fades a visual into the card so it does not end on a hard edge. */
export function VisualFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF9F6] to-transparent"
    />
  );
}
