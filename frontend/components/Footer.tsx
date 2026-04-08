import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#333333] text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Column */}
          <div>
            <div className="flex items-center mb-4">
            <Image 
              src="/Invyto_logo_2.png" 
              alt="InviteElegance Logo" 
              width={120} 
              height={60}
              className="h-15 w-30"
            />
            </div>
            <p className="text-gray-400 mb-4">
              Creating beautiful digital invitations for life's special moments. 
              Elegant, easy, and eco-friendly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#templates" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <a href="mailto:hello@inviteelegance.com" className="flex items-center text-gray-400 hover:text-[#F5F5F0] transition-colors mb-2">
              <Mail size={16} className="mr-2" />
              hello@inviteelegance.com
            </a>
            <Link href="#" className="text-gray-400 hover:text-[#F5F5F0] transition-colors">
              Contact Form →
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2025 InviteElegance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
