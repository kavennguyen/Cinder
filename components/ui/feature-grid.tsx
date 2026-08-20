"use client";

import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features: Feature[];
  /** Soft brand glow behind the grid. */
  glow?: boolean;
  /**
   * Columns at the largest breakpoint. Use 2 when the grid sits inside a
   * half-width column, where three cards would be too narrow to read.
   */
  columns?: 2 | 3;
}

/**
 * Icon, title and description cards in a responsive grid.
 *
 * Adapted from a prebuiltui about section. Differences: lucide icons rather
 * than hotlinked emoji PNGs, the site's own palette rather than slate/indigo,
 * no Poppins import (the site is Palatino throughout), and plain Tailwind
 * since there is no shadcn or `cn` helper here.
 */
export function FeatureGrid({
  features,
  glow = false,
  columns = 3,
}: FeatureGridProps) {
  return (
    <div className="relative h-full">
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-40 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FF6E00]/20 blur-[220px]"
        />
      )}

      {/* auto-rows-fr keeps every row the same height, so cards do not shrink
          to fit a three-line description while their neighbour needs four.
          Combined with h-full, two grids sharing a subgrid row end up with
          identically sized cards. */}
      <div
        className={`grid h-full auto-rows-fr grid-cols-1 sm:grid-cols-2 gap-6 ${
          columns === 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-black/10 bg-[#FAF9F6] p-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FF6E00]/40 hover:shadow-[0_10px_34px_-8px_rgba(255,110,0,0.35)]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#FF6E00]/20 bg-[#FF6E00]/10 transition-colors duration-300 group-hover:border-[#FF6E00]/40 group-hover:bg-[#FF6E00]/15">
              <Icon className="h-6 w-6 text-[#FF6E00]" />
            </div>

            <h3 className="text-black text-lg font-medium mt-6 mb-2.5">
              {title}
            </h3>
            <p className="text-black/60 text-base leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
