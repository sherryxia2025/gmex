"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import Header from "@/components/blocks/home/header";
import { getLandingPage } from "@/i18n";
import type { LandingPage } from "@/types/pages/landing";

export default function UserCenterHeader() {
  const locale = useLocale();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);

  useEffect(() => {
    getLandingPage(locale).then((page) => {
      setLandingPage(page);
    });
  }, [locale]);

  if (!landingPage) return null;

  return (
    <Header
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full z-10"
      brandName="PressFast"
      navigation={landingPage.header?.navigation}
      showLanguageSwitcher={true}
      showThemeSwitcher={true}
    />
  );
}
