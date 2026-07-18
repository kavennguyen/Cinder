import type { Metadata } from "next";

import AboutContent from "@/components/pages/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "The front door of the internet is changing. Cinder exists to make sure your name is the one it gives. Built in Toronto, for Canada.",
};

export default function AboutPage() {
  return <AboutContent />;
}
