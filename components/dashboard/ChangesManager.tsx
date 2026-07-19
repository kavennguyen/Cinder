"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export interface ChangeEntry {
  id: string;
  changed_at: string;
  change_type: string;
  title: string;
  description: string | null;
  urls: string[];
}

const CHANGE_TYPES = [
  { id: "schema_markup", label: "Schema markup" },
  { id: "content", label: "Content" },
  { id: "metadata", label: "Metadata" },
  { id: "technical", label: "Technical" },
  { id: "other", label: "Other" },
];

const inputClass =
  "w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300";

export default function ChangesManager({
  orgId,
  initialChanges,
  canWrite,
}: {
  orgId: string;
  initialChanges: ChangeEntry[];
  canWrite: boolean;
}) {
  const router = useRouter();
  const [changes, setChanges] = useState<ChangeEntry[]>(initialChanges);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("content");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("changes")
      .insert({
        org_id: orgId,
        title: title.trim(),
        change_type: type,
        description: description.trim() || null,
        urls: url.trim() ? [url.trim()] : [],
      })
      .select()
      .single();

    if (error) {
      setError(
        error.message.includes("row-level security")
          ? "Only Cinder team accounts (admin role) can log changes."
          : error.message,
      );
    } else if (data) {
      setChanges((prev) => [data as ChangeEntry, ...prev]);
      setTitle("");
      setDescription("");
      setUrl("");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl">
      {canWrite ? (
        <form onSubmit={addChange} className="mb-10 flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What changed? e.g. Added FAQPage schema to /pricing"
              className={`flex-1 min-w-60 ${inputClass}`}
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black outline-none focus:border-black/40 transition-colors duration-300"
            >
              {CHANGE_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Affected URL (optional)"
            className={inputClass}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Details (optional)"
            className="w-full rounded-2xl border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300 resize-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#8A3220] transition-colors duration-200 disabled:opacity-50 w-fit"
          >
            <Plus className="w-4 h-4" />
            Log change
          </button>
          {error && <p className="text-[#8A3220] text-sm">{error}</p>}
        </form>
      ) : (
        <p className="rounded-2xl border border-black/10 p-5 text-black/50 text-sm leading-relaxed mb-10">
          Changes are logged by the Cinder team as they optimize your site —
          each one appears here and on your visibility timeline, so you can
          see exactly what was done and what happened after.
        </p>
      )}

      <h2 className="text-black text-lg font-medium mb-4">Change history</h2>
      {changes.length === 0 ? (
        <p className="text-black/50 text-sm">No changes logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {changes.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-black/10 px-5 py-4"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-black text-sm font-medium">{c.title}</p>
                <p className="text-black/40 text-xs">
                  {c.changed_at.slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-black/5 text-black/60">
                  {CHANGE_TYPES.find((t) => t.id === c.change_type)?.label ??
                    c.change_type}
                </span>
                {c.urls.map((u) => (
                  <span key={u} className="text-black/50 text-xs">
                    {u}
                  </span>
                ))}
              </div>
              {c.description && (
                <p className="text-black/60 text-sm mt-2 leading-relaxed">
                  {c.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
