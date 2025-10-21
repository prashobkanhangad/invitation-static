"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { openWhatsApp } from "@/utils/whatsapp";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#F5F5F0]/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/Invyto_logo_2.png" 
              alt="InviteElegance Logo" 
              width={120} 
              height={60}
              className="h-15 w-30"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-[#333333] transition-colors">
              Features
            </Link>
            <Link href="#templates" className="text-gray-700 hover:text-[#333333] transition-colors">
              Templates
            </Link>
            {/* <Link href="#pricing" className="text-gray-700 hover:text-[#333333] transition-colors">
              Pricing
            </Link> */}
            <Link href="#contact" className="text-gray-700 hover:text-[#333333] transition-colors">
              Contact
            </Link>
            <button
              onClick={() => openWhatsApp("Hi! I'd like to create a digital invitation.")}
              className="bg-[#333333] text-white px-6 py-2 rounded-full hover:bg-[#555555] transition-colors"
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
              <Link href="#features" className="text-gray-700 hover:text-[#333333] transition-colors">
                Features
              </Link>
              <Link href="#templates" className="text-gray-700 hover:text-[#333333] transition-colors">
                Templates
              </Link>
              {/* <Link href="#pricing" className="text-gray-700 hover:text-[#333333] transition-colors">
                Pricing
              </Link> */}
              <Link href="#contact" className="text-gray-700 hover:text-[#333333] transition-colors">
                Contact
              </Link>
              <button
                onClick={() => openWhatsApp("Hi! I'd like to create a digital invitation.")}
                className="bg-[#333333] text-white px-6 py-2 rounded-full hover:bg-[#555555] transition-colors w-full"
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
