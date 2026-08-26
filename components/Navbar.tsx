"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  /**
   * Treat nested routes as part of their section (e.g. /services/foo still
   * highlights Services), while keeping "/" from matching everything.
   */
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-30 px-6 py-6 w-full"
      >
        <div className="bg-black rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/images/cinder-logo.png"
                alt="Cinder logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white font-semibold text-lg">Cinder</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm">
              {navLinks.map((link) => {
                const current = isCurrent(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={current ? "page" : undefined}
                    className={`transition-colors duration-300 ${
                      current
                        ? "text-white font-semibold"
                        : "text-white/70 font-medium hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline text-white/70 text-sm font-medium hover:text-white transition-colors duration-300"
            >
              Sign in
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-block bg-[#FF6E00] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Get a Free Audit
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-white p-1"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35, ease: "easeOut" } }}
              exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ x: "100%", transition: { duration: 0.3, ease: [0.6, 0, 0.9, 0.3] } }}
              className="fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-black z-50 md:hidden flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-10">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img
                    src="/images/cinder-logo.png"
                    alt="Cinder logo"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-white font-semibold text-lg">
                    Cinder
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white p-1"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-6 text-lg">
                {navLinks.map((link) => {
                  const current = isCurrent(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className={`flex items-center gap-3 transition-colors duration-300 ${
                        current
                          ? "text-white font-semibold"
                          : "text-white/70 font-medium hover:text-white"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-4 w-0.5 rounded-full transition-colors duration-300 ${
                          current ? "bg-[#FF6E00]" : "bg-transparent"
                        }`}
                      />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-white/70 text-sm font-medium hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/contact"
                  className="bg-[#FF6E00] text-white rounded-full px-6 py-3 text-sm font-medium text-center hover:opacity-90 transition-opacity"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get a Free Audit
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
