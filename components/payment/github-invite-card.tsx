"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { GitHubIcon, GitHubUsernameDialog } from "@/components/github";

interface GitHubInviteCardProps {
  orderNo: string;
  disabled?: boolean;
}

export function GitHubInviteCard({
  orderNo,
  disabled = false,
}: GitHubInviteCardProps) {
  const [githubInviteStatus, setGithubInviteStatus] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("payment.success.githubInvite");

  const sendGithubInvite = useCallback(async (username: string) => {
    try {
      setGithubInviteStatus("sending");
      const response = await fetch("/api/github/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, orderNo }),
      });

      if (response.ok) {
        setGithubInviteStatus("sent");
        setDialogOpen(false);
      } else {
        setGithubInviteStatus("failed");
      }
    } catch (error) {
      console.error("Error sending GitHub invite:", error);
      setGithubInviteStatus("failed");
    }
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gray-100 dark:bg-gray-800/40 p-2 rounded-lg">
            <GitHubIcon
              size={20}
              className="text-gray-600 dark:text-gray-400"
            />
          </div>
          <h3 className="text-lg font-semibold text-[#151417] dark:text-white">
            {t("title")}
          </h3>
        </div>
        <p className="text-[#666666] dark:text-[#A0A0A0] mb-4">
          {t("description")}
        </p>

        {githubInviteStatus === "idle" && (
          <button
            type="button"
            onClick={handleOpenDialog}
            disabled={disabled}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GitHubIcon size={16} />
            {t("sendInvite")}
          </button>
        )}

        {githubInviteStatus === "sending" && (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
            <span className="text-[#666666] dark:text-[#A0A0A0]">
              {t("sending")}
            </span>
          </div>
        )}

        {githubInviteStatus === "sent" && (
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-600 dark:text-green-400">
              {t("inviteSent")}
            </span>
          </div>
        )}

        {githubInviteStatus === "failed" && (
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-600 dark:text-red-400">
              {t("inviteFailed")}
            </span>
            <button
              type="button"
              onClick={handleOpenDialog}
              className="ml-auto px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {t("retry")}
            </button>
          </div>
        )}
      </div>

      <GitHubUsernameDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={sendGithubInvite}
        loading={githubInviteStatus === "sending"}
      />
    </>
  );
}
