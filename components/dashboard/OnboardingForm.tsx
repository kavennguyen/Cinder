"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300";

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
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl"
    >
      <p className="text-black/60 text-sm mb-2">Welcome to Cinder</p>
      <h1
        className="text-black text-3xl md:text-5xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        Set up your organization.
      </h1>
      <p className="text-black/60 text-base leading-relaxed mb-10">
        Tell us whose AI visibility we&apos;re tracking. You can add more
        brands and competitors later.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="ob-org" className="block text-black/70 text-sm font-medium mb-2">
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
          <label htmlFor="ob-brand" className="block text-black/70 text-sm font-medium mb-2">
            Brand name to track{" "}
            <span className="text-black/40">(defaults to company name)</span>
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
          <label htmlFor="ob-domain" className="block text-black/70 text-sm font-medium mb-2">
            Website domain <span className="text-black/40">(for citation matching)</span>
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
          <label htmlFor="ob-competitors" className="block text-black/70 text-sm font-medium mb-2">
            Competitors <span className="text-black/40">(comma-separated)</span>
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

        {error && (
          <p className="text-[#8A3220] text-sm leading-relaxed">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#8A3220] transition-colors duration-200 w-fit mt-2 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Organization"}
          <span className="bg-white rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-black" />
          </span>
        </button>
      </form>
    </motion.div>
  );
}
