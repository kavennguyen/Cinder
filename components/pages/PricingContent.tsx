"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

import PageShell from "@/components/PageShell";
import { revealVariants } from "@/lib/motion";

const tiers = [
  {
    name: "Dashboard Starter",
    audience: "Self serve · for smaller teams",
    price: 800,
    yearlyPrice: 8640,
    billingMonthly: "Monthly, no lock in",
    billingYearly: "Billed annually, no lock in",
    popular: false,
    features: [
      "Track one client or brand",
      "Coverage across major AI engines",
      "Monthly visibility reports",
      "Email support",
    ],
  },
  {
    name: "Dashboard Pro",
    audience: "Self serve · for agencies",
    price: 1500,
    yearlyPrice: 16200,
    billingMonthly: "Monthly, no lock in",
    billingYearly: "Billed annually, no lock in",
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited clients and workspaces",
      "Competitor benchmarking",
      "White label reporting under your brand",
      "Priority support",
    ],
  },
  {
    name: "Managed Service",
    audience: "Done for you · for small business",
    price: 2000,
    yearlyPrice: 21600,
    billingMonthly: "Billed monthly",
    billingYearly: "Billed annually",
    popular: false,
    features: [
      "Cinder's team runs your optimization directly",
      "No dashboard or new discipline to learn",
      "Monthly strategy calls",
      "Continuous monitoring and adjustments",
    ],
  },
];

function PricingSwitch({
  isYearly,
  onToggle,
}: {
  isYearly: boolean;
  onToggle: (value: boolean) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-black/5 border border-black/10 p-1">
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          !isYearly ? "text-white" : "text-black/60 hover:text-black"
        }`}
      >
        {!isYearly && (
          <motion.span
            layoutId="pricing-switch"
            className="absolute inset-0 rounded-lg bg-black"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative">Monthly Billing</span>
      </button>
      <button
        type="button"
        onClick={() => onToggle(true)}
        className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isYearly ? "text-white" : "text-black/60 hover:text-black"
        }`}
      >
        {isYearly && (
          <motion.span
            layoutId="pricing-switch"
            className="absolute inset-0 rounded-lg bg-black"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative flex items-center gap-2">
          Annual Billing
          <span className="rounded-full bg-[#8A3220] px-2 py-0.5 text-xs font-medium text-white">
            Save 10%
          </span>
        </span>
      </button>
    </div>
  );
}

export default function PricingContent() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <PageShell>
      <article className="max-w-2xl mb-10">
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="text-black/60 text-sm mb-2"
        >
          Plans
        </motion.p>
        <motion.h1
          custom={1}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="text-black text-4xl md:text-6xl font-medium leading-tight mb-4"
          style={{ letterSpacing: "-0.03em" }}
        >
          One platform. Three ways in.
        </motion.h1>
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="text-black/70 text-lg md:text-xl leading-relaxed"
        >
          Transparent, monthly, and built to scale from the smallest agency to
          a fully managed client.
        </motion.p>
      </article>

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mb-10"
      >
        <PricingSwitch isYearly={isYearly} onToggle={setIsYearly} />
      </motion.div>

      <style>{`
        @keyframes pricing-card-shake {
          0%, 100% { transform: scale(1.05) rotate(0deg); }
          20% { transform: scale(1.05) rotate(-1.5deg); }
          40% { transform: scale(1.05) rotate(1.5deg); }
          60% { transform: scale(1.05) rotate(-1.5deg); }
          80% { transform: scale(1.05) rotate(1.5deg); }
        }
        .pricing-card {
          background-color: #8A3220;
          transition: background-color 0.2s ease;
        }
        .pricing-card:hover {
          background-color: #B8471F;
          animation: pricing-card-shake 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            custom={4 + index}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className={
              tier.popular
                ? "pricing-card relative rounded-2xl p-8 flex flex-col justify-between cursor-pointer ring-2 ring-white ring-offset-2 ring-offset-white"
                : "pricing-card relative rounded-2xl p-8 flex flex-col justify-between cursor-pointer"
            }
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="text-white text-lg font-medium mb-2">
                {tier.name}
              </h3>
              <p className="text-white/50 text-sm mb-6">{tier.audience}</p>

              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-white text-4xl font-semibold">
                  <AnimatePresence>
                    <motion.span
                      key={isYearly ? "yearly" : "monthly"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      ${(isYearly ? tier.yearlyPrice : tier.price).toLocaleString()}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-white/50 text-sm">
                  /{isYearly ? "yr" : "mo"}
                </span>
              </div>
              <p className="text-white/50 text-sm mb-6">
                {isYearly ? tier.billingYearly : tier.billingMonthly}
              </p>

              <div className="pt-6 border-t border-white/15">
                <h4 className="text-white/50 text-xs font-medium uppercase tracking-wide mb-4">
                  Features
                </h4>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-white/80 text-sm"
                    >
                      <span className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link
              href="/contact"
              className="bg-white text-black rounded-full px-6 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors duration-200 text-center"
            >
              Contact Us
            </Link>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
