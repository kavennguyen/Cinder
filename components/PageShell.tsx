import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageShellProps {
  children: ReactNode;
}

export default function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen bg-white selection:bg-[#FF6E00] selection:text-white">
      <Navbar />
      <main className="pt-40 px-6 pb-24">
        <div className="max-w-[88rem] mx-auto">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
