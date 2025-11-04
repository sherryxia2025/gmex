"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "./discord-icon";
import { DiscordInviteDialog } from "./discord-invite-dialog";

interface DiscordInviteButtonProps {
  orderNo: string;
  disabled?: boolean;
}

export function DiscordInviteButton({
  orderNo,
  disabled = false,
}: DiscordInviteButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("discord");

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setDialogOpen(true)}
        disabled={disabled}
        className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-indigo-900/40 dark:border-indigo-600/40 dark:text-indigo-200 dark:hover:bg-indigo-900/60 dark:hover:text-indigo-100"
      >
        <DiscordIcon size={16} className="mr-2" />
        {t("get_invite_button")}
      </Button>

      <DiscordInviteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderNo={orderNo}
      />
    </>
  );
}
