"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { revealVariants } from "@/lib/motion";

const faqs = [
  {
    question: "What is AI visibility, and why does it matter?",
    answer:
      "AI visibility (also called AEO, or answer engine optimization) is how often, and how accurately, your brand gets mentioned when people ask ChatGPT, Perplexity, Gemini, or Copilot a question. As more people start their search inside an AI answer instead of a search engine, being the name AI recommends is becoming as important as ranking on Google once was.",
  },
  {
    question: "How is this different from traditional SEO?",
    answer:
      "SEO optimizes for ranking in a list of links. AEO optimizes for being cited directly inside a generated answer, often as the only brand mentioned. The signals overlap, but AI engines weigh things like structured data, source credibility, and freshness differently than search engines do, which is what Cinder tracks and improves.",
  },
  {
    question: "Which AI engines does Cinder track?",
    answer:
      "Cinder tracks citations and mentions across ChatGPT, Perplexity, Gemini, and Copilot, with coverage expanding as new AI engines gain adoption.",
  },
  {
    question:
      "What's the difference between the Dashboard and the Managed Service?",
    answer:
      "The Dashboard is self serve: built for agencies and teams who want to track visibility themselves, benchmark competitors, and manage multiple clients or brands in one place. The Managed Service is done for you: our team runs the optimization directly on your behalf, so you don't need to learn a new discipline or hire for it.",
  },
  {
    question: "How much does Cinder cost?",
    answer:
      "Plans start at $800/month for Dashboard Starter, $1,500/month for Dashboard Pro, and $2,000/month for the fully Managed Service, with a 10% discount on annual billing. See the Pricing page for full plan details.",
  },
  {
    question: "Is there a contract or lock-in period?",
    answer:
      "No. Dashboard plans are billed monthly with no lock in. The Managed Service is billed as an ongoing monthly retainer rather than a fixed-term contract.",
  },
  {
    question: "How long until I see results?",
    answer:
      "AI engines update their sources continuously, so early movement in citations can show up within the first few weeks. Building durable, default-answer visibility in your category is a longer game, typically a few months of consistent optimization.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We only track public information about your brand's visibility across AI engines, we don't require access to internal systems, and we never share client data across accounts.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-black/10 py-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-lg font-medium text-black">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-black/40 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl text-base leading-relaxed text-black/60">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Support"
        title="Frequently Asked Questions"
        description="Answers to the questions we hear most about AI visibility, pricing, and how Cinder works."
      />

      <motion.div custom={2} initial="hidden" animate="visible" variants={revealVariants}>
        {faqs.map((faq, index) => (
          <FaqItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </motion.div>
    </PageShell>
  );
}
