"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, Heart, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-linen bg-cream/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl font-bold tracking-wider text-charcoal">
            MOBEL
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-walnut transition-colors hover:text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              aria-label="搜尋"
              className="text-walnut transition-colors hover:text-charcoal"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account/wishlist"
              aria-label="收藏清單"
              className="hidden text-walnut transition-colors hover:text-charcoal sm:block"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <Link
              href="/auth/login"
              aria-label="帳戶"
              className="text-walnut transition-colors hover:text-charcoal"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="text-walnut lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "border-t border-linen lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="mx-auto max-w-7xl space-y-1 px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm tracking-wide text-walnut transition-colors hover:text-charcoal"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
