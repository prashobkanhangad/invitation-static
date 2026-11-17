"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { openWhatsApp } from "@/utils/whatsapp";

const navLinks = [
  { label: "Examples", href: "/#live-examples" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-2xl font-light tracking-[-0.03em] text-foreground"
        >
          Invyto
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-light text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() =>
              openWhatsApp(
                "Hi! I'd like to create a digital wedding invitation.",
              )
            }
            className="rounded-full border border-border/80 bg-background/20 px-5 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition hover:border-primary/50"
          >
            WhatsApp
          </button>
        </div>

        <button
          type="button"
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="space-y-4 border-b border-border bg-background/95 px-6 pb-6 backdrop-blur-xl md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-light text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              openWhatsApp(
                "Hi! I'd like to create a digital wedding invitation.",
              );
            }}
            className="w-full rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground"
          >
            WhatsApp
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
