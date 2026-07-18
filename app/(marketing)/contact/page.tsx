import type { Metadata } from "next";

import ContactContent from "@/components/pages/ContactContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your brand and we'll get back to you within one business day. Cinder — AI visibility for Canadian brands and agencies.",
};

export default function ContactPage() {
  return <ContactContent />;
}
