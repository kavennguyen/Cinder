"use client";

import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { Timeline, type TimelineEntry } from "@/components/ui/timeline";

interface Result {
  label: string;
  value: string;
  /** Where the entry started, when showing movement. */
  from?: string;
}

interface CaseStudy {
  name: string;
  category: string;
  year: string;
  summary: string;
  results: Result[];
  images: { src: string; alt: string }[];
}

/**
 * ILLUSTRATIVE EXAMPLES, NOT REAL CLIENTS.
 *
 * Company names and figures below are invented to show the shape of a Cinder
 * engagement. The page labels them as such in the header and again above the
 * list. Replace this array wholesale when real, permissioned case studies
 * exist, and drop the notice in the same change.
 */
const caseStudies: CaseStudy[] = [
  {
    name: "Maple & Co.",
    category: "Retail",
    year: "2026",
    summary:
      "Product pages read like brochures, so the engines had nothing quotable. We rewrote the top twenty into direct question-and-answer pages and added product schema.",
    results: [
      { label: "Share of AI voice", value: "34%", from: "9%" },
      { label: "Prompts citing them", value: "41 of 60" },
      { label: "Inbound from AI referrals", value: "+2.8x" },
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Retail storefront interior",
      },
      {
        src: "https://images.pexels.com/photos/30768276/pexels-photo-30768276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Product display shelving",
      },
    ],
  },
  {
    name: "Northline",
    category: "Ecommerce",
    year: "2025 to 2026",
    summary:
      "A competitor owned every buying-intent answer. We tracked which sources the engines pulled from, then built comparison pages targeting the exact prompts customers were asking.",
    results: [
      { label: "Share of AI voice", value: "52%", from: "18%" },
      { label: "Average citation position", value: "1.6", from: "4.2" },
      { label: "Assisted revenue", value: "+19%" },
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Warehouse fulfilment operation",
      },
      {
        src: "https://images.pexels.com/photos/669612/pexels-photo-669612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Packing and shipping desk",
      },
    ],
  },
  {
    name: "Sterling Digital",
    category: "Professional Services",
    year: "2026",
    summary:
      "An agency reselling Cinder to its own roster. They moved eleven clients onto the dashboard and reported AI visibility alongside their existing search work.",
    results: [
      { label: "Client accounts tracked", value: "11" },
      { label: "Reporting time saved", value: "6 hrs / month" },
      { label: "Retainers upsold", value: "4" },
    ],
    images: [
      {
        src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Agency team reviewing work together",
      },
      {
        src: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
        alt: "Analytics dashboard on a laptop",
      },
    ],
  },
];

function CaseStudyBody({ study }: { study: CaseStudy }) {
  return (
    <div>
      <p className="text-black/50 text-sm mb-4">
        {study.category} · {study.year}
      </p>

      <p className="text-black/70 text-base md:text-lg leading-relaxed max-w-xl mb-8">
        {study.summary}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {study.results.map((result) => (
          <div
            key={result.label}
            className="rounded-2xl border border-black/10 p-5"
          >
            <p className="text-black/50 text-xs uppercase tracking-wide mb-3">
              {result.label}
            </p>
            <p
              className="text-black text-3xl font-medium leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              {result.value}
            </p>
            {result.from && (
              <p className="text-black/40 text-sm mt-2">from {result.from}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {study.images.map((image) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            loading="lazy"
            className="h-32 md:h-52 w-full rounded-2xl object-cover"
          />
        ))}
      </div>
    </div>
  );
}

export default function CaseStudiesContent() {
  const entries: TimelineEntry[] = caseStudies.map((study) => ({
    title: study.name,
    subtitle: study.category,
    content: <CaseStudyBody study={study} />,
  }));

  return (
    <PageShell>
      <PageHeader
        eyebrow="Results"
        title="Case Studies"
        description={
          <>
            What a Cinder engagement looks like end to end: what we found, what
            we changed, and{" "}
            <span className="font-semibold text-xl md:text-2xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
              what moved as a result
            </span>
            .
          </>
        }
      />

      <Timeline data={entries} />
    </PageShell>
  );
}
