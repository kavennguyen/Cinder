/**
 * Single source of truth for plans and prices.
 *
 * ┌─ CHANGING A PRICE ────────────────────────────────────────────────────┐
 * │ Edit the four constants immediately below. Nothing else needs to be   │
 * │ touched — every surface that displays a price imports from this file. │
 * │                                                                       │
 * │ One edit here updates, in the same deploy:                            │
 * │   • /pricing            cards, onboarding line, comparison table      │
 * │   • app/layout.tsx      the schema.org Offer entries in the JSON-LD   │
 * │   • app/llms.txt        the pricing block served to language models   │
 * │                                                                       │
 * │ FaqContent.tsx deliberately states no figure, so it never goes stale. │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Values are in CENTS, to match the `plans.price` column in Supabase.
 * All prices are CAD, monthly, plus HST. There is no annual option until
 * Stripe exists, so no annual figure is stored.
 *
 * Worth knowing while prices are still provisional: /pricing is crawled, and
 * the JSON-LD Offers are structured data. A published price gets indexed, and
 * an answer engine may keep quoting it for a while after it changes here.
 *
 * Before this file existed the prices were written out separately in the
 * pricing page, the JSON-LD, llms.txt and the FAQ — four places with nothing
 * linking them, so a change silently left three of them stale.
 */

/* ---------------------------------------------------------------- prices */

/** $2,000/mo. Public, hero tier. */
export const MANAGED_PRICE_CENTS = 200_000;

/** $2,750/mo. Public. */
export const MANAGED_PLUS_PRICE_CENTS = 275_000;

/** $750, one-time. Charged before month one, not credited against it. */
export const ONBOARDING_FEE_CENTS = 75_000;

/** $129/mo. Not listed publicly — invitation and downgrade path only. */
export const MONITOR_PRICE_CENTS = 12_900;

export interface Plan {
  id: string;
  name: string;
  /** CAD cents, matching the `plans` table. */
  priceCents: number;
  /** Shown on the public pricing page. `monitor` is deliberately not. */
  isPublic: boolean;
  audience: string;
  promptLimit: number;
  competitorLimit: number;
  platforms: string[];
  cadence: "daily" | "3x_week";
  features: string[];
  /** Stated plainly on the card so the boundary of the plan is visible. */
  notIncluded: string;
}

export const PLANS: Plan[] = [
  {
    id: "managed",
    name: "Managed",
    priceCents: MANAGED_PRICE_CENTS,
    isPublic: true,
    audience: "For a single-location business that wants the work done for them.",
    promptLimit: 50,
    competitorLimit: 10,
    platforms: ["chatgpt", "perplexity", "gemini"],
    cadence: "daily",
    features: [
      "50 tracked prompts across ChatGPT, Perplexity and Gemini",
      "Up to 10 competitors benchmarked",
      "Up to 6 site changes written, shipped and logged each month",
      "Sources report — which pages the engines actually cite",
      "One strategy call a month",
      "Monthly PDF report",
      "Dashboard access to see every run behind the numbers",
    ],
    notIncluded: "Google AI Overviews, Claude and Copilot are not yet measured.",
  },
  {
    id: "managed_plus",
    name: "Managed Plus",
    priceCents: MANAGED_PLUS_PRICE_CENTS,
    isPublic: true,
    audience: "For multi-location businesses, or a category with heavy competition.",
    promptLimit: 100,
    competitorLimit: 15,
    platforms: ["chatgpt", "perplexity", "gemini"],
    cadence: "daily",
    features: [
      "100 tracked prompts, including per-location prompt sets",
      "Up to 15 competitors benchmarked",
      "Up to 12 site changes written, shipped and logged each month",
      "Sources report — which pages the engines actually cite",
      "Two strategy calls a month",
      "Quarterly content plan",
      "Monthly PDF report and dashboard access",
    ],
    notIncluded: "Google AI Overviews, Claude and Copilot are not yet measured.",
  },
  {
    // Not listed publicly. Offered by invitation, or as a downgrade path for a
    // managed client who wants to keep monitoring after the work stops.
    id: "monitor",
    name: "Monitor",
    priceCents: MONITOR_PRICE_CENTS,
    isPublic: false,
    audience: "Monitoring only, by invitation.",
    promptLimit: 30,
    competitorLimit: 5,
    platforms: ["chatgpt", "perplexity", "gemini"],
    cadence: "3x_week",
    features: [
      "30 tracked prompts, run three times a week",
      "Up to 5 competitors benchmarked",
      "Weekly digest",
    ],
    notIncluded: "No changes written or shipped. Measurement only.",
  },
];

export const PUBLIC_PLANS = PLANS.filter((p) => p.isPublic);

/** Whole dollars, no cents — every price here is a round number. */
export const dollars = (cents: number) => Math.round(cents / 100);

export const formatCAD = (cents: number) =>
  `$${dollars(cents).toLocaleString("en-CA")}`;

/** Engines the runner actually calls today. Used for copy and comparisons. */
export const LIVE_ENGINES = ["ChatGPT", "Perplexity", "Gemini"] as const;

/** Named so the site can say "planned" rather than imply it ships today. */
export const PLANNED_ENGINES = [
  { name: "Google AI Overviews", eta: "Q4 2026" },
  { name: "Claude", eta: "2027" },
  { name: "Copilot", eta: "2027" },
] as const;
