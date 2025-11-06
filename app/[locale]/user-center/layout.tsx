import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { RiOrderPlayLine } from "react-icons/ri";
import { Header } from "@/components/blocks/header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function UserCenterLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.user.email) {
    redirect("/");
  }

  const t = await getTranslations();

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none",
      )}
    >
      {/* Top Navigation */}
      <Header />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* User Info Section */}
          <div className="py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || session.user.email || ""}
                />
                <AvatarFallback className="bg-[#F14636] text-white">
                  {session.user.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : session.user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-[#151417] dark:text-white">
                  {session.user.name || t("user_center.title")}
                </h1>
                <p className="text-[#666666] dark:text-[#A0A0A0]">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="py-6">
            <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
              <Link
                href="/user-center/my-orders"
                className="flex items-center gap-2 pb-4 px-1 border-b-2 border-[#F14636] text-[#F14636] font-medium"
              >
                <RiOrderPlayLine className="h-4 w-4" />
                {t("user.my_orders")}
              </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="pb-8">{children}</div>
        </div>
      </div>
    </article>
  );
}
