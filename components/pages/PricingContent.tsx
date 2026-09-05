"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Minus } from "lucide-react";

import PageShell from "@/components/PageShell";
import {
  PUBLIC_PLANS,
  ONBOARDING_FEE_CENTS,
  PLANNED_ENGINES,
  formatCAD,
} from "@/lib/pricing";
import { revealVariants } from "@/lib/motion";

/* ---------------------------------------------------------------- methods */

/* Copy lifted verbatim from components/dashboard/rolling.ts so the site and
   the product describe the measurement in exactly the same words. Duplicated
   rather than imported: the marketing bundle should not pull in dashboard
   code, and these strings must not drift silently — if rolling.ts changes,
   change them here too. */
const METHODS = [
  {
    title: "How the score is measured",
    body:
      "The share of the latest run for each prompt × engine that named your " +
      "brand. Measured daily from a clean, consistent context — not a replica " +
      "of any one person's chat.",
  },
  {
    title: "How the trend is measured",
    body:
      "Each day's score is the share of that day's successful runs that named " +
      "your brand. The headline line is a 7-day run-weighted average, because " +
      "a single day's sample moves mostly on chance.",
  },
  {
    title: "How share of voice is measured",
    body:
      "Across every successful run in the last 30 days, the share that named " +
      "each brand. Brands can appear in the same answer, so these don't add " +
      "up to 100%.",
  },
  {
    title: "Why the answers are Canadian",
    body:
      "Engine calls carry a Canadian location and your city, and prompts are " +
      "phrased the way Canadians actually ask. An answer measured from a US " +
      "context is a different answer.",
  },
];

/* ------------------------------------------------------------ month of work */

const MONTH = [
  {
    n: "01",
    title: "Audit and prompt set",
    body: "We find the questions your customers ask, and measure where you stand on each one today.",
  },
  {
    n: "02",
    title: "First changes shipped and logged",
    body: "We write and publish the pages and markup the engines need in order to quote you. Every change is recorded with the date and the pages it touched.",
  },
  {
    n: "03",
    title: "Measure",
    body: "Every prompt runs daily across all three engines. You can open any answer and read what the engine actually said.",
  },
  {
    n: "04",
    title: "Report and call",
    body: "A PDF showing what moved and what we changed, then a call to decide the next month's work.",
  },
];

/* ------------------------------------------------------------- comparison */

/* Only rows for things that ship today, or that carry an explicit date. A tick
   here is a promise, so anything unbuilt is labelled "planned", never ticked. */
