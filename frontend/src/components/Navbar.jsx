// src/components/Navbar.jsx
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: replace with real auth
  const [active, setActive] = useState("Home");

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "My Orders", href: "/orders" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 bg-[#e6efe5] shadow-md z-50">
      {/* bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 justify-start">
            <img 
            src="/src/assets/logo.jpeg" 
            alt="Rajapaksha Foods Logo" 
            className="h-10 w-auto object-contain"
          />
          <span className="font-bold text-lg text-gray-800 tracking-wide">
            Rajapaksha Foods
          </span>
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActive(link.name)}
                className={`font-medium transition duration-200 ${
                  active === link.name
                    ? "text-yellow-300 border-b-2 border-yellow-300"
                    : "text-white hover:text-yellow-300"
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Auth */}
            {isLoggedIn ? (
              <a
                href="/profile"
                className="flex items-center gap-2 text-white hover:text-yellow-300 transition duration-200"
              >
                {/* user icon (inline SVG) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" />
                </svg>
                Profile
              </a>
            ) : (
              <a
                href="/login"
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition duration-200"
              >
                Login / Register
              </a>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen((o) => !o)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              // X icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
       
        className={`md:hidden inset-x-0 bg-[#e6efe5] shadow-md z-50 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => {
                setActive(link.name);
                setIsOpen(false);
              }}
              className={`block font-medium transition duration-200 ${
                active === link.name
                  ? "text-yellow-300 border-b border-yellow-300"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              {link.name}
            </a>
          ))}

          {isLoggedIn ? (
            <a href="/profile" className="block text-white hover:text-yellow-300 transition duration-200">
              Profile
            </a>
          ) : (
            <a
              href="/login"
              className="block bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition duration-200"
            >
              Login / Register
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
