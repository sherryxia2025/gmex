"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // Get callback URL from query params
  const callbackURL = searchParams.get("callbackURL") || undefined;

  // Redirect if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      const redirectTo = callbackURL || "/";
      router.push(redirectTo);
    }
  }, [auth.isAuthenticated, auth.user, callbackURL, router]);

  const handleSignIn = useCallback(
    async (provider: string) => {
      setLoadingProvider(provider);
      try {
        await auth.signIn(provider, {
          callbackURL: callbackURL || "/",
        });
      } catch (error) {
        console.error("Sign in error:", error);
        setLoadingProvider(null);
      }
    },
    [auth, callbackURL],
  );

  const providers = useMemo(() => {
    const items = [];

    if (process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID) {
      items.push({
        id: "github",
        name: "GitHub",
        icon: <FaGithub className="size-4" />,
        onClick: () => handleSignIn("github"),
      });
    }

    if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      items.push({
        id: "google",
        name: "Google",
        icon: <FcGoogle className="size-4" />,
        onClick: () => handleSignIn("google"),
      });
    }

    return items;
  }, [handleSignIn]);

  // Show loading state if checking authentication
  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-[#F3F4F6] dark:bg-[#181818] transition-colors select-none",
      )}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-[560px]">
          <div className="rounded-3xl bg-white dark:bg-[#212121] shadow-xl border border-black/5 dark:border-white/10">
            <div className="p-8 sm:p-10">
              {/* App Icon */}
              <div className="flex justify-center">
                <div className="size-14 rounded-2xl bg-gradient-to-b from-[#915EFF] to-[#6E43F2] shadow-sm flex items-center justify-center">
                  {/* Simple spark icon shape */}
                  <div className="size-7 rounded-full bg-white/90" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-center text-3xl sm:text-4xl font-bold text-[#151417] dark:text-white mt-6">
                {t("signIn")}
              </h1>
              <p className="text-center text-[#666666] dark:text-[#A0A0A0] mt-2">
                {t("signInDescription")}
              </p>

              {/* Providers */}
              <div className="mt-8">
                {providers.length === 0 ? (
                  <p className="text-sm text-center text-[#666666] dark:text-[#A0A0A0]">
                    {t("noAuthenticationProvidersConfigured")}
                  </p>
                ) : (
                  <>
                    {/* Providers in one row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Google */}
                      {providers.find((p) => p.id === "google") && (
                        <Button
                          onClick={providers.find((p) => p.id === "google")!.onClick}
                          disabled={loadingProvider === "google"}
                          className={cn(
                            "w-full h-11 rounded-xl text-white font-medium",
                            "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED]/90 hover:to-[#6D28D9]/90",
                            "dark:shadow-[0_6px_20px_-6px_rgba(124,58,237,0.6)]",
                          )}
                        >
                          {loadingProvider === "google" ? (
                            <Spinner className="text-white" />
                          ) : (
                            <>
                              <FcGoogle className="size-5 bg-white rounded-sm" />
                              <span className="ml-2">With Google</span>
                            </>
                          )}
                        </Button>
                      )}
                      {/* GitHub */}
                      {providers.find((p) => p.id === "github") && (
                        <Button
                          onClick={providers.find((p) => p.id === "github")!.onClick}
                          disabled={loadingProvider === "github"}
                          variant="outline"
                          className="h-11 rounded-xl w-full dark:bg-[#2A2A2A] dark:text-[#E5E5E5] dark:border-[#333] hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          {loadingProvider === "github" ? (
                            <Spinner />
                          ) : (
                            <>
                              <FaGithub className="size-5" />
                              <span className="ml-2">With GitHub</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer hint */}
            <div className="px-8 sm:px-10 pb-8 sm:pb-10">
              <p className="text-center text-xs text-[#888] dark:text-[#A0A0A0]">
                {/* Keep hint minimal, no email/password for now */}
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

