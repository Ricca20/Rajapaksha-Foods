
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useAuth } from '@clerk/clerk-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, sessionClaims } = useAuth();
  const isAdmin = isSignedIn && sessionClaims?.metadata?.role === 'admin';

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "My Orders", href: "/orders" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    ...(isAdmin ? [{ name: "Admin", href: "/admin" }] : []),
  ];

  return (

    <nav className="fixed top-0 inset-x-0 bg-gray-100 shadow-md z-50">
      {/* bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-18">
          {/* Left: Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center">
              <img 
                src="/src/assets/logo2.png" 
                alt="Rajapaksha Foods Logo" 
                className="h-15 w-auto object-contain rounded-full border border-orange-500 shadow-lg"
              />
              <span className="font-bold text-lg text-gray-900 tracking-wide ml-2">
                <span className="font-bold text-lg text-orange-500">Rajapaksha</span> Foods
              </span>
            </Link>
          </div>

          {/* Center: Desktop menu (hidden on mobile) */}
          <div className="flex-3 hidden lg:flex items-center justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                className={({ isActive }) =>
                  `mx-3 font-medium transition duration-200 ` +
                  (isActive
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-900 hover:text-orange-500')
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Auth (Clerk) (hidden on mobile) */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-4">
              <SignedIn>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 rounded-full"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#e5670d] transition-colors shadow-lg hover:cursor-pointer">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#e5670d] transition-colors shadow-lg hover:cursor-pointer ml-4">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
            </div>
            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="lg:hidden text-orange-500 focus:outline-none ml-2"
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
      </div>

      {/* Mobile dropdown */}
      <div
        className={`lg:hidden fixed top-16 left-0 right-0 bg-gray-100 shadow-md z-50 transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col px-4 pt-4 pb-6 space-y-4">
          {/* Mobile menu links */}
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                end={link.href === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block py-2 px-3 rounded-lg text-base font-medium transition duration-200 ` +
                  (isActive
                    ? 'bg-orange-100 text-orange-600'
                    : 'text-gray-900 hover:bg-orange-50 hover:text-orange-500')
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          {/* Auth buttons */}
          <SignedOut>
            <div className="flex gap-4">
              <SignInButton mode="modal">
                <button className="flex-1 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#e5670d] transition-colors shadow-lg">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="flex-1 px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#e5670d] transition-colors shadow-lg">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div className="flex justify-center">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full"
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
