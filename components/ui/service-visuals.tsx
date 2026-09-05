/**
 * Drawn illustrations for the services carousel cards.
 *
 * Same idiom as the homepage bento visuals: flat, hairline-bordered rows on
 * white, orange only where it carries meaning. Kept structural rather than
 * numeric on purpose — a card visual that shows a specific score reads as a
 * measured result, and none of these are.
 */

const ROW = "rounded-lg border border-black/10 bg-white/70 px-3 py-2.5";

/* ------------------------------------------------------- small business */

/** Work items, all closed out by Cinder rather than by the client. */
export function HandledVisual() {
  const jobs = ["Answer pages written", "Schema shipped", "Citations checked"];
  return (
    <div className="flex flex-col gap-2">
      {jobs.map((job) => (
        <div key={job} className={`${ROW} flex flex-wrap items-center gap-x-3 gap-y-1`}>
          <span
            aria-hidden="true"
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FF6E00] text-[9px] leading-none text-white"
          >
            ✓
          </span>
          <span className="text-sm text-black/70">{job}</span>
          <span className="ml-auto shrink-0 text-[10px] uppercase tracking-[0.1em] text-black/35">
            Cinder
          </span>
        </div>
      ))}
    </div>
  );
}

/** The dashboard, greyed out, because this track never opens it. */
export function NoLoginVisual() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-black/10 bg-white/70 p-4">
      <div className="flex flex-col gap-2 opacity-30" aria-hidden="true">
        <span className="block h-2 w-1/3 rounded-full bg-black/25" />
        <div className="flex gap-2">
          <span className="block h-10 grow rounded-md bg-black/10" />
          <span className="block h-10 grow rounded-md bg-black/10" />
        </div>
        <span className="block h-2 w-2/3 rounded-full bg-black/20" />
      </div>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="rounded-full border border-[#FF6E00]/30 bg-white px-3 py-1 text-xs font-medium text-[#FF6E00]">
          No login needed
        </span>
      </span>
    </div>
  );
}

/** A standing monthly slot rather than a one-off kickoff. */
export function CallsVisual() {
  return (
    <div className="flex flex-col gap-2">
      {["Month 1", "Month 2", "Month 3"].map((m) => (
        <div key={m} className={`${ROW} flex items-center gap-3`}>
          <span className="text-xs text-black/45">{m}</span>
          <span className="text-sm text-black/70">Strategy call</span>
          <span
            aria-hidden="true"
            className="ml-auto h-2 w-2 shrink-0 rounded-full bg-[#FF6E00]"
          />
        </div>
      ))}
    </div>
  );
}

/** Work continuing after the first fixes ship. */
export function OngoingVisual() {
  const steps = [
    "First fixes ship",
    "Engines re-checked",
    "Pages adjusted",
    "…and again",
  ];
  return (
    <ol className="relative flex flex-col gap-3 pl-4">
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-1 bottom-1 w-px bg-[#FF6E00]/25"
      />
      {steps.map((s, i) => (
        <li key={s} className="relative flex items-center gap-3">
          <span
            aria-hidden="true"
            className={`absolute -left-4 h-[7px] w-[7px] rounded-full ${
              i === steps.length - 1 ? "bg-[#FF6E00]/40" : "bg-[#FF6E00]"
            }`}
          />
          <span className="text-sm text-black/70">{s}</span>
        </li>
      ))}
    </ol>
  );
}
