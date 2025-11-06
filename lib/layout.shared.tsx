import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { i18n } from "./i18n";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export function baseOptions(locale: string): BaseLayoutProps {
  // you can change brandName, links by locale
  const nav = {
    zh: {
      title: process.env.NEXT_PUBLIC_APP_NAME || "",
    },
    en: {
      title: process.env.NEXT_PUBLIC_APP_NAME || "",
    },
  };
  return {
    i18n: i18n,
    nav: {
      title: (
        <>
          <img
            src="/favicon.svg"
            alt="logo"
            width={24}
            height={24}
            style={{ display: "inline", verticalAlign: "middle" }}
          />
          {nav[locale as keyof typeof nav]?.title || nav.en.title}
        </>
      ),
    },
    // see https://fumadocs.dev/docs/ui/navigation/links
    links: [],
  };
}
