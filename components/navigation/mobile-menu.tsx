"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("navigation");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-800 p-2 text-white/80 hover:bg-gray-800/50"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm w-full h-full"
            onClick={closeMenu}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                closeMenu();
              }
            }}
            aria-label="Close menu"
          />

          {/* Menu Panel */}
          <div className="fixed top-4 right-4 left-4 bg-gray-900/95 border border-gray-800 rounded-2xl shadow-xl backdrop-blur-xl">
            <div className="p-6">
              {/* Close Button */}
              <div className="flex justify-end mb-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="text-white/80 hover:bg-gray-800/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4">
                <Link
                  href="#"
                  onClick={closeMenu}
                  className="block text-white/90 hover:text-white font-space-grotesk text-lg font-medium py-2"
                >
                  {t("product")}
                </Link>
                <Link
                  href="/posts"
                  onClick={closeMenu}
                  className="block text-white/90 hover:text-white font-space-grotesk text-lg font-medium py-2"
                >
                  {t("blog")}
                </Link>
                <Link
                  href="#faq"
                  onClick={closeMenu}
                  className="block text-white/90 hover:text-white font-space-grotesk text-lg font-medium py-2"
                >
                  {t("faq")}
                </Link>
                <Link
                  href="/docs"
                  onClick={closeMenu}
                  className="block text-white/90 hover:text-white font-space-grotesk text-lg font-medium py-2"
                >
                  {t("docs")}
                </Link>
                <Link
                  href="/#pricing"
                  onClick={closeMenu}
                  className="block text-white/90 hover:text-white font-space-grotesk text-lg font-medium py-2"
                >
                  {t("pricing")}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
