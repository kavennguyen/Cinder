"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

export default function RunPromptsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/run-prompts", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error ?? "Run failed.");
      } else if (data.message) {
        setResult(data.message);
      } else {
        setResult(
          `Ran ${data.ran} prompt${data.ran === 1 ? "" : "s"} — ${data.mentionsFound} brand mention${data.mentionsFound === 1 ? "" : "s"} found${data.errors ? ` (${data.errors} errored)` : ""}.`,
        );
        router.refresh();
      }
    } catch {
      setResult("Network error — is the dev server running?");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={run}
        disabled={loading}
        className="inline-flex items-center gap-2 bg-[#8A3220] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Play className="w-4 h-4" />
        {loading ? "Running… (can take a minute)" : "Run prompts now"}
      </button>
      {result && <p className="text-black/60 text-sm">{result}</p>}
    </div>
  );
}
