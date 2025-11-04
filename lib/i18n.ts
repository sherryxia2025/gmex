import type { I18nConfig } from "fumadocs-core/i18n";
import { routing } from "@/i18n";

export const i18n: I18nConfig = {
  languages: routing.locales as unknown as string[],
  defaultLanguage: routing.defaultLocale,
  parser: "dot",
  fallbackLanguage: "en",
  hideLocale:
    routing.localePrefix === "as-needed" ? "default-locale" : undefined,
};
