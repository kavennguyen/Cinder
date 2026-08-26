"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/dashboard/ui/Button";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import SectionHeader from "@/components/dashboard/ui/SectionHeader";
import {
  inputClass,
  labelClass,
  noticeClass,
} from "@/components/dashboard/ui/Field";

export interface Brand {
  id: string;
  name: string;
  aliases: string[];
  domains: string[];
  is_competitor: boolean;
}

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
        <label htmlFor="brand-name" className={labelClass}>
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
          <Button type="submit" disabled={loading}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Add
          </Button>
        </div>
        <label className="inline-flex items-center gap-2 mt-3 text-sm text-ink-70 cursor-pointer">
          <input
            type="checkbox"
            checked={isCompetitor}
            onChange={(e) => setIsCompetitor(e.target.checked)}
            className="accent-ember focus-ring rounded-sm"
          />
          This is a competitor
        </label>
        {error && <p className={`${noticeClass} mt-3`}>{error}</p>}
      </form>

      <div className="mb-10">
        <SectionHeader title="Your brand" className="mb-4" />
        {own.length === 0 ? (
          <EmptyState title="No brand set yet">
            Add your own brand above and untick &ldquo;competitor&rdquo; — it&apos;s
            the brand your visibility score is measured on.
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-2">
            {own.map((b) => (
              <BrandRow key={b.id} brand={b} onDelete={deleteBrand} />
            ))}
          </ul>
        )}
      </div>

      <SectionHeader
        title="Competitors"
        className="mb-4"
        right={
          <span className="text-ink-45 text-sm tabular-nums">
            {competitors.length}
            {competitorLimit !== null ? ` / ${competitorLimit}` : ""}
          </span>
        }
      />
      {competitors.length === 0 ? (
        <EmptyState title="No competitors yet">
          Add the brands you&apos;re up against for AI visibility — share of
          voice is measured against them.
        </EmptyState>
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
    <li className="rounded-2xl border border-rule bg-paper px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-ink text-sm font-medium truncate">{brand.name}</p>
        {brand.domains.length > 0 && (
          <p className="text-ink-45 text-xs mt-0.5 truncate">
            {brand.domains.join(", ")}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(brand.id)}
        aria-label={`Delete brand: ${brand.name}`}
        className="shrink-0 text-ink-45 hover:text-ember transition-colors duration-200 focus-ring rounded-full p-1"
      >
        <Trash2 className="w-4 h-4" aria-hidden="true" />
      </button>
    </li>
  );
}
