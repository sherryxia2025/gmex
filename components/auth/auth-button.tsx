"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Profile from "@/components/user/profile";
import { useAuth } from "@/store/auth";
import AuthDialog from "./auth-dialog";

export default function AuthButton() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const t = useTranslations("auth");

  if (user) {
    return <Profile user={user} />;
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center justify-center min-w-21 px-4 py-2 rounded-lg cursor-pointer bg-black dark:bg-[#E5E5E5] text-white dark:text-[#0F0F0F] hover:bg-gray-800 dark:hover:bg-[#A0A0A0] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {t("signIn")}
      </button>
      <AuthDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
