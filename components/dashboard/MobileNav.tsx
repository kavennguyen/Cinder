"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import DashboardNav from "./DashboardNav";
import { currentNavLabel } from "./nav-items";

/**
 * Below lg the rail collapses to a black top bar plus a slide-over drawer —
 * the marketing Navbar's pattern, mirrored to the left because that's the
 * edge the rail lives on.
 *
 * The panel stays mounted and slides with a CSS transition rather than with
 * motion/AnimatePresence. Two reasons: in this project AnimatePresence
 * finishes the exit animation but leaves the nodes in the DOM (the marketing
 * Navbar behaves the same way), which would leave an invisible full-screen
 * overlay swallowing every click after the drawer closed; and a CSS
 * transition is covered by the scoped prefers-reduced-motion rule in
 * globals.css for free.
 */
export default function MobileNav({
  showNav,
  orgSwitcher,
  signOut,
}: {
  showNav: boolean;
  orgSwitcher: ReactNode;
  signOut: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Escape closes and hands focus back to the trigger; body scroll locks.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-ink px-4 h-14">
        <Link
          href="/"
          className="flex items-center gap-2 focus-ring-rail rounded-full min-w-0"
        >
          <img
            src="/images/cinder-logo.png"
            alt="Cinder"
            className="w-7 h-7 rounded-full object-cover shrink-0"
          />
          <span className="font-display text-paper text-base">Cinder</span>
        </Link>
        <span className="font-ui text-on-rail-dim text-xs truncate">
          {currentNavLabel(pathname)}
        </span>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open dashboard menu"
          aria-expanded={open}
          className="text-paper p-1 focus-ring-rail rounded-full shrink-0"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 bg-ink/50 z-40 lg:hidden transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
        inert={!open}
        className={`fixed top-0 left-0 h-full w-72 max-w-[82vw] bg-ink z-50 lg:hidden flex flex-col p-6 outline-none overflow-y-auto transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            onClick={close}
            className="flex items-center gap-2 focus-ring-rail rounded-full"
          >
            <img
              src="/images/cinder-logo.png"
              alt="Cinder"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-display text-paper text-lg">Cinder</span>
          </Link>
          <button
            type="button"
            onClick={close}
            aria-label="Close dashboard menu"
            className="text-paper p-1 focus-ring-rail rounded-full"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {orgSwitcher && <div className="mb-6">{orgSwitcher}</div>}
        {showNav && <DashboardNav size="drawer" onNavigate={close} />}
        <div className="mt-auto pt-8">{signOut}</div>
      </div>
    </>
  );
}
