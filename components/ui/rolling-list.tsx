"use client";

import { Poppins } from "next/font/google";

/**
 * The step labels use a geometric sans rather than the site's Palatino.
 * `font-black` with tight tracking needs a real 900 weight, which Palatino
 * does not have, so the browser would otherwise synthesise it and the caps
 * would read cramped. Loaded via next/font and applied only to the labels,
 * so the rest of the site and the other pages are untouched.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900"],
  style: ["normal", "italic"],
  display: "swap",
});

export interface RollingListItem {
  id: number;
  /** Large rolling label, e.g. the step name. */
  title: string;
  /** Small right-hand label, e.g. the step number or category. */
  category: string;
  /** One line explaining the step, shown under the title. */
  description: string;
  src: string;
  alt: string;
}

/**
 * A list whose rows roll their label up to a second, accented copy on hover,
 * revealing a supporting image to the right.
 *
 * Adapted from a prebuiltui rolling list. Differences: plain <img> rather than
 * next/image, no `cn` helper (there is no shadcn here), the brand orange in
 * place of blue, and no dark-mode variants since the site is light only.
 *
 * The heavy uppercase treatment is kept from the source deliberately, as a
 * contrast against the site's lighter Palatino headings. See the font note
 * above for why the labels alone use a different face.
 */
function RollingListRow({ item }: { item: RollingListItem }) {
  return (
    <div className="group relative w-full cursor-default border-b border-black/10 py-7 last:border-b-0">
      {/* Rolling label */}
      <div className="relative h-[68px] md:h-24 overflow-hidden">
        <div className="transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2">
          <div className="flex h-[68px] md:h-24 items-center">
            <h3
              className={`${poppins.className} text-black text-6xl md:text-[5rem] font-black uppercase tracking-tighter`}
            >
              {item.title}
            </h3>
          </div>
          <div className="flex h-[68px] md:h-24 items-center">
            <h3
              aria-hidden="true"
              className={`${poppins.className} text-[#FF6E00] text-6xl md:text-[5rem] font-black uppercase tracking-tighter italic`}
            >
              {item.title}
            </h3>
          </div>
        </div>
      </div>

      <p className="text-black/60 text-base leading-relaxed mt-3 md:pr-60">
        {item.description}
      </p>

      {/* Step number, hidden while the image is revealed */}
      <span className="absolute right-0 top-7 hidden text-xs font-medium uppercase tracking-[0.15em] text-[#FF6E00] transition-opacity duration-300 group-hover:opacity-0 md:block">
        {item.category}
      </span>

      {/* Image reveal */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 z-20 hidden h-32 w-48 -translate-y-1/2 translate-x-4 rotate-3 scale-95 overflow-hidden rounded-xl opacity-0 shadow-2xl transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 md:block"
      >
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-500 ease-out group-hover:grayscale-0"
        />
      </div>
    </div>
  );
}

export function RollingList({ items }: { items: RollingListItem[] }) {
  return (
    <div className="flex w-full flex-col">
      {items.map((item) => (
        <RollingListRow key={item.id} item={item} />
      ))}
    </div>
  );
}
