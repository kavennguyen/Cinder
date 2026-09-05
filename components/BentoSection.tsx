"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Quote, UserCheck } from "lucide-react";

import { BentoGrid, VisualFade, type BentoCell } from "@/components/ui/bento-grid";
import { CanadaGlobe } from "@/components/ui/canada-globe";
import { revealVariants } from "@/lib/motion";

/* ------------------------------------------------------------------ visuals */

/** The four steps, drawn rather than photographed. */
function StepsVisual() {
  const steps = [
    { n: "01", label: "Track", note: "the questions your customers ask" },
    { n: "02", label: "Measure", note: "who gets named, daily" },
    { n: "03", label: "Fix", note: "write what engines can quote" },
    { n: "04", label: "Prove", note: "log every change" },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {steps.map((s) => (
        <div
          key={s.n}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-black/10 bg-white/70 px-4 py-3"
        >
          <span className="text-[#FF6E00] text-xs font-semibold tracking-[0.15em]">
            {s.n}
          </span>
          <span className="text-black text-sm font-semibold">{s.label}</span>
          {/* Wraps to its own line on narrow cards rather than truncating to
              an ellipsis, which left the notes unreadable on mobile. */}
          <span className="text-black/45 text-sm basis-full sm:basis-auto">
            {s.note}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A citation list, standing in for the dashboard's source view. */
function CitationsVisual() {
  const rows = [
    { source: "your pricing page", cited: true },
    { source: "a competitor's blog", cited: false },
    { source: "your FAQ", cited: true },
  ];
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div
          key={r.source}
          className="flex items-center justify-between rounded-lg border border-black/10 bg-white/70 px-3.5 py-2.5"
        >
          <span className="flex items-center gap-2 text-black/70 text-sm">
            <Quote className="h-3.5 w-3.5 text-black/25" />
            {r.source}
          </span>
          <span
            className={`text-xs font-medium ${
              r.cited ? "text-[#FF6E00]" : "text-black/30"
            }`}
          >
            {r.cited ? "cited" : "not cited"}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A rising visibility line. Shape only, no axis values to misread as data. */
function TrendVisual() {
  return (
    <div className="relative">
      <svg viewBox="0 0 320 96" className="w-full h-auto" aria-hidden="true">
        {[0, 32, 64, 96].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="320"
            y2={y}
            stroke="rgba(0,0,0,0.07)"
            strokeWidth="1"
          />
        ))}
        <polyline
          points="0,86 53,78 106,74 160,58 213,42 266,26 320,12"
          fill="none"
          stroke="#FF6E00"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-black/35 text-xs mt-2">
        Shape of a typical climb, not measured data.
      </p>
    </div>
  );
}

/** A change-log entry, mirroring what the changes table records. */
function ChangeLogVisual() {
  const entries = [
    { type: "schema", title: "Added product schema" },
    { type: "content", title: "Rewrote 12 answer pages" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {entries.map((e) => (
        <div
          key={e.title}
          className="rounded-lg border border-black/10 bg-white/70 px-3.5 py-2.5"
        >
          <span className="text-[#FF6E00] text-[10px] font-semibold uppercase tracking-[0.12em]">
            {e.type}
          </span>
          <p className="text-black/70 text-sm mt-0.5">{e.title}</p>
        </div>
      ))}
    </div>
  );
}

function PhotoVisual({
  src,
  alt,
  icon,
  cta,
  href,
}: {
  src: string;
  alt: string;
  icon: ReactNodeIcon;
  cta: string;
  href: string;
}) {
  const Icon = icon;
  return (
    // No h-full here: it would stretch to fill the cell and defeat the grid's
    // justify-end, leaving the two photo cards' CTAs on different baselines.
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl">
        {/* transition-[filter] rather than transition-all: `all` makes the
            browser watch every animatable property on a filtered bitmap.
            srcset keeps phones off the 900px source for a ~250px slot. */}
        <img
          src={`${src}&w=900`}
          srcSet={`${src}&w=500 500w, ${src}&w=900 900w`}
          sizes="(max-width: 768px) 90vw, 30vw"
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-40 w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
        />
        <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-[#FF6E00]/25 bg-white/95 md:bg-white/85 md:backdrop-blur">
          <Icon className="h-4 w-4 text-[#FF6E00]" />
        </span>
      </div>
      <Link
        href={href}
        className="group/cta mt-5 inline-flex items-center gap-2 text-sm font-semibold text-black transition-colors hover:text-[#FF6E00]"
      >
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
      </Link>
    </div>
  );
}

type ReactNodeIcon = typeof Check;

/* ---------------------------------------------------------------- emphasis */

/**
 * The site's selective-emphasis convention, as used on About, Services and
 * Case Studies: a marked phrase goes semibold and up one size step from the
 * copy around it. Orange is the louder of the two and carries a matching
 * orange underline; plain bold is the quieter one. Cell copy is
 * `text-sm md:text-base`, so the step up is `text-base md:text-lg`.
 *
 * Used sparingly on purpose — one phrase per cell at most, alternating so no
 * row ends up all orange.
 */
function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="font-semibold text-base md:text-lg text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
      {children}
    </span>
  );
}

function Strong({ children }: { children: ReactNode }) {
  return (
    <strong className="font-semibold text-base md:text-lg text-black">
      {children}
    </strong>
  );
}

/* -------------------------------------------------------------------- cells */

const cells: BentoCell[] = [
  {
    title: "Meet Cinder.",
    description: (
      <>
        The AI visibility platform built for Canada. We measure where you stand
        across the answer engines, then do the work that{" "}
        <Accent>puts you in the sentence</Accent>. Four repeatable steps, run
        continuously.
      </>
    ),
    span: 4,
    visual: <StepsVisual />,
  },
  {
    title: "Built for Canada.",
    description: (
      <>
        These models learned from an internet that{" "}
        <Strong>skews American</Strong>. We work the other way, on the
        businesses AI keeps overlooking.
      </>
    ),
    span: 2,
    visual: (
      // Top-anchored so the crop lands at the bottom whatever width the card
      // gives the canvas. Bottom-anchoring left a band of dead space above the
      // globe once it shrank on mobile.
      <div className="relative h-56 overflow-hidden">
        <CanadaGlobe className="absolute top-0 left-1/2 -translate-x-1/2" />
        <VisualFade />
      </div>
    ),
  },
  {
    title: "For small business",
    description: (
      <>
        You will <Strong>never log in</Strong>. Our team writes and ships the
        pages AI needs to quote you, then sends the record of what changed.
      </>
    ),
    span: 4,
    visual: (
      <PhotoVisual
        src="https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb"
        alt="A small business owner at work"
        icon={UserCheck}
        cta="Explore the service"
        href="/services#small-business"
      />
    ),
  },
  {
    title: "Citations compound",
    description: (
      <>
        Every citation makes the next likelier. The harder it gets for a
        competitor to take <Accent>the default answer</Accent> back off you.
      </>
    ),
    span: 2,
    visual: <TrendVisual />,
  },
  {
    title: "See what gets quoted",
    description: (
      <>
        Which of your pages the engines actually pull from, and which questions
        you are <Strong>missing from entirely</Strong>.
      </>
    ),
    span: 3,
    visual: <CitationsVisual />,
  },
  {
    title: "Every change, on the record",
    description:
      "Each fix is logged with the pages it touched and the date, so a move in your score ties back to the work behind it.",
    span: 3,
    visual: <ChangeLogVisual />,
  },
];

/* ------------------------------------------------------------------ section */

export default function BentoSection() {
  return (
    <section className="bg-white px-6 pt-12 pb-24">
      <div className="max-w-[88rem] mx-auto">
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="max-w-2xl mb-12"
        >
          <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            How It Works
          </p>
          <h2
            className="text-black text-4xl md:text-5xl font-bold leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            One engine,{" "}
            <span className="text-[#FF6E00]">two ways to get named</span>.
          </h2>
          {/* The h2 above already carries the orange, so this one stays on the
              quieter bold. Copy is text-lg here, so the step up is text-xl. */}
          <p className="text-black/60 text-lg leading-relaxed">
            Run it yourself in the dashboard, or hand the whole thing to our
            team. Either way{" "}
            <strong className="font-semibold text-xl text-black">
              the measurement underneath is the same
            </strong>
            .
          </p>
        </motion.div>

        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
        >
          <BentoGrid cells={cells} />
        </motion.div>
      </div>
    </section>
  );
}
