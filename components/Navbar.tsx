"use client";

import Link from "next/link";
import { motion } from "motion/react";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-20 px-6 py-6 w-full"
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

          <div className="hidden md:flex items-center gap-8 text-white/70 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
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
            className="bg-[#FF6E00] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