const COMPARISON: {
  label: string;
  managed: string | boolean;
  plus: string | boolean;
}[] = [
  { label: "Tracked prompts", managed: "50", plus: "100" },
  { label: "Competitors benchmarked", managed: "10", plus: "15" },
  { label: "ChatGPT, Perplexity and Gemini", managed: true, plus: true },
  { label: "How often prompts run", managed: "Daily", plus: "Daily" },
  { label: "Site changes written and shipped", managed: "Up to 6/mo", plus: "Up to 12/mo" },
  { label: "Change log with dates and pages", managed: true, plus: true },
  { label: "Sources report", managed: true, plus: true },
  { label: "Strategy calls", managed: "1/mo", plus: "2/mo" },
  { label: "Monthly PDF report", managed: true, plus: true },
  { label: "Dashboard access", managed: true, plus: true },
  { label: "Quarterly content plan", managed: false, plus: true },
  { label: "Per-location prompt sets", managed: false, plus: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return <Check className="h-4 w-4 text-[#FF6E00]" aria-label="Included" />;
  if (value === false)
    return <Minus className="h-4 w-4 text-black/20" aria-label="Not included" />;
  return <span className="text-sm text-black/70">{value}</span>;
}

/* -------------------------------------------------------------------- page */

export default function PricingContent() {
  return (
    <PageShell>
      {/* 1 — header */}
      <motion.article
        custom={0}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="max-w-2xl mb-12"
      >
        <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
          <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
          Pricing
        </p>
        <h1
          className="text-black text-4xl md:text-6xl font-bold leading-tight mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          We do the work.{" "}
          <span className="text-[#FF6E00]">You get the record.</span>
        </h1>
        <p className="text-black/70 text-lg md:text-xl leading-relaxed">
          Two levels of the same managed service. Our team measures where you
          stand across the answer engines, ships the changes, and shows you what
          moved. Prices in{" "}
          <strong className="font-semibold text-xl md:text-2xl text-black">
            CAD, month to month
          </strong>
          , plus HST.
        </p>
      </motion.article>

      {/* 2 & 3 — two cards, no toggle, onboarding fee under each price */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr"
      >
        {PUBLIC_PLANS.map((plan, i) => {
          const primary = i === 0;
          return (
            <div
              key={plan.id}
              className={`flex h-full flex-col rounded-3xl border bg-white p-8 md:p-10 ${
                primary ? "border-[#FF6E00]" : "border-black/10"
              }`}
            >
              <h2 className="text-black text-2xl font-bold mb-1.5">
                {plan.name}
              </h2>
              <p className="text-black/55 text-sm leading-relaxed mb-6">
                {plan.audience}
              </p>

              <p className="flex items-baseline gap-1.5">
                <span
                  className="text-black text-5xl font-bold"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  {formatCAD(plan.priceCents)}
                </span>
                <span className="text-black/50 text-base">CAD / month</span>
              </p>
              <p className="text-black/45 text-sm mt-2 mb-7">
                Plus a one-time {formatCAD(ONBOARDING_FEE_CENTS)} audit and
                setup week to start.
              </p>

              <ul className="flex flex-col gap-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 text-black/70 text-sm leading-relaxed">
                    <Check
                      className="h-4 w-4 shrink-0 mt-0.5 text-[#FF6E00]"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <p className="mt-auto text-black/45 text-sm leading-relaxed mb-6 pt-6 border-t border-black/[0.07]">
                <span className="text-black/60 font-medium">Not included: </span>
                {plan.notIncluded}
              </p>

              <Link
                href={`/contact?plan=${plan.id}`}
                className={`group inline-flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-medium transition-colors duration-200 ${
                  primary
                    ? "bg-black text-white hover:bg-[#FF6E00]"
                    : "border border-black/15 text-black hover:border-[#FF6E00] hover:bg-[#FF6E00] hover:text-white"
                }`}
              >
                Book a 20-minute call
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          );
        })}
      </motion.div>

      {/* Tells a comparison shopper the instrument exists without inviting them
          to price it against a $99 tool. No price, no CTA, deliberately. */}
      <motion.p
        custom={2}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="text-black/45 text-sm mt-5"
      >
        Already a client? Dashboard-only monitoring is available when you need
        it.
      </motion.p>

      {/* 4 — what a month looks like */}
      <motion.section
        custom={3}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mt-24 pt-16 border-t border-black/10"
      >
        <h2
          className="text-black text-3xl md:text-4xl font-bold leading-tight mb-10 max-w-2xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          What a month of <span className="text-[#FF6E00]">Managed</span> looks
          like.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MONTH.map((m) => (
            <div
              key={m.n}
              className="rounded-2xl border border-black/10 bg-[#FAF9F6] p-7"
            >
              <span className="text-[#FF6E00] text-xs font-semibold tracking-[0.15em]">
                {m.n}
              </span>
              <h3 className="text-black text-lg font-semibold mt-2 mb-1.5">
                {m.title}
              </h3>
              <p className="text-black/60 text-sm leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 5 — comparison, shipped features only */}
      <motion.section
        custom={4}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mt-24 pt-16 border-t border-black/10"
      >
        <h2
          className="text-black text-3xl md:text-4xl font-bold leading-tight mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Side by side.
        </h2>
        <p className="text-black/60 text-lg leading-relaxed mb-10 max-w-2xl">
          Every row below is something that runs today. Anything still being
          built is listed underneath as planned, with a date.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-black/10">
                <th className="py-4 pr-4 text-sm font-medium text-black/50">
                  Feature
                </th>
                {PUBLIC_PLANS.map((p) => (
                  <th
                    key={p.id}
                    className="py-4 px-4 text-sm font-semibold text-black w-40"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-black/[0.06]">
                  <td className="py-3.5 pr-4 text-sm text-black/70">
                    {row.label}
                  </td>
                  <td className="py-3.5 px-4">
                    <Cell value={row.managed} />
                  </td>
                  <td className="py-3.5 px-4">
                    <Cell value={row.plus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {PLANNED_ENGINES.map((e) => (
            <span
              key={e.name}
              className="rounded-full border border-black/10 bg-[#FAF9F6] px-3.5 py-1.5 text-xs text-black/50"
            >
              {e.name} — planned, {e.eta}
            </span>
          ))}
        </div>
      </motion.section>

      {/* 6 — how we measure */}
      <motion.section
        custom={5}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mt-24 pt-16 border-t border-black/10"
      >
        <h2
          className="text-black text-3xl md:text-4xl font-bold leading-tight mb-10 max-w-2xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          How we measure it.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METHODS.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl border border-black/10 bg-[#FAF9F6] p-7"
            >
              <h3 className="text-black text-lg font-semibold mb-2">
                {m.title}
              </h3>
              <p className="text-black/60 text-sm leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 7 — pricing FAQ */}
      <motion.section
        custom={6}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mt-24 pt-16 border-t border-black/10"
      >
        <h2
          className="text-black text-3xl md:text-4xl font-bold leading-tight mb-10"
          style={{ letterSpacing: "-0.02em" }}
        >
          Pricing questions.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {PRICING_FAQ.map((q) => (
            <div key={q.q}>
              <h3 className="text-black text-base font-semibold mb-2">{q.q}</h3>
              <p className="text-black/60 text-sm leading-relaxed">{q.a}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 8 — closing CTA */}
      <motion.section
        custom={7}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mt-24 rounded-3xl border border-black/10 bg-[#FAF9F6] px-7 py-12 md:px-12 md:py-16 text-center"
      >
        <h2
          className="text-black text-2xl md:text-4xl font-bold leading-snug mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          Find out where you stand first.
        </h2>
        <p className="text-black/60 text-lg leading-relaxed max-w-xl mx-auto mb-8">
          We&apos;ll run your category across ChatGPT, Perplexity and Gemini and
          send you the one-page result — who gets named, and who doesn&apos;t.
          Free, and no obligation.
        </p>
        <Link
          href="/contact?intent=snapshot"
          className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-black px-8 py-4 text-base font-medium text-white transition-colors duration-200 hover:bg-[#FF6E00]"
        >
          Get a free AI Visibility Snapshot
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </motion.section>
    </PageShell>
  );
}

const PRICING_FAQ = [
  {
    q: "What counts as a prompt?",
    a: "One question we track, such as “best physiotherapist in Etobicoke”. Each prompt runs against every engine on your plan, every day, and each of those is a separate run you can open and read.",
  },
  {
    q: "Can I change my prompts?",
    a: "Yes, at any time, within your plan's limit. We usually revisit the set on the monthly call as we learn which questions actually bring you customers.",
  },
  {
    q: "Which engines do you measure, and why not Google?",
    a: "ChatGPT, Perplexity and Gemini today. Google's AI Overviews are planned for Q4 2026 — they need a different data source than a chat API, and we would rather ship it properly than claim it early. Claude and Copilot come after that.",
  },
  {
    q: "Is there a contract?",
    a: "No. Month to month, cancel any time. The one-time audit and setup week is charged before the first month and is not credited against it.",
  },
  {
    q: "What access do you need to my site?",
    a: "Enough to publish pages and add markup — usually an editor or admin login for your CMS, or a working relationship with whoever maintains your site. If we can't publish to your site, we can't do the work, so we check this before you pay anything.",
  },
  {
    q: "What happens after the audit week?",
    a: "You get the audit, the prompt set and the first sources report whether or not you continue. If you carry on, the monthly work starts immediately from that baseline.",
  },
  {
    q: "Currency and tax?",
    a: "All prices are Canadian dollars, billed monthly, plus HST.",
  },
];
