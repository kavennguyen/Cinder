import type { Metadata } from "next";
import { PUBLIC_PLANS, dollars } from "@/lib/pricing";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cinder — The AI Visibility Platform for Canada",
    template: "%s | Cinder",
  },
  description:
    "Cinder helps Canadian businesses earn visibility inside ChatGPT, Perplexity and Gemini, turning AI answers into your next customer.",
  openGraph: {
    type: "website",
    siteName: "Cinder",
    title: "Cinder — The AI Visibility Platform for Canada",
    description:
      "Track and grow your brand's visibility across ChatGPT, Perplexity and Gemini. A done for you service for Canadian small businesses.",
    url: SITE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cinder",
  url: SITE_URL,
  logo: `${SITE_URL}/images/cinder-logo.png`,
  description:
    "Answer engine optimization (AEO) for Canadian businesses. Tracks brand mentions and citations across ChatGPT, Perplexity and Gemini, and implements the website changes that improve them.",
  email: "cinder@cindersource.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressCountry: "CA",
  },
};

/** Names the site itself, so engines can tie pages back to one entity. */
const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Cinder",
  url: SITE_URL,
  publisher: { "@type": "Organization", name: "Cinder" },
  inLanguage: "en-CA",
};

/**
 * Offers mirror the public pricing page exactly. If those numbers change,
 * change them here too or the structured data starts lying.
 */
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "AI visibility tracking and answer engine optimization",
  serviceType: "Answer Engine Optimization",
  provider: { "@type": "Organization", name: "Cinder", url: SITE_URL },
  areaServed: { "@type": "Country", name: "Canada" },
  description:
    "Tracks how often a brand is named by ChatGPT, Perplexity and Gemini, then implements the website changes that improve it.",
  // Derived from lib/pricing so the structured data cannot fall out of step
  // with the page. Only public plans are advertised.
  offers: PUBLIC_PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: String(dollars(plan.priceCents)),
    priceCurrency: "CAD",
    url: `${SITE_URL}/pricing`,
  })),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
