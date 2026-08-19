"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export interface TimelineEntry {
  /** Sticky label shown on the left. */
  title: string;
  /** Optional smaller line under the title. */
  subtitle?: string;
  content: ReactNode;
}

/**
 * Vertical scroll-tracked list: each entry's title pins to the left while its
 * content scrolls past on the right, with a progress beam filling as you go.
 *
 * Adapted from an Aceternity timeline. Differences from the source: uses the
 * `motion` package this codebase already has rather than adding framer-motion,
 * plain <img> rather than next/image, no dark-mode variants (the site is
 * light-only), the brand orange in place of the purple/blue beam, and no
 * built-in heading so callers can use PageHeader.
 */
export function Timeline({ data }: { data: TimelineEntry[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const measure = () => setHeight(el.getBoundingClientRect().height);

    // Measure synchronously first. ResizeObserver callbacks are delivered
    // during the rendering steps, which a backgrounded tab does not run, so
    // relying on the observer alone leaves the track at zero height until the
    // tab is focused.
    measure();

    // Then observe, because the source measured only once on mount and went
    // stale as soon as images finished loading and the list grew taller,
    // leaving the beam stopping short of the end.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const beamHeight = useTransform(scrollYProgress, [0, 1], [0, height]);
  const beamOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={listRef} className="relative pb-10">
        {data.map((item) => (
          <div
            key={item.title}
            className="flex justify-start pt-10 md:pt-32 md:gap-10"
          >
            {/* Sticky company label */}
            <div className="sticky top-32 z-30 flex flex-col md:flex-row items-start self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <div className="h-4 w-4 rounded-full border-2 border-[#FF6E00] bg-white" />
              </div>
              <div className="hidden md:block md:pl-20">
                <h3
                  className="text-black text-3xl lg:text-4xl font-medium leading-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-black/50 text-sm mt-2">{item.subtitle}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="relative w-full pl-20 pr-2 md:pl-4">
              <div className="md:hidden mb-5">
                <h3
                  className="text-black text-2xl font-medium leading-tight"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="text-black/50 text-sm mt-1">{item.subtitle}</p>
                )}
              </div>
              {item.content}
            </div>
          </div>
        ))}

        {/* Progress track */}
        <div
          style={{ height: `${height}px` }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.12)_10%,rgba(0,0,0,0.12)_90%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: beamHeight, opacity: beamOpacity }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-[#FF6E00] via-[#FF8A2E] to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
