/**
 * Drawn illustrations for the services carousel cards.
 *
 * Same idiom as the homepage bento visuals: flat, hairline-bordered rows on
 * white, orange only where it carries meaning. Kept structural rather than
 * numeric on purpose — a card visual that shows a specific score reads as a
 * measured result, and none of these are.
 */

const ROW = "rounded-lg border border-black/10 bg-white/70 px-3 py-2.5";

/* ------------------------------------------------------------- agencies */

/** A client roster, standing in for the dashboard's workspace switcher. */
export function RosterVisual() {
  const clients = ["Northwind Dental", "Bayview Legal", "Harbour Realty"];
  return (
    <div className="flex flex-col gap-2">
      {clients.map((name) => (
        <div key={name} className={`${ROW} flex flex-wrap items-center gap-x-3 gap-y-1`}>
          <span
            aria-hidden="true"
            className="h-6 w-6 shrink-0 rounded-full bg-[#FF6E00]/15"
          />
          <span className="text-sm text-black/70">{name}</span>
          <span
            aria-hidden="true"
            className="ml-auto h-1.5 w-10 shrink-0 rounded-full bg-[#FF6E00]/35"
          />
        </div>
      ))}
      <p className="mt-1 text-xs text-black/35">Example workspaces.</p>
    </div>
  );
}

/** Relative share of voice. Bar widths only — no axis, no figures. */
export function ShareOfVoiceVisual() {
  const bars = [
    { label: "You", width: "72%", mine: true },
    { label: "Competitor A", width: "48%", mine: false },
    { label: "Competitor B", width: "31%", mine: false },
  ];
  return (
    <div className="flex flex-col gap-3">
      {bars.map((b) => (
        <div key={b.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs text-black/50">
            {b.label}
          </span>
          <span className="h-2 grow overflow-hidden rounded-full bg-black/[0.06]">
            <span
              className={`block h-full rounded-full ${
                b.mine ? "bg-[#FF6E00]" : "bg-black/20"
              }`}
              style={{ width: b.width }}
            />
          </span>
        </div>
      ))}
      <p className="text-xs text-black/35">
        Illustration of the comparison, not measured data.
      </p>
    </div>
  );
}

/** A report with the agency's own mark on it, not Cinder's. */
export function WhiteLabelVisual() {
  return (
    <div className="rounded-xl border border-black/10 bg-white/70 p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-black/[0.07] pb-3">
        <span
          aria-hidden="true"
          className="flex h-6 w-6 items-center justify-center rounded-md border border-dashed border-[#FF6E00]/50 text-[8px] text-[#FF6E00]"
        >
          ▢
        </span>
        <span className="text-xs text-black/50">Your logo</span>
      </div>
      <div className="flex flex-col gap-2" aria-hidden="true">
        <span className="block h-1.5 w-full rounded-full bg-black/10" />
        <span className="block h-1.5 w-4/5 rounded-full bg-black/10" />
        <span className="block h-1.5 w-2/3 rounded-full bg-black/10" />
      </div>
    </div>
  );
}

/** Ranked gaps, so the work is ordered rather than listed. */
export function PriorityVisual() {
  const actions = [
    { rank: "1", text: "Add FAQ schema", weight: "High" },
    { rank: "2", text: "Rewrite service pages", weight: "High" },
    { rank: "3", text: "Fix location markup", weight: "Medium" },
  ];
  return (
    <div className="flex flex-col gap-2">
      {actions.map((a) => (
        <div key={a.rank} className={`${ROW} flex flex-wrap items-center gap-x-3 gap-y-1`}>
          <span className="text-xs font-semibold text-[#FF6E00]">{a.rank}</span>
          <span className="text-sm text-black/70">{a.text}</span>
          <span
            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              a.weight === "High"
                ? "bg-[#FF6E00]/12 text-[#FF6E00]"
                : "bg-black/[0.06] text-black/45"
            }`}
          >
            {a.weight}
          </span>
        </div>
      ))}
    </div>
  );
}

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
