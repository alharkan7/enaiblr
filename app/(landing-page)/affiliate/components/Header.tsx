"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            <Link href="/about" className="text-2xl font-bold text-black">
              en<span className="text-yellow-500">ai</span>blr <span className="font-light">Affiliate</span>
            </Link>
          </div>

          <div className="flex items-center gap-0">
            <Button
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:opacity-90 rounded-full"
            >
              <Link href="/account/affiliate">Mulai</Link>
            </Button>
          </div>
        </div>

      </nav>
    </header>
  );
};

export default Header;
