import { Link } from "react-router-dom";
import { motion } from "motion/react";

const navLinks = [
  { label: "Services", to: "/services" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
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
          <Link to="/" className="flex items-center gap-2">
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
                key={link.to}
                to={link.to}
                className="hover:text-white transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="bg-[#8A3220] text-white rounded-full px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Start Free
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
