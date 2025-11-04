import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Analytics from "@/components/analytics";
import { CrispChat } from "@/components/crisp";
import { routing } from "@/i18n";
import { i18n } from "@/lib/i18n";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const ltSaeada = localFont({
  variable: "--font-lt-saeada",
  display: "swap",
  src: [
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Hairline.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Thin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-ExtraLight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-ExtraBold.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-Black.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/lt-saeada/LTSaeada-ExtraBlack.otf",
      weight: "950",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: process.env.NEXT_PUBLIC_APP_NAME || "Untitled App",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "",
};

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    zh: {
      displayName: "Chinese",
      search: "查找文档",
      searchNoResult: "没有找到结果",
      toc: "目录",
      tocNoHeadings: "没有标题",
      lastUpdate: "最后更新",
      chooseLanguage: "选择语言",
      nextPage: "下一页",
      previousPage: "上一页",
      chooseTheme: "选择主题",
      editOnGithub: "在 GitHub 上编辑",
    },
  },
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${ltSaeada.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <NextIntlClientProvider messages={messages}>
              <Analytics />
              <RootProvider i18n={provider(locale)}>{children}</RootProvider>
            </NextIntlClientProvider>
            <CrispChat />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
