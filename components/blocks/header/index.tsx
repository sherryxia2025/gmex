"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import AuthButton from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { defaultNavConfig } from "./config";

interface HeaderProps {
  logo?: string;
  darkLogo?: string;
  brandName?: string;
  navigation?: Array<{
    label: string;
    href: string;
  }>;
  className?: string;
  navColor?: string;
}

export function Header({
  logo = defaultNavConfig.logo,
  darkLogo = defaultNavConfig.darkLogo,
  brandName = defaultNavConfig.brandName,
  navigation = defaultNavConfig.items,
  className,
  navColor,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsScrolled(window.scrollY > 96);
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 96);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        `md:h-24 fixed z-50 transition-all duration-300`,
        isScrolled
          ? "bg-white/25 dark:bg-gray-900/25 backdrop-blur-md shadow-lg left-4 right-4 top-4 rounded-2xl"
          : "bg-transparent top-0 left-0 w-full",
        isMobileMenuOpen && !isScrolled
          ? "bg-white/25 dark:bg-gray-900/25 backdrop-blur-md shadow-lg"
          : "",
        className,
      )}
    >
      <div className="hidden md:block h-full">
        <DesktopHeader
          isScrolled={isScrolled}
          logo={logo}
          darkLogo={darkLogo || logo}
          navigation={navigation}
          brandName={brandName}
          navColor={navColor}
        />
      </div>
      <div className="block md:hidden">
        <MobileHeader
          isScrolled={isScrolled}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          navigation={navigation}
          logo={logo}
          darkLogo={darkLogo || logo}
          brandName={brandName}
          navColor={navColor}
        />
      </div>
    </div>
  );
}

function DesktopHeader({
  isScrolled,
  logo,
  darkLogo,
  navigation,
  brandName,
  navColor,
}: {
  isScrolled: boolean;
  logo: string;
  darkLogo: string;
  navigation: Array<{ label: string; href: string }>;
  brandName: string;
  navColor?: string;
}) {
  const pathname = usePathname();

  const normalizePath = (path: string) => {
    if (!path) return "/";
    const segments = path.split("/").filter(Boolean);
    if (
      segments.length > 0 &&
      routing.locales.includes(segments[0] as (typeof routing.locales)[number])
    ) {
      segments.shift();
    }
    return "/" + segments.join("/");
  };

  const currentPath = normalizePath(pathname);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  return (
    <div className="h-full w-full flex items-center justify-between py-5 px-16 sm:px-20 md:px-28 xl:px-50">
      <div className="h-full flex items-center gap-2 w-50">
        <Link href="/">
          <Image
            src={isScrolled ? darkLogo : logo}
            alt={brandName}
            width={150}
            height={54}
            priority
          />
        </Link>
      </div>
      <div
        className={`h-full relative flex-1 flex justify-center items-center gap-4 font-bold text-xl transition-colors ${
          navColor ||
          (isScrolled ? "text-[#3D3D3D] dark:text-[#E5E5E5]" : "text-white")
        }`}
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "hover:text-[#FC5220] transition-colors text-lg py-2 px-4",
              isActive(item.href) && "text-[#FC5220]",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div
        className={`h-full relative flex items-center gap-4 w-50 transition-colors ${
          navColor ||
          (isScrolled ? "text-[#3D3D3D] dark:text-[#E5E5E5]" : "text-white")
        }`}
      >
        {/* <Link href="/" className="font-bold text-xl">
          Login
        </Link> */}
        <AuthButton />
      </div>
    </div>
  );
}

function MobileHeader({
  isScrolled,
  isOpen,
  setIsOpen,
  navigation,
  logo,
  darkLogo,
  brandName,
  navColor,
}: {
  isScrolled: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navigation: Array<{ label: string; href: string }>;
  logo: string;
  darkLogo: string;
  brandName: string;
  navColor?: string;
}) {
  const pathname = usePathname();

  const normalizePath = (path: string) => {
    if (!path) return "/";
    const segments = path.split("/").filter(Boolean);
    if (
      segments.length > 0 &&
      routing.locales.includes(segments[0] as (typeof routing.locales)[number])
    ) {
      segments.shift();
    }
    return "/" + segments.join("/");
  };

  const currentPath = normalizePath(pathname);

  const isActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  useEffect(() => {
    if (isOpen) {
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevBodyOverflow = document.body.style.overflow;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      return () => {
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.overflow = prevBodyOverflow;
      };
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Header Bar */}
      <div className="min-h-[72px] w-full flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src={isScrolled ? darkLogo : logo}
              alt={brandName}
              width={150}
              height={54}
              priority
            />
          </Link>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className={`transition-colors p-2 ${
            isScrolled ? "text-[#EA9320] dark:text-[#E5E5E5]" : "text-[#EA9320]"
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 dark:text-[#E5E5E5]" />
          ) : (
            <Menu className="w-5 h-5 dark:text-[#E5E5E5]" />
          )}
        </Button>
      </div>

      {/* Expandable Menu Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">
          {/* Navigation Links */}
          <nav className="space-y-2 mb-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={cn(
                  `block font-bold text-lg py-3 px-4 rounded-lg transition-colors hover:text-[#FC5220]`,
                  navColor ||
                    (isScrolled
                      ? "text-[#3D3D3D] dark:text-[#E5E5E5] hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-[#3D3D3D] hover:bg-white/10"),
                  isActive(item.href) ? "text-[#FC5220]" : "",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-300 dark:border-gray-700">
            {/* <Link
              href="/"
              onClick={closeMenu}
              className={`block text-center py-3 px-4 rounded-lg transition-colors ${
                isScrolled
                  ? "text-[#3D3D3D] dark:text-[#E5E5E5] hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-[#3D3D3D] hover:bg-white/10"
              }`}
            >
              Login
            </Link> */}
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
