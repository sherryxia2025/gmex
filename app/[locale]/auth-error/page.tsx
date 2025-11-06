"use client";

import { AlertTriangle, Home, RefreshCw, ShieldX } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Header } from "@/components/blocks/header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorType =
  | "unauthorized"
  | "forbidden"
  | "session_expired"
  | "account_banned"
  | "unknown";

export default function AuthErrorPage() {
  const t = useTranslations("authError");
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<ErrorType>("unknown");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    if (message) {
      setErrorMessage(message);
    }

    switch (error) {
      case "unauthorized":
        setErrorType("unauthorized");
        break;
      case "forbidden":
        setErrorType("forbidden");
        break;
      case "session_expired":
        setErrorType("session_expired");
        break;
      case "account_banned":
        setErrorType("account_banned");
        break;
      default:
        setErrorType("unknown");
    }
  }, [searchParams]);

  const getErrorIcon = () => {
    switch (errorType) {
      case "unauthorized":
        return <ShieldX className="h-12 w-12 text-red-500" />;
      case "forbidden":
        return <ShieldX className="h-12 w-12 text-orange-500" />;
      case "session_expired":
        return <RefreshCw className="h-12 w-12 text-yellow-500" />;
      case "account_banned":
        return <AlertTriangle className="h-12 w-12 text-red-600" />;
      default:
        return <AlertTriangle className="h-12 w-12 text-gray-500" />;
    }
  };

  const getErrorColor = () => {
    switch (errorType) {
      case "unauthorized":
        return "bg-red-500/10 border-red-500/20";
      case "forbidden":
        return "bg-orange-500/10 border-orange-500/20";
      case "session_expired":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "account_banned":
        return "bg-red-600/10 border-red-600/20";
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getTitle = () => {
    switch (errorType) {
      case "unauthorized":
        return t("unauthorized.title");
      case "forbidden":
        return t("forbidden.title");
      case "session_expired":
        return t("sessionExpired.title");
      case "account_banned":
        return t("accountBanned.title");
      default:
        return t("unknown.title");
    }
  };

  const getDescription = () => {
    if (errorMessage) {
      return errorMessage;
    }

    switch (errorType) {
      case "unauthorized":
        return t("unauthorized.description");
      case "forbidden":
        return t("forbidden.description");
      case "session_expired":
        return t("sessionExpired.description");
      case "account_banned":
        return t("accountBanned.description");
      default:
        return t("unknown.description");
    }
  };

  const getActions = () => {
    switch (errorType) {
      case "session_expired":
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              className="bg-[#F14636] hover:bg-[#F14636]/80 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("actions.refresh")}
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#666666] dark:border-[#A0A0A0] text-[#666666] dark:text-[#A0A0A0] hover:bg-[#666666]/10 dark:hover:bg-[#A0A0A0]/10"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t("actions.goHome")}
              </Link>
            </Button>
          </div>
        );
      case "account_banned":
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#F14636] hover:bg-[#F14636]/80 text-white"
            >
              <Link href="/contact" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {t("actions.contactSupport")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[#666666] dark:border-[#A0A0A0] text-[#666666] dark:text-[#A0A0A0] hover:bg-[#666666]/10 dark:hover:bg-[#A0A0A0]/10"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t("actions.goHome")}
              </Link>
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[#F14636] hover:bg-[#F14636]/80 text-white"
            >
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {t("actions.goHome")}
              </Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
      )}
    >
      {/* Header with theme and language switchers */}
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Icon */}
          <div className="mb-8">
            <div
              className={cn(
                "border rounded-full w-24 h-24 flex items-center justify-center mx-auto",
                getErrorColor(),
              )}
            >
              {getErrorIcon()}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-[#151417] dark:text-white mb-4 transition-colors">
            {getTitle()}
          </h1>

          {/* Description */}
          <p className="text-[#666666] dark:text-[#A0A0A0] mb-8 transition-colors">
            {getDescription()}
          </p>

          {/* Actions */}
          {getActions()}

          {/* Additional Info */}
          <div className="mt-12 text-sm text-[#666666] dark:text-[#A0A0A0]">
            <p>{t("errorCode", { code: errorType.toUpperCase() })}</p>
            {errorType === "session_expired" && (
              <p className="mt-2 text-xs">{t("sessionExpired.tip")}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
