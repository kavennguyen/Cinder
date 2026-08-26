"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import Badge from "@/components/dashboard/ui/Badge";
import { Button } from "@/components/dashboard/ui/Button";
import EmptyState from "@/components/dashboard/ui/EmptyState";
import SectionHeader from "@/components/dashboard/ui/SectionHeader";
import {
  inputClass,
  noticeClass,
  selectClass,
  textareaClass,
} from "@/components/dashboard/ui/Field";

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
              aria-label="What changed"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What changed? e.g. Added FAQPage schema to /pricing"
              className={`flex-1 min-w-60 ${inputClass}`}
            />
            <select
              value={type}
              aria-label="Change type"
              onChange={(e) => setType(e.target.value)}
              className={selectClass}
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
            aria-label="Affected URL"
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Affected URL (optional)"
            className={inputClass}
          />
          <textarea
            value={description}
            aria-label="Details"
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Details (optional)"
            className={textareaClass}
          />
          <Button type="submit" disabled={loading} className="w-fit">
            <Plus className="w-4 h-4" aria-hidden="true" />
            Log change
          </Button>
          {error && <p className={noticeClass}>{error}</p>}
        </form>
      ) : (
        <div className="mb-10">
          <EmptyState title="The Cinder team logs changes here">
            Each optimization made to your site appears in this timeline, so you
            can see exactly what was done and what happened after.
          </EmptyState>
        </div>
      )}

      <SectionHeader title="Change history" className="mb-4" />
      {changes.length === 0 ? (
        <EmptyState title="No changes logged yet">
          Once changes are logged they line up against your visibility trend —
          the &ldquo;what we did&rdquo; behind every move.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-2">
          {changes.map((c) => (
            <li
              key={c.id}
              className="rounded-2xl border border-rule bg-paper px-5 py-4"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-ink text-sm font-medium">{c.title}</p>
                <p className="text-ink-45 text-xs tabular-nums">
                  {c.changed_at.slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <Badge tone="muted">
                  {CHANGE_TYPES.find((t) => t.id === c.change_type)?.label ??
                    c.change_type}
                </Badge>
                {c.urls.map((u) => (
                  <span key={u} className="text-ink-45 text-xs truncate max-w-full">
                    {u}
                  </span>
                ))}
              </div>
              {c.description && (
                <p className="text-ink-55 text-sm mt-2 leading-relaxed">
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
