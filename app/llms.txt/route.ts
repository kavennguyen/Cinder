const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * llms.txt — a plain-markdown overview for language models, per llmstxt.org.
 *
 * No major engine has confirmed consuming this yet. It is served because the
 * cost is near zero and an AEO vendor gets inspected for exactly this by its
 * own buyers. Keep it factual: only the three engines that actually run.
 */
const body = `# Cinder

> Answer engine optimization (AEO) for Canadian brands and agencies. Cinder
> measures how often ChatGPT, Perplexity and Gemini name your brand, then
> implements the website changes that improve it.

Cinder is based in Toronto, Canada, and serves Canadian brands and the
agencies working with them.

## What Cinder does

- Tracks a set of real customer questions across AI answer engines.
- Reports share of AI voice, citations and average citation position.
- Implements the content and structured-data changes that improve them, and
  logs every change with the pages it touched.

## Engines covered

- ChatGPT (live)
- Perplexity (live)
- Gemini (live)
- Claude and Copilot are not yet supported.

## Two ways to work with Cinder

- **Dashboard** — self serve, built for agencies tracking multiple clients.
- **Managed service** — Cinder's team runs the optimization for you.

## Pricing (CAD, per month)

- Dashboard Starter: $800
- Dashboard Pro: $1,500
- Managed Service: $2,000
- 10% discount on annual billing. No lock-in on dashboard plans.

## Pages

- [Home](${SITE_URL}/): what Cinder is and how it works.
- [Services](${SITE_URL}/services): the dashboard and the managed service.
- [Pricing](${SITE_URL}/pricing): all plans and what each includes.
- [Case studies](${SITE_URL}/case-studies): illustrative engagements.
- [About](${SITE_URL}/about): who Cinder is and why it exists.
- [FAQ](${SITE_URL}/faq): common questions about AI visibility and AEO.
- [Contact](${SITE_URL}/contact): get in touch.

## Contact

- Email: cinder@cindersource.com
- Location: Toronto, Canada
`;

export function GET() {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
