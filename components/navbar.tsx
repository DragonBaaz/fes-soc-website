"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search } from "lucide-react"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Departments", href: "/departments" },
  { name: "Framework", href: "/framework" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="w-full">
      {/* Main Navigation Bar */}
      <nav className="bg-[#1B4332]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Title */}
            <div className="shrink-0">
              <Link href="/" className="flex flex-col">
                <span className="text-lg font-bold text-white sm:text-xl">
                  SOC Diagnostic
                </span>
                <span className="text-xs text-[#6EE7B7] sm:text-sm">
                  Chhattisgarh Commons Policy Analysis
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:block">
              <div className="flex items-center gap-1">
                <Link
                  href="/search"
                  className="p-2 text-white transition-colors hover:text-[#6EE7B7]"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 text-sm font-medium text-white transition-colors hover:text-[#6EE7B7]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-white hover:text-[#6EE7B7] focus:outline-none"
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-[#2D6A4F] md:hidden">
            <div className="px-2 pb-3 pt-2">
              <Link
                href="/search"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#2D6A4F] hover:text-[#6EE7B7]"
              >
                <Search className="h-5 w-5" />
                Search
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[#2D6A4F] hover:text-[#6EE7B7]"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Indian Tricolor Stripe */}
      <div className="flex h-0.75 w-full">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </header>
  )
}
