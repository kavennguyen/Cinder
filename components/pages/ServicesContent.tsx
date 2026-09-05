"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import PageShell from "@/components/PageShell";
import {
  ServicesCarousel,
  type ServiceCardData,
} from "@/components/ui/services-carousel";
import {
  CallsVisual,
  HandledVisual,
  NoLoginVisual,
  OngoingVisual,
} from "@/components/ui/service-visuals";
import { revealVariants } from "@/lib/motion";

const chartLines = [
  {
    name: "Cinder",
    color: "#FF6E00",
    points: "0,190 103,175 206,168 309,150 412,120 514,90 617,55 720,30",
  },
  {
    name: "Competitor A",
    color: "rgba(0,0,0,0.35)",
    points: "0,70 103,75 206,72 309,80 412,85 514,90 617,95 720,100",
  },
  {
    name: "Competitor B",
    color: "rgba(0,0,0,0.18)",
    points: "0,130 103,128 206,132 309,135 412,130 514,128 617,125 720,120",
  },
];

const statCards = [
  {
    label: "AI Citations Tracked",
    value: "3,181",
    breakdown: [
      { name: "ChatGPT", value: "1,240" },
      { name: "Perplexity", value: "980" },
      { name: "Gemini", value: "640" },
    ],
  },
  {
    label: "Average Citation Position",
    value: "2.1",
    breakdown: [
      { name: "ChatGPT", value: "1.8" },
      { name: "Perplexity", value: "2.3" },
      { name: "Gemini", value: "2.4" },
    ],
  },
];

/* Four cards per track, each with a drawn visual in the bento's idiom.
   Four rather than three so the carousel has somewhere to go: three visible
   per view on desktop would leave nothing to scroll and dead arrows. */
const smallBusinessCards: ServiceCardData[] = [
  {
    number: "001",
    title: "Our team runs it",
    description:
      "The same platform that powers the dashboard, operated for you by the people who built it.",
    visual: <HandledVisual />,
  },
  {
    number: "002",
    title: "Nothing new to learn",
    description:
      "No dashboard to log into and no new discipline to hire for. You never have to touch the tooling.",
    visual: <NoLoginVisual />,
  },
  {
    number: "003",
    title: "Monthly strategy calls",
    description:
      "A standing call to walk through what moved, what we changed, and what is worth doing next.",
    visual: <CallsVisual />,
  },
  {
    number: "004",
    title: "Continuous adjustments",
    description:
      "We keep monitoring after the first fixes ship and adjust as the engines shift what they cite.",
    visual: <OngoingVisual />,
  },
];

export default function ServicesContent() {
  return (
    <PageShell>
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-16"
      >
        <div>
          <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            What We Do
          </p>
          <h1
            className="text-black text-4xl md:text-6xl font-bold leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            The tools to see it.
            <br />
            The team to do it.
          </h1>
        </div>
        <p className="text-black/70 text-lg md:text-xl leading-relaxed md:pt-3">
          Cinder is an{" "}
          <strong className="font-semibold text-xl md:text-2xl text-black">
            AI visibility platform
          </strong>{" "}
          for the age of answer engines. We measure where you stand across{" "}
          <span className="font-semibold text-xl md:text-2xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
            AI search
          </span>
          , then our team does the work that gets you named. You never have to
          touch the tooling.
        </p>
      </motion.div>

      {/* Open preview section - the dashboard, in practice */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-24"
      >
        <div className="rounded-2xl border border-black/10 bg-white/40 p-8 md:p-12">
          <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            See The Dashboard
          </p>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8 max-w-xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            This is what tracking your{" "}
            <span className="text-[#FF6E00]">AI visibility</span> looks like
          </h2>

          <svg viewBox="0 0 720 240" className="w-full h-auto mb-6">
            {[0, 60, 120, 180, 240].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="720"
                y2={y}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
              />
            ))}
            {chartLines.map((line) => (
              <polyline
                key={line.name}
                points={line.points}
                fill="none"
                stroke={line.color}
                strokeWidth={line.name === "Cinder" ? 4 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          <div className="flex flex-wrap gap-6">
            {chartLines.map((line) => (
              <div key={line.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: line.color }}
                />
                <span className="text-black/70 text-sm font-medium">
                  {line.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-black/10 bg-white/40 p-6 flex-1"
            >
              <p className="text-black/60 text-sm mb-2">{card.label}</p>
              <p
                className="text-black text-4xl font-medium mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                {card.value}
              </p>
              <div className="flex flex-col gap-1.5">
                {card.breakdown.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-black/60">{item.name}</span>
                    <span className="text-black/80 font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        id="small-business"
        custom={3}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="scroll-mt-32 pt-16 border-t border-black/10"
      >
        <div className="mb-8 max-w-2xl">
          <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            For Small Business
          </p>
          <h2
            className="text-black text-3xl md:text-4xl font-bold leading-tight mb-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="text-[#FF6E00]">AI visibility</span>, done for you.
          </h2>
          <p className="text-black/70 text-lg leading-relaxed">
            Most small businesses don&apos;t have the time or the specialist
            knowledge to optimize for{" "}
            <strong className="font-semibold text-xl text-black">
              AI search
            </strong>
            , and they shouldn&apos;t have to. Our team does it for them, so you
            show up in{" "}
            <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
              the recommendations they trust
            </span>
            .
          </p>
        </div>

        <ServicesCarousel cards={smallBusinessCards} label="For small business" />

        <Link
          href="/contact"
          className="mt-14 inline-flex w-fit items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200"
        >
          Get a Free Audit
          <span className="bg-white rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-black" />
          </span>
        </Link>
      </motion.div>

    </PageShell>
  );
}
