"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Services carousel.
 *
 * Adapted from a shadcn/Embla service-card carousel. Differences from the
 * source, all forced by this codebase:
 *
 * - No `cn()` helper and no shadcn `Button` — there is no shadcn here, so
 *   classes are composed as template strings and the controls are plain
 *   buttons in the site's pill style.
 * - `motion/react`, not framer-motion.
 * - The source's full shadcn Carousel context (Carousel / CarouselContent /
 *   CarouselItem / CarouselNext, ~150 lines of forwardRef plumbing) is dropped.
 *   The context exists so those parts can be composed freely elsewhere; here
 *   the carousel is used twice, in one file, with the same shape both times.
 * - Cards use the homepage bento's shell rather than the source's tall
 *   pastel-gradient cards, so the two sections read as one system.
 * - Both a previous and a next control. The source ships next only, which
 *   leaves no way back on a touch device that does not register the drag.
 */

export interface ServiceCardData {
  number: string;
  title: string;
  description: string;
  /** Drawn illustration for the lower half, as in the bento cells. */
  visual: ReactNode;
}

function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    // Same shell as components/ui/bento-grid.tsx: off-white, hairline border,
    // orange hover glow. h-full so cards in a view share a height.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-[#FAF9F6] p-7 md:p-8 transition-all duration-300 hover:border-[#FF6E00]/40 hover:shadow-[0_10px_34px_-8px_rgba(255,110,0,0.28)]">
      {/* Palatino with wide tracking rather than the source's font-mono. The
          site has no mono face and a second family for eight decorative
          numerals is not worth the download. */}
      <span className="mb-5 text-sm tracking-[0.2em] text-black/35">
        ( {card.number} )
      </span>
      <h3
        className="mb-2 text-xl md:text-2xl font-bold leading-snug text-black"
        style={{ letterSpacing: "-0.02em" }}
      >
        {card.title}
      </h3>
      <p className="text-sm md:text-base leading-relaxed text-black/60">
        {card.description}
      </p>
      <div className="relative mt-6 flex grow flex-col justify-end">
        {card.visual}
      </div>
    </article>
  );
}

export function ServicesCarousel({
  cards,
  label,
}: {
  cards: ServiceCardData[];
  label: string;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ align: "start", loop: true });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla]);

  const control =
    "flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-black transition-colors duration-200 hover:border-[#FF6E00] hover:bg-[#FF6E00] hover:text-white";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollPrev();
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollNext();
        }
      }}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        {/* items-stretch so every card in a view matches the tallest. */}
        <div className="flex -ml-4 items-stretch">
          {cards.map((card) => (
            <div
              key={card.number}
              role="group"
              aria-roledescription="slide"
              aria-label={card.title}
              className="flex min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <ServiceCard card={card} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {/* Position readout, so the control pair says how far along you are
            rather than just offering two arrows. */}
        <p className="text-sm text-black/45" aria-live="polite">
          <span className="text-black/70">{selected + 1}</span> / {cards.length}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={scrollPrev}
            className={control}
            aria-label={`Previous, ${label}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={control}
            aria-label={`Next, ${label}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
