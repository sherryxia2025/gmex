"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthButton from "@/components/auth/auth-button";
import LanguageSwitcher from "@/components/language-switcher";
import { useMount } from "@/hooks/use-mount";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "@/i18n";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
  brandName?: string;
  logo?: string;
  navigation?: Array<{
    text: string;
    href: string;
  }>;
  showLanguageSwitcher?: boolean;
  showThemeSwitcher?: boolean;
}

export default function Header(props: HeaderProps) {
  const {
    className,
    brandName,
    logo,
    navigation,
    showLanguageSwitcher = true,
    showThemeSwitcher = true,
  } = props;
  const { isDarkMode, toggleTheme } = useTheme();
  const mounted = useMount();

  if (
    !brandName &&
    (!navigation || navigation.length === 0) &&
    !showLanguageSwitcher &&
    !showThemeSwitcher
  ) {
    return null;
  }

  return (
    <>
      <div className="hidden lg:block">
        <DesktopHeader
          className={className}
          brandName={brandName}
          logo={logo}
          navigation={navigation}
          showLanguageSwitcher={showLanguageSwitcher}
          showThemeSwitcher={showThemeSwitcher}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          mounted={mounted}
        />
      </div>
      <div className="block lg:hidden">
        <MobileHeader
          className={className}
          brandName={brandName}
          logo={logo}
          navigation={navigation}
          showLanguageSwitcher={showLanguageSwitcher}
          showThemeSwitcher={showThemeSwitcher}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          mounted={mounted}
        />
      </div>
    </>
  );
}

function DesktopHeader(
  props: HeaderProps & {
    isDarkMode: boolean;
    toggleTheme: () => void;
    mounted: boolean;
  },
) {
  const {
    className,
    brandName,
    logo,
    navigation,
    showLanguageSwitcher = true,
    showThemeSwitcher = true,
    isDarkMode,
    toggleTheme,
    mounted,
  } = props;
  const router = useRouter();
  return (
    <section
      className={cn(
        "max-w-7xl mx-auto flex items-center justify-between py-5 px-4 md:px-6",
        className,
      )}
    >
      {logo ? (
        <Image
          src={logo}
          alt={brandName || ""}
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
          onClick={() => router.push("/")}
        />
      ) : (
        brandName && (
          <div className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/favicon.svg"
              alt={brandName || ""}
              width={26}
              height={32}
              onClick={() => router.push("/")}
            />
            <h1 className="text-[#3D3D3D] dark:text-[#E5E5E5] text-[34px]">
              <Link
                href="/"
                className="font-lt-saeada font-[600] leading-[24px] "
              >
                {brandName}
              </Link>
            </h1>
          </div>
        )
      )}
      {navigation && navigation.length > 0 && (
        <nav className="flex items-center gap-8 xl:gap-15">
          {(navigation ?? []).map((item) => (
            <Link
              key={item.href}
              className="uppercase text-sm text-gray-700 dark:text-[#A0A0A0] hover:text-[#F14636] dark:hover:text-[#F14636] transition-colors"
              href={item.href}
            >
              {item.text}
            </Link>
          ))}
        </nav>
      )}
      <div className="relative flex items-center gap-4 w-21">
        <nav className="flex items-center gap-2">
          {showLanguageSwitcher && <LanguageSwitcher />}
          {showThemeSwitcher && (
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 cursor-pointer rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 p-3 text-gray-700 dark:text-[#A0A0A0]"
            >
              {mounted && isDarkMode ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
            </button>
          )}
        </nav>
        <AuthButton />
      </div>
    </section>
  );
}

function MobileHeader(
  props: HeaderProps & {
    isDarkMode: boolean;
    toggleTheme: () => void;
    mounted: boolean;
  },
) {
  const {
    className,
    brandName,
    logo,
    navigation,
    showLanguageSwitcher = true,
    showThemeSwitcher = true,
    isDarkMode,
    toggleTheme,
    mounted,
  } = props;
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <section
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between py-5 px-4 md:px-6",
          className,
        )}
      >
        {logo ? (
          <Image
            src={logo}
            alt={brandName || ""}
            width={40}
            height={40}
            className="rounded-full cursor-pointer"
            onClick={() => router.push("/")}
          />
        ) : (
          brandName && (
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/favicon.svg"
                alt={brandName || ""}
                width={26}
                height={32}
                onClick={() => router.push("/")}
              />
              <h1 className="text-[#3D3D3D] dark:text-[#E5E5E5] text-[34px]">
                <Link
                  href="/"
                  className="font-lt-saeada font-[600] leading-[24px] "
                >
                  {brandName}
                </Link>
              </h1>
            </div>
          )
        )}
        <div className="relative flex items-center gap-4">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center justify-center p-3 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-[#A0A0A0]"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </section>
      {isMobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="Close menu overlay"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                setIsMobileMenuOpen(false);
              }
            }}
          />
          <div className="fixed inset-0 z-50 bg-[#F7F5F0] dark:bg-neutral-900 p-6 pt-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              {brandName ? (
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src="/favicon.svg"
                    alt={brandName || ""}
                    width={26}
                    height={32}
                    onClick={() => router.push("/")}
                  />
                  <h1 className="text-[#3D3D3D] dark:text-[#E5E5E5] text-[34px]">
                    <Link
                      href="/"
                      className="font-lt-saeada font-[600] leading-[24px] "
                    >
                      {brandName}
                    </Link>
                  </h1>
                </div>
              ) : (
                <span />
              )}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 text-gray-700 dark:text-[#A0A0A0]"
              >
                <X className="size-5" strokeWidth={3} />
              </button>
            </div>
            {navigation && navigation.length > 0 && (
              <nav className="flex flex-col gap-5 mb-8">
                {(navigation ?? []).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="uppercase text-sm text-gray-700 dark:text-[#A0A0A0] hover:text-[#F14636] dark:hover:text-[#F14636] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
            )}
            <div className="flex gap-4">
              <AuthButton />
              <div className="flex items-center gap-2">
                {showLanguageSwitcher && <LanguageSwitcher />}
                {showThemeSwitcher && (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 cursor-pointer rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10 p-3 text-gray-700 dark:text-[#A0A0A0]"
                  >
                    {mounted && isDarkMode ? (
                      <Moon className="size-4" />
                    ) : (
                      <Sun className="size-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
