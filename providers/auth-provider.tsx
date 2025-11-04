"use client";

import { type FC, type PropsWithChildren, useEffect } from "react";
import { useAuth } from "@/store/auth";

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return children;
};
