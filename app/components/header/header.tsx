"use client";

import { Button } from "@/components/ui/button";
import { Globe, Menu, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 197.9) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white
    ${scrolled ? "border-b" : ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-semibold">Mano</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                href="/profil"
                className="text-gray-600 hover:text-gray-900"
              >
                Werde Handwerker
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Globe className="h-5 w-5" />
              </Link>
              <Button variant="outline" className="flex items-center">
                <Menu className="h-5 w-5 mr-2" />
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
