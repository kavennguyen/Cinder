"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Briefcase,
  CalendarClock,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Phone,
  Quote,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

import PageShell from "@/components/PageShell";
import { FeatureGrid, type Feature } from "@/components/ui/feature-grid";
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

const agencyFeatures: Feature[] = [
  {
    icon: LayoutDashboard,
    title: "Every client in one place",
    description:
      "Track AI visibility across your whole roster without switching tools or re-running prompts by hand.",
  },
  {
    icon: TrendingUp,
    title: "Competitor benchmarking",
    description:
      "See your share of AI voice next to the brands you are up against, so progress is measured, not asserted.",
  },
  {
    icon: Quote,
    title: "Citation sources",
    description:
      "See which pages the engines actually quote, and which questions your client is missing from entirely.",
  },
  {
    icon: Target,
    title: "Highest impact actions",
    description:
      "The gaps are ranked, so your team spends its hours on the work most likely to move a score.",
  },
  {
    icon: FileText,
    title: "White label reporting",
    description:
      "Send clients a report under your own brand. Cinder does the measuring and stays out of the way.",
  },
  {
    icon: Users,
    title: "Unlimited client workspaces",
    description:
      "Add every client you manage. Pro has no per-client pricing and no seat maths to work around.",
  },
];

const smallBusinessFeatures: Feature[] = [
  {
    icon: UserCheck,
    title: "Our team runs it",
    description:
      "The same platform that powers the dashboard, operated for you by the people who built it.",
  },
  {
    icon: GraduationCap,
    title: "Nothing new to learn",
    description:
      "No dashboard to log into and no new discipline to hire for. You never have to touch the tooling.",
  },
  {
    icon: CalendarClock,
    title: "An ongoing retainer",
    description:
      "Billed monthly rather than as a one time project, because AI engines keep changing their answers.",
  },
  {
    icon: Phone,
    title: "Monthly strategy calls",
    description:
      "A standing call to walk through what moved, what we changed, and what is worth doing next.",
  },
  {
    icon: Activity,
    title: "Continuous adjustments",
    description:
      "We keep monitoring after the first fixes ship and adjust as the engines shift what they cite.",
  },
  {
    icon: Briefcase,
    title: "You run your business",
    description:
      "You stay focused on the work you actually do. We make sure AI recommends it when someone asks.",
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
          for the age of answer engines. However you want to win{" "}
          <span className="font-semibold text-xl md:text-2xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
            AI search
          </span>
          , we have a way in: a dashboard for agencies, and a done for you
          service for small businesses.
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

      {/* Tracks side by side. The parent defines three rows (header, cards,
          CTA) and each track spans them with grid-rows-subgrid, so both
          columns share row tracks and their grids line up even though the
          headings and intro copy differ in length. */}
      <div className="pt-16 border-t border-black/10 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto] gap-12 lg:gap-x-10 lg:gap-y-0">
        {/* Track 1 - Agencies */}
        <motion.div
          id="agencies"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="scroll-mt-32 lg:row-span-3 lg:grid lg:grid-rows-subgrid"
        >
          <div className="mb-8">
            <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
              <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
              For Agencies
            </p>
            <h2
              className="text-black text-3xl md:text-4xl font-medium leading-tight mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              Every client&apos;s{" "}
              <span className="text-[#FF6E00]">AI visibility</span>, in one
              place.
            </h2>
            <p className="text-black/70 text-lg leading-relaxed">
              The Cinder dashboard is built for agencies who want to offer{" "}
              <strong className="font-semibold text-xl text-black">
                AI visibility
              </strong>{" "}
              as a service without building the machinery themselves. What used
              to take scattered tools, manual prompting, and guesswork becomes
              one{" "}
              <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                clean, repeatable workflow
              </span>
              .
            </p>
          </div>

          <div className="mb-8">
            <FeatureGrid features={agencyFeatures} columns={2} glow />
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-3 self-start bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200"
          >
            Get a Free Audit
            <span className="bg-white rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-black" />
            </span>
          </Link>
        </motion.div>

        {/* Track 2 - Small Business */}
        <motion.div
          id="small-business"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="scroll-mt-32 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:border-l lg:border-black/10 lg:pl-10"
        >
          <div className="mb-8">
            <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
              <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
              For Small Business
            </p>
            <h2
              className="text-black text-3xl md:text-4xl font-medium leading-tight mb-4"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="text-[#FF6E00]">AI visibility</span>, done for
              you.
            </h2>
            <p className="text-black/70 text-lg leading-relaxed">
              Most small businesses don&apos;t have the time or the specialist
              knowledge to optimize for{" "}
              <strong className="font-semibold text-xl text-black">
                AI search
              </strong>
              , and they shouldn&apos;t have to. Our team does it for them, so
              you show up in{" "}
              <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                the recommendations they trust
              </span>
              .
            </p>
          </div>

          <div className="mb-8">
            <FeatureGrid features={smallBusinessFeatures} columns={2} />
          </div>

          <Link
            href="/contact"
            className="inline-flex w-fit items-center gap-3 self-start bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200"
          >
            Get a Free Audit
            <span className="bg-white rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-black" />
            </span>
          </Link>
        </motion.div>
      </div>
    </PageShell>
  );
}
