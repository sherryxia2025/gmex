"use client";

import { ChatboxColors, Crisp } from "crisp-sdk-web";
import { useEffect } from "react";
import { useAuth } from "@/store/auth";

export const CrispChat = () => {
  const { user } = useAuth();

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    if (websiteId) {
      Crisp.configure(websiteId);
      Crisp.setColorTheme(ChatboxColors.Grey);

      if (user) {
        Crisp.setTokenId(user.id);
        Crisp.user.setEmail(user.email);
        Crisp.user.setNickname(user.name || "");
        Crisp.user.setAvatar(user.image || "");
        return;
      }

      Crisp.setTokenId();
      Crisp.session.reset();
    }
  }, [user]);

  return null;
};
