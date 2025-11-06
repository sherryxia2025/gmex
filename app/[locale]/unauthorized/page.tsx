"use client";

import { Home, ShieldX } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Header } from "@/components/blocks/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UnauthorizedPageProps {
  params: Promise<{ locale: string }>;
}

export default function UnauthorizedPage(props: UnauthorizedPageProps) {
  const t = useTranslations("unauthorized");

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
      )}
    >
      {/* Header with theme and language switchers */}
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Icon */}
          <div className="mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
              <ShieldX className="h-12 w-12 text-red-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#151417] dark:text-white mb-4 transition-colors">
            {t("title")}
          </h1>

          {/* Description */}
          <p className="text-[#666666] dark:text-[#A0A0A0] mb-8 transition-colors">
            {t("description")}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#F14636] hover:bg-[#F14636]/80 text-white"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t("goHome")}
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-sm text-[#666666] dark:text-[#A0A0A0]">
            <p>{t("errorCode")}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
