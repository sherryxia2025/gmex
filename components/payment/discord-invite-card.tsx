"use client";

import { Clock, Copy, ExternalLink, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { DiscordIcon } from "@/components/discord";

interface DiscordInviteCardProps {
  orderNo: string;
}

export function DiscordInviteCard({ orderNo }: DiscordInviteCardProps) {
  const [discordInvite, setDiscordInvite] = useState<string | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [discordInviteError, setDiscordInviteError] = useState(false);
  const t = useTranslations("payment.success.discordInvite");

  const generateDiscordInvite = useCallback(async (orderNumber: string) => {
    try {
      setLoadingInvite(true);
      setDiscordInviteError(false);
      const response = await fetch("/api/discord/create-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNo: orderNumber }),
      });

      if (response.ok) {
        const data = await response.json();
        setDiscordInvite(data.inviteUrl);
      } else {
        console.error("Failed to generate Discord invite");
        setDiscordInviteError(true);
      }
    } catch (error) {
      console.error("Error generating Discord invite:", error);
      setDiscordInviteError(true);
    } finally {
      setLoadingInvite(false);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-indigo-100 dark:bg-indigo-800/40 p-2 rounded-lg">
          <DiscordIcon
            size={20}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <h3 className="text-lg font-semibold text-[#151417] dark:text-white">
          {t("title")}
        </h3>
      </div>

      {discordInvite && (
        <>
          <p className="text-[#666666] dark:text-[#A0A0A0] mb-4">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={discordInvite}
              readOnly
              className="flex-1 px-4 py-2 bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-gray-600 rounded-lg text-[#151417] dark:text-white font-mono text-sm"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(discordInvite);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {t("copyLink")}
            </button>
            <a
              href={discordInvite}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center whitespace-nowrap flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {t("joinNow")}
            </a>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs text-[#666666] dark:text-[#A0A0A0]">
            <Clock className="w-3 h-3" />
            <span>{t("validityInfo")}</span>
          </div>
        </>
      )}

      {loadingInvite && !discordInvite && !discordInviteError && (
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          <span className="text-[#666666] dark:text-[#A0A0A0]">
            {t("generating")}
          </span>
        </div>
      )}

      {discordInviteError && !discordInvite && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 dark:text-red-400">
              {t("generationFailed")}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              generateDiscordInvite(orderNo);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <DiscordIcon size={16} />
            {t("retryGenerate")}
          </button>
        </div>
      )}

      {!discordInvite && !loadingInvite && !discordInviteError && (
        <div className="space-y-4">
          <p className="text-[#666666] dark:text-[#A0A0A0]">
            {t("generateDescription")}
          </p>
          <button
            type="button"
            onClick={() => {
              generateDiscordInvite(orderNo);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <DiscordIcon size={16} />
            {t("generateInvite")}
          </button>
        </div>
      )}
    </div>
  );
}
