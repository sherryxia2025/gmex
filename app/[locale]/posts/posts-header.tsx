"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Header } from "@/components/blocks/header";
import { getLandingPage } from "@/i18n";
import type { LandingPage } from "@/types/pages/landing";

export default function PostsHeader() {
  const locale = useLocale();
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);

  useEffect(() => {
    getLandingPage(locale).then((page) => {
      setLandingPage(page);
    });
  }, [locale]);

  if (!landingPage) return null;

  return <Header />;
}
