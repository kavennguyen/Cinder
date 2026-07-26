"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return <>{children}</>;
}
