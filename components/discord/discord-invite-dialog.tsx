"use client";

import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DiscordIcon } from "./discord-icon";

interface DiscordInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNo: string;
}

export function DiscordInviteDialog({
  open,
  onOpenChange,
  orderNo,
}: DiscordInviteDialogProps) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("discord");

  const generateInvite = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/discord/create-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNo }),
      });

      if (response.ok) {
        const data = await response.json();
        setInviteUrl(data.inviteUrl);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t("generate_failed"));
      }
    } catch {
      setError(t("network_error"));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (inviteUrl) {
      try {
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error(t("copy_failed"));
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // 重置状态
      setInviteUrl(null);
      setError(null);
      setCopied(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DiscordIcon size={20} />
            {t("dialog_title")}
          </DialogTitle>
          <DialogDescription>{t("dialog_description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!inviteUrl && !loading && !error && (
            <Button
              onClick={generateInvite}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <DiscordIcon size={16} className="mr-2" />
              {t("generate_button")}
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                {t("generating")}
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateInvite}
                className="mt-2"
              >
                {t("retry")}
              </Button>
            </div>
          )}

          {inviteUrl && (
            <div className="space-y-3">
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-2">
                  {t("success_message")}
                </p>
                <div className="flex gap-2">
                  <Input
                    value={inviteUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={cn(
                      "shrink-0",
                      copied && "bg-green-50 border-green-200 text-green-600",
                    )}
                  >
                    {copied ? (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        {t("copied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        {t("copy")}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t("copy_link")}
                </Button>
                <Button
                  onClick={() => window.open(inviteUrl, "_blank")}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t("join_now")}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {t("invite_expiry")}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
