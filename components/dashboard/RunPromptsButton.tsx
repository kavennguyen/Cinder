"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";

import { Button } from "@/components/dashboard/ui/Button";

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
        const skipped =
          Array.isArray(data.skippedEngines) && data.skippedEngines.length > 0
            ? ` No API key for ${data.skippedEngines.join(", ")} — those were skipped.`
            : "";
        setResult(
          `Ran ${data.ran} engine run${data.ran === 1 ? "" : "s"} — ${data.mentionsFound} brand mention${data.mentionsFound === 1 ? "" : "s"} found${data.errors ? ` (${data.errors} errored)` : ""}.${skipped}`,
        );
        router.refresh();
      }
    } catch {
      setResult("Network error — is the dev server running?");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Button onClick={run} disabled={loading} variant="accent">
        <Play className="w-4 h-4" aria-hidden="true" />
        {loading ? "Running… (up to a minute)" : "Run prompts now"}
      </Button>
      {result && (
        <p className="text-ink-55 text-sm max-w-xs leading-relaxed" role="status">
          {result}
        </p>
      )}
    </div>
  );
}
