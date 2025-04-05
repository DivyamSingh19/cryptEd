import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-#[CBD9FF] text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex flex-wrap justify-between">
          {/* Logo and Description */}
          <div className="w-full lg:w-2/5 mb-6 lg:mb-0">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" width="50" height="50" alt="logo" />
                <span className="font-bold text-2xl text-secondary">Virasat</span>
            </Link>
            <div className="flex items-center gap-4 mt-8">
                <Link href="">
                    <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition ease-linear duration-200" />
                </Link>
                <Link href="">
                    <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition ease-linear duration-200" />
                </Link>
                <Link href="">
                    <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition ease-linear duration-200" />
                </Link>
                <Link href="">
                    <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition ease-linear duration-200" />
                </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-1/5 mb-6 lg:mb-0">
            <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-white">Features</Link></li>
              <li><Link href="/solutions" className="hover:text-white">Solutions</Link></li>
              <li><Link href="#" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="w-full lg:w-1/5">
            <h2 className="text-white text-lg font-semibold mb-4">Resources</h2>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
              <li><Link href="#" className="hover:text-white">API Status</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="w-full lg:w-1/5 mt-6 md:mt-0">
            <h2 className="text-white text-lg font-semibold mb-4">Contact Us</h2>
            <p>123, Tech Park, Mumbai, India</p>
            <p>+91 1234567890</p>
            <p><Link href="mailto:contact@rogisetu.com" className="hover:text-white">contact@virasat.com</Link></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-between mt-10 border-t border-t-accent/10 pt-8">
          {/* Legal Links */}
          <div className="w-full text-center flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
            <p>&copy; 2025 Virasat. All rights reserved.</p>
            <div className="flex justify-center space-x-4">
              <Link href="#privacy-policy" className="hover:text-white text-gray-300 text-sm">Privacy Policy</Link>
              <Link href="#terms-of-service" className="hover:text-white text-gray-300 text-sm">Terms of Service</Link>
              <Link href="#cookie-policy" className="hover:text-white text-gray-300 text-sm">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
