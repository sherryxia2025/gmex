"use client";

import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { type FC, type PropsWithChildren, useEffect } from "react";

const Provider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light">
      {children}
    </NextThemeProvider>
  );
};

const Children: FC<PropsWithChildren> = ({ children }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);

  return children;
};

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Provider>
      <Children>{children}</Children>
    </Provider>
  );
};
