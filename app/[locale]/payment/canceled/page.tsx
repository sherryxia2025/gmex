"use client";

import { AlertTriangle, Check, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Header from "@/components/blocks/home/header";
import { cn } from "@/lib/utils";

export default function PaymentCanceledPage() {
  const searchParams = useSearchParams();
  const [orderNo, setOrderNo] = useState<string | null>(null);
  const t = useTranslations("payment.canceled");

  useEffect(() => {
    const order = searchParams.get("order_no");
    setOrderNo(order);
  }, [searchParams]);

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
      )}
    >
      {/* Header with theme and language switchers */}
      <Header
        brandName="PressFast"
        showLanguageSwitcher={true}
        showThemeSwitcher={true}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full z-10"
      />

      <div className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Canceled Header */}
          <div className="text-center mb-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-[#151417] dark:text-white mb-2">
              {t("title")}
            </h1>
            <p className="text-[#666666] dark:text-[#A0A0A0]">
              {t("description")}
            </p>
          </div>

          {/* Order Info (if available) */}
          {orderNo && (
            <div className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#151417] dark:text-white mb-4">
                {t("orderInfo")}
              </h2>
              <div className="flex justify-between items-center">
                <span className="text-[#666666] dark:text-[#A0A0A0]">
                  {t("orderNumber")}:
                </span>
                <span className="text-[#151417] dark:text-white font-mono">
                  {orderNo}
                </span>
              </div>
            </div>
          )}

          {/* Reasons Card */}
          <div className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#151417] dark:text-white mb-3">
              {t("whyCanceled")}
            </h3>
            <ul className="space-y-2 text-[#666666] dark:text-[#A0A0A0]">
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#666666] dark:text-[#A0A0A0] mt-0.5 flex-shrink-0" />
                <span>{t("reasons.canceled")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#666666] dark:text-[#A0A0A0] mt-0.5 flex-shrink-0" />
                <span>{t("reasons.declined")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#666666] dark:text-[#A0A0A0] mt-0.5 flex-shrink-0" />
                <span>{t("reasons.expired")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Info className="w-4 h-4 text-[#666666] dark:text-[#A0A0A0] mt-0.5 flex-shrink-0" />
                <span>{t("reasons.technical")}</span>
              </li>
            </ul>
          </div>

          {/* Help Card */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#151417] dark:text-white mb-3">
              {t("needHelp")}
            </h3>
            <p className="text-[#666666] dark:text-[#A0A0A0] mb-4">
              {t("helpDescription")}
            </p>
            <ul className="space-y-2 text-[#666666] dark:text-[#A0A0A0]">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("helpTips.checkCard")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("helpTips.sufficientFunds")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("helpTips.differentMethod")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{t("helpTips.contactBank")}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/#pricing"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#F14636] text-white rounded-lg hover:bg-[#F14636]/80 transition-colors font-medium"
            >
              {t("tryAgain")}
            </a>
            <a
              href="/"
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-[#666666] dark:bg-[#A0A0A0] text-white rounded-lg hover:bg-[#666666]/80 dark:hover:bg-[#A0A0A0]/80 transition-colors font-medium"
            >
              {t("returnHome")}
            </a>
          </div>

          {/* Contact Support */}
          <div className="text-center mt-8">
            <p className="text-[#666666] dark:text-[#A0A0A0] mb-2">
              {t("stillTrouble")}
            </p>
            <a
              href="mailto:support@vibestarter.com"
              className="text-blue-500 hover:text-blue-400 underline"
            >
              {t("contactSupport")}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
