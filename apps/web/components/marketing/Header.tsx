"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#fonctionnalites", label: "Fonctionnalités" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-xl text-ink tracking-tight">
              Carnet<span className="text-pink-dark">Mariage</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-ink transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/connexion" className="text-sm text-muted hover:text-ink transition-colors">
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-pink-dark text-white text-sm font-medium hover:bg-pink-main transition-colors"
            >
              Créer mon carnet
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-ink transition-colors"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-brand-border bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-muted hover:text-ink hover:bg-ivory transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-3 border-brand-border" />
            <Link
              href="/connexion"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm text-muted hover:text-ink hover:bg-ivory transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-xl bg-pink-dark text-white text-sm font-medium text-center hover:bg-pink-main transition-colors mt-2"
            >
              Créer mon carnet
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
