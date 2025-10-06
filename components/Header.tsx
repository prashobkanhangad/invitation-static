"use client";

import Link from "next/link";
import { useState } from "react";
import { openWhatsApp } from "@/utils/whatsapp";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <svg className="h-8 w-8 text-purple-600" viewBox="0 0 40 40" fill="currentColor">
              <path d="M20 5 L35 20 L20 35 L5 20 Z" opacity="0.9"/>
              <path d="M20 10 L30 20 L20 30 L10 20 Z" opacity="0.7"/>
              <path d="M20 15 L25 20 L20 25 L15 20 Z" opacity="0.5"/>
            </svg>
            <span className="ml-2 text-xl font-bold text-gray-900">InviteElegance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-gray-700 hover:text-purple-600 transition-colors">
              Templates
            </Link>
            {/* <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
              Pricing
            </Link> */}
            <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
              Contact
            </Link>
            <button
              onClick={() => openWhatsApp("Hi! I'd like to create a digital invitation.")}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
            >
              Create Your Invitation
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-gray-700 hover:text-purple-600 transition-colors">
                Templates
              </Link>
              {/* <Link href="#pricing" className="text-gray-700 hover:text-purple-600 transition-colors">
                Pricing
              </Link> */}
              <Link href="#contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                Contact
              </Link>
              <button
                onClick={() => openWhatsApp("Hi! I'd like to create a digital invitation.")}
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors w-full"
              >
                Create Your Invitation
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
