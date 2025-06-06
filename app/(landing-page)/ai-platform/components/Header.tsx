"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "Features", href: "#features" },
    // { name: "Testimoni", href: "#testimonials" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
    { name: "Affiliate 25%", href: "/affiliate" },
  ];

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : ""}`}>
      <nav className="container mx-auto px-4 sm:px-6 pr-2 lg:px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/ai-platform" className="text-2xl font-bold text-black">
              en<span className="text-blue-600 font-ibm-plex-mono-regular">ai</span>blr
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-black/80 hover:font-extrabold transition-all"
                >
                  {item.name}
                </Link>
              ))}
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full">
                <Link href="/payment">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center gap-0">
            <Button
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90 rounded-full"
            >
              <Link href="/payment">Get Started</Link>
            </Button>
            <Button
              ref={buttonRef}
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black hover:bg-black/10"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out rounded-lg shadow-md ${isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white/80 backdrop-blur-md px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
