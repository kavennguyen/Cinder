import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cinder — The AI Visibility Platform for Canada",
    template: "%s | Cinder",
  },
  description:
    "Cinder helps Canadian brands and agencies earn visibility inside ChatGPT, Perplexity, Gemini, and Copilot — turning AI answers into your next customer.",
  openGraph: {
    type: "website",
    siteName: "Cinder",
    title: "Cinder — The AI Visibility Platform for Canada",
    description:
      "Track and grow your brand's visibility across every major AI engine. Dashboard for agencies, done-for-you service for small business.",
    url: SITE_URL,
  },
  icons: { icon: "/images/cinder-logo.png" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cinder",
  url: SITE_URL,
  logo: `${SITE_URL}/images/cinder-logo.png`,
  description:
    "AI visibility (AEO) platform for Canadian brands and agencies. Tracks brand mentions and citations across ChatGPT, Perplexity, Gemini, and Copilot, and implements the website changes that improve them.",
  email: "hello@cinder.ca",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressCountry: "CA",
  },
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
        {children}
      </body>
    </html>
  );
}
