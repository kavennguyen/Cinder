/**
 * Rolling-average maths for the visibility trend.
 *
 * Two things matter here. First, `getVisibilityHistory` only returns days
 * that actually had runs, so every window is computed over CALENDAR dates,
 * never over array indices — a three-day gap must stay a three-day gap.
 * Second, the average is run-weighted: a day with one run is weaker evidence
 * than a day with twelve, and averaging the daily percentages equally would
 * hide that. This is the honest answer to the single-sample noise problem.
 */

export interface DayPoint {
  date: string; // YYYY-MM-DD
  score: number; // 0–100
  runs: number;
}

const MS_PER_DAY = 86_400_000;

/** Days since epoch, UTC — comparison without timezone drift. */
export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

export function dayToIso(day: number): string {
  return new Date(day * MS_PER_DAY).toISOString().slice(0, 10);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function fmtDate(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
}

function weightedScore(points: DayPoint[]): { score: number; runs: number } | null {
  let runs = 0;
  let mentioned = 0;
  for (const p of points) {
    runs += p.runs;
    mentioned += (p.score / 100) * p.runs;
  }
  if (runs === 0) return null;
  return { score: Math.round((mentioned / runs) * 100), runs };
}

export interface RollingPoint extends DayPoint {
  day: number;
  /** Run-weighted average over the trailing `windowDays` calendar days. */
  avg: number;
  /** How many days of data actually fell inside that window. */
  windowDays: number;
  windowRuns: number;
}

export function withRollingAverage(
  points: DayPoint[],
  windowDays = 7,
): RollingPoint[] {
  const withDays = points.map((p) => ({ ...p, day: dayNumber(p.date) }));
  return withDays.map((p) => {
    const inWindow = withDays.filter(
      (q) => q.day <= p.day && q.day > p.day - windowDays,
    );
    const w = weightedScore(inWindow) ?? { score: p.score, runs: p.runs };
    return {
      ...p,
      avg: w.score,
      windowDays: inWindow.length,
      windowRuns: w.runs,
    };
  });
}

export interface WeekDelta {
  current: number;
  previous: number;
  delta: number;
  currentRuns: number;
  previousRuns: number;
}

/**
 * This week's run-weighted average vs the week before it. Comparing two
 * weekly means rather than yesterday-vs-today is the point: a single daily
 * sample per prompt × engine moves mostly on sampling variance.
 */
export function weekOverWeekDelta(
  points: DayPoint[],
  windowDays = 7,
): WeekDelta | null {
  if (points.length === 0) return null;
  const withDays = points.map((p) => ({ ...p, day: dayNumber(p.date) }));
  const latest = Math.max(...withDays.map((p) => p.day));

  const current = weightedScore(
    withDays.filter((p) => p.day <= latest && p.day > latest - windowDays),
  );
  const previous = weightedScore(
    withDays.filter(
      (p) => p.day <= latest - windowDays && p.day > latest - windowDays * 2,
    ),
  );
  if (!current || !previous) return null;

  return {
    current: current.score,
    previous: previous.score,
    delta: current.score - previous.score,
    currentRuns: current.runs,
    previousRuns: previous.runs,
  };
}

/** Inclusive calendar span covered by the history, in days. */
export function historySpanDays(points: DayPoint[]): number {
  if (points.length === 0) return 0;
  const days = points.map((p) => dayNumber(p.date));
  return Math.max(...days) - Math.min(...days) + 1;
}

export const METHOD_SCORE =
  "The share of the latest run for each prompt × engine that named your brand. " +
  "Measured daily from a clean, consistent context — not a replica of any one " +
  "person's chat.";

export const METHOD_TREND =
  "Each day's score is the share of that day's successful runs that named your " +
  "brand. The headline line is a 7-day run-weighted average, because a single " +
  "day's sample moves mostly on chance.";

export const METHOD_SOV =
  "Across every successful run in the last 30 days, the share that named each " +
  "brand. Brands can appear in the same answer, so these don't add up to 100%.";
