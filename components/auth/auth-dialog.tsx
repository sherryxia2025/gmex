import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/store/auth";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export default function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const auth = useAuth();
  const t = useTranslations("auth");
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = useCallback(
    async (provider: string) => {
      setLoadingProvider(provider);
      try {
        await auth.signIn(provider);
      } catch (error) {
        console.error("Sign in error:", error);
        setLoadingProvider(null);
      }
    },
    [auth],
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

  const content = useMemo(() => {
    if (!providers.length) {
      return (
        <DialogDescription className="text-sm dark:text-[#A0A0A0]">
          {t("noAuthenticationProvidersConfigured")}
        </DialogDescription>
      );
    }

    return providers.map((provider) => (
      <Button
        key={provider.id}
        variant="outline"
        className="w-full dark:bg-[#404040] dark:text-[#E5E5E5] dark:hover:bg-[#505050] dark:border-[#404040]"
        onClick={provider.onClick}
        disabled={loadingProvider === provider.id}
      >
        {loadingProvider === provider.id ? (
          <Spinner />
        ) : (
          <>
            {provider.icon}
            {provider.name}
          </>
        )}
      </Button>
    ));
  }, [loadingProvider, providers, t]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="text-gray-900 dark:text-[#E5E5E5] dark:bg-[#2A2A2A]"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold dark:text-[#E5E5E5]">
            {t("signIn")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-sm dark:text-[#A0A0A0]">
          {t("signInDescription")}
        </DialogDescription>
        {content}
      </DialogContent>
    </Dialog>
  );
}
