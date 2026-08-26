"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import PageHeading from "@/components/dashboard/PageHeading";
import {
  inputClass,
  labelClass,
  noticeClass,
} from "@/components/dashboard/ui/Field";

export default function OnboardingForm() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [domain, setDomain] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.rpc("create_organization", {
      org_name: orgName.trim(),
      brand_name: (brandName || orgName).trim(),
      brand_domains: domain.trim() ? [domain.trim()] : [],
      competitor_names: competitors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // Land new orgs on the prompt picker with suggestions pre-opened —
    // the empty dashboard is where non-technical users stall.
    router.push("/dashboard/prompts?suggest=1");
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl"
    >
      <PageHeading
        eyebrow="Welcome to Cinder"
        title="Set up your organization."
        size="lg"
      >
        Tell us whose AI visibility we&apos;re tracking. You can add more brands
        and competitors later.
      </PageHeading>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="ob-org" className={labelClass}>
            Company / organization name
          </label>
          <input
            id="ob-org"
            type="text"
            required
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Maple & Co."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-brand" className={labelClass}>
            Brand name to track{" "}
            <span className="text-ink-45 font-normal">(defaults to company name)</span>
          </label>
          <input
            id="ob-brand"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Maple & Co."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-domain" className={labelClass}>
            Website domain <span className="text-ink-45 font-normal">(for citation matching)</span>
          </label>
          <input
            id="ob-domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="mapleandco.ca"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-competitors" className={labelClass}>
            Competitors <span className="text-ink-45 font-normal">(comma-separated)</span>
          </label>
          <input
            id="ob-competitors"
            type="text"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="Competitor A, Competitor B"
            className={inputClass}
          />
        </div>

        {error && <p className={`${noticeClass} leading-relaxed`}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 bg-ink text-paper text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-ember transition-colors duration-200 w-fit mt-2 disabled:opacity-60 focus-ring"
        >
          {loading ? "Creating…" : "Create Organization"}
          <span className="bg-paper rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-ink" aria-hidden="true" />
          </span>
        </button>
      </form>
    </motion.div>
  );
}
