import { motion } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Programs", href: "/programs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 shadow-md bg-white/70 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-green-600"
        >
          🍽️ Rajapaksha Foods
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link, idx) => (
            <motion.a
              key={idx}
              href={link.href}
              whileHover={{ scale: 1.1 }}
              className="relative text-gray-700 font-medium hover:text-green-600 transition"
            >
              {link.name}
              <motion.span
                className="absolute left-0 bottom-[-4px] h-[2px] w-0 bg-green-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}

          {/* Login & Register */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-xl border border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
              Login
            </button>
            <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md">
              Register
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/90 backdrop-blur-md shadow-md px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className="text-gray-700 font-medium hover:text-green-600 transition"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {/* Mobile Login & Register */}
          <div className="flex flex-col gap-3 mt-2">
            <button className="px-4 py-2 rounded-xl border border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white transition">
              Login
            </button>
            <button className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition shadow-md">
              Register
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
