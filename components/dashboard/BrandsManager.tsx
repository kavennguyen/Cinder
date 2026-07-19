"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export interface Brand {
  id: string;
  name: string;
  aliases: string[];
  domains: string[];
  is_competitor: boolean;
}

const inputClass =
  "rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300";

export default function BrandsManager({
  orgId,
  initialBrands,
  competitorLimit,
}: {
  orgId: string;
  initialBrands: Brand[];
  competitorLimit: number | null;
}) {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [isCompetitor, setIsCompetitor] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const competitors = brands.filter((b) => b.is_competitor);
  const atLimit =
    competitorLimit !== null && competitors.length >= competitorLimit;

  const addBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return;
    if (isCompetitor && atLimit) {
      setError(`Your plan allows ${competitorLimit} competitors.`);
      return;
    }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("brands")
      .insert({
        org_id: orgId,
        name: name.trim(),
        domains: domain.trim() ? [domain.trim()] : [],
        is_competitor: isCompetitor,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setBrands((prev) => [...prev, data as Brand]);
      setName("");
      setDomain("");
      router.refresh();
    }
    setLoading(false);
  };

  const deleteBrand = async (id: string) => {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      router.refresh();
    }
  };

  const own = brands.filter((b) => !b.is_competitor);

  return (
    <div className="max-w-3xl">
      <form onSubmit={addBrand} className="mb-10">
        <label htmlFor="brand-name" className="block text-black/70 text-sm font-medium mb-2">
          Add a brand
        </label>
        <div className="flex gap-2 flex-wrap">
          <input
            id="brand-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Brand name"
            className={`flex-1 min-w-40 ${inputClass}`}
          />
          <input
            id="brand-domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="domain.com (optional)"
            className={`flex-1 min-w-40 ${inputClass}`}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#8A3220] transition-colors duration-200 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <label className="inline-flex items-center gap-2 mt-3 text-sm text-black/70 cursor-pointer">
          <input
            type="checkbox"
            checked={isCompetitor}
            onChange={(e) => setIsCompetitor(e.target.checked)}
            className="accent-[#8A3220]"
          />
          This is a competitor
        </label>
        {error && <p className="text-[#8A3220] text-sm mt-3">{error}</p>}
      </form>

      <div className="mb-10">
        <h2 className="text-black text-lg font-medium mb-4">Your brand</h2>
        {own.length === 0 ? (
          <p className="text-black/50 text-sm">
            No brand set — add one and untick &ldquo;competitor&rdquo;.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {own.map((b) => (
              <BrandRow key={b.id} brand={b} onDelete={deleteBrand} />
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-black text-lg font-medium">Competitors</h2>
        <span className="text-black/50 text-sm">
          {competitors.length}
          {competitorLimit !== null ? ` / ${competitorLimit}` : ""}
        </span>
      </div>
      {competitors.length === 0 ? (
        <p className="text-black/50 text-sm">
          No competitors yet. Add the brands you&apos;re competing with for AI
          visibility — share of voice is measured against them.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {competitors.map((b) => (
            <BrandRow key={b.id} brand={b} onDelete={deleteBrand} />
          ))}
        </ul>
      )}
    </div>
  );
}

function BrandRow({
  brand,
  onDelete,
}: {
  brand: Brand;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="rounded-2xl border border-black/10 px-5 py-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-black text-sm font-medium">{brand.name}</p>
        {brand.domains.length > 0 && (
          <p className="text-black/50 text-xs mt-0.5">
            {brand.domains.join(", ")}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(brand.id)}
        aria-label={`Delete brand: ${brand.name}`}
        className="shrink-0 text-black/40 hover:text-[#8A3220] transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </li>
  );
}
