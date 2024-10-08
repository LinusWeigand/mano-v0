"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, Check, Globe, Mail, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Modal from "./modal";
import Auth from "./auth/page";
import Profil from "./profil";
import { useSearchParams } from "next/navigation";
import { useBanner } from "@/context/BannerContext";
import { BannerType } from "@/types/BannerType";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfilModalOpen, setIsProfilModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { banner, clearBanner, setBanner, bannerEmail, setBannerEmail } = useBanner();

  const searchParams = useSearchParams();
  const verification_code = decodeURIComponent(searchParams.get('vc') || '');
  const email = decodeURIComponent(searchParams.get('e') || '');

  const handle_email_verification = async () => {
    try {
      const response = await fetch("http://localhost/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, verification_code }),
      });

      if (!response.ok) {
        console.error("Failed to verify email");
        setBanner(BannerType.VerifyEmailExpired);
        return;
      }
      on_close();
      setBanner(BannerType.EmailVerified)
      console.log("E-Mail verified.")
    } catch (error) {
      console.error("Error occured in handle_email_verification: ", error);
    }
  }

  useEffect(() => {

    if (verification_code !== '' && email != '') {
      handle_email_verification();
    }
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleAuth = () => {
    setShowMenu(false);
    setIsAuthModalOpen(true);
  };
  const handleProfil = () => {
    setShowMenu(false);
    setIsProfilModalOpen(true);
  };

  const on_close = () => {
    setIsAuthModalOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white relative
    ${scrolled ? "border-b" : ""}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="ml-2 text-xl font-semibold">Mano</span>
            </Link>
          </div>
          <div className="">
            <div className="flex items-center space-x-4">
              <a
                onClick={handleProfil}
                className="text-gray-600 hover:text-gray-900 hover:cursor-pointer hidden sm:block"
              >
                Als Handwerker loslegen
              </a>

              <Button
                variant="outline"
                className="flex items-center"
                onClick={toggleMenu}
              >
                <Menu className="h-5 w-5 mr-2" />
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-4 sm:right-6 top-12 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
            role="menu"
          >
            <div className="p-2">
              <a
                onClick={handleAuth}
                className="block rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-50 hover:text-gray-900 font-medium hover:cursor-pointer"
                role="menuitem"
              >
                Registrieren
              </a>

              <a
                onClick={handleAuth}
                className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                role="menuitem"
              >
                Einloggen
              </a>
            </div>

            <div className="p-2">
              <a
                onClick={handleProfil}
                className="block rounded-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:cursor-pointer"
                role="menuitem"
              >
                Als Handwerker loslegen
              </a>
            </div>
          </div>
        )}
      </div>
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <Auth on_close={on_close} />
      </Modal>

      <Modal
        isOpen={isProfilModalOpen}
        onClose={() => setIsProfilModalOpen(false)}
      >
        <Profil onClose={setIsProfilModalOpen} />
      </Modal>
      {banner === BannerType.ResetPassword && <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Mail className="text-[#4bb0ba] h-7 w-7" />
          <span>
            Ein Link zum Zurücksetzen deines Passworts wurde an {bannerEmail || 'deine E-Mail'} gesendet.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      {banner === BannerType.VerifyEmail && <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Mail className="text-[#4bb0ba] h-7 w-7" />
          <span>
            Ein Verifizierungslink wurde an {bannerEmail || 'deine E-Mail'} gesendet.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      {banner === BannerType.VerifyEmailExpired && <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Mail className="text-[#4bb0ba] h-7 w-7" />
          <span>
            Der Verifizierungslink für {bannerEmail || 'deine E-Mail'} ist abgelaufen.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      {banner === BannerType.EmailVerified && <div className="absolute top-0 w-full bg-[#c2e4e6] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Mail className="text-[#4bb0ba] h-7 w-7" />
          <span>
            Deine E-Mail {bannerEmail || ''} wurde verifiziert.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#4bb0ba] hover:text-[#1a8c96] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      {banner === BannerType.PasswordResetted && <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Check className="text-[#e4a593] h-7 w-7" />
          <span>
            Passwort wurde aktualisiert.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
      {banner === BannerType.ResetPasswordExpired && <div className="absolute top-0 w-full bg-[#ffd1c4] text-black p-4 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <AlertCircle className="text-[#e4a593] h-7 w-7" />
          <span>
            Ihre Anfrage zum Zurücksetzen des Passworts ist bereits abgelaufen. Bitte versuchen Sie es erneut.
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-4 text-[#b3725e] hover:text-[#612a1b] hover:bg-transparent"
          onClick={() => clearBanner()}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>}
    </header>
  );
}
