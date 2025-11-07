import {
  Folder,
  Home,
  Image,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const t = await getTranslations("admin");

  // Get user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const navigation = [
    { name: t("navigation.users"), href: "/admin/users", icon: Users },
    { name: t("navigation.orders"), href: "/admin/orders", icon: ShoppingCart },
    {
      name: t("navigation.categories"),
      href: "/admin/categories",
      icon: Folder,
    },
    { name: t("navigation.posts"), href: "/admin/posts", icon: Image },
    {
      name: t("navigation.productCategories"),
      href: "/admin/product-categories",
      icon: ShoppingBag,
    },
    { name: t("navigation.products"), href: "/admin/products", icon: Package },
  ];

  return (
    <article
      className={cn(
        "min-h-screen w-full bg-background transition-colors select-none",
      )}
    >
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {/* Sidebar */}
          <Sidebar className="hidden md:flex w-64 border-r border-border bg-sidebar">
            <SidebarHeader className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="bg-[#F14636]">
                      {user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <Users className="h-4 w-4 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold truncate text-sidebar-foreground">
                      {user?.name || t("title")}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {`${t("welcome")}`}
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Back to Home Button */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="hover:bg-[#F14636]/10 hover:text-[#F14636] dark:hover:bg-[#F14636]/10 dark:hover:text-[#F14636]"
                      >
                        <Link
                          href="/"
                          className="flex items-center gap-3 text-sidebar-foreground"
                        >
                          <Home className="h-4 w-4" />
                          <span>{t("backToHome")}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                <SidebarGroupLabel className="text-muted-foreground">
                  {t("navigation.title")}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.name}>
                          <SidebarMenuButton
                            asChild
                            className="hover:bg-[#F14636]/10 hover:text-[#F14636] dark:hover:bg-[#F14636]/10 dark:hover:text-[#F14636]"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 text-sidebar-foreground"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Mobile header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-sidebar">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || ""}
                    />
                    <AvatarFallback className="bg-[#F14636]">
                      {user?.name ? (
                        user.name.charAt(0).toUpperCase()
                      ) : (
                        <Users className="h-3 w-3 text-white" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sidebar-foreground">
                    {user?.name || t("title")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/" className="flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>

            <main className="flex-1 p-4 md:p-6 bg-background">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </article>
  );
}
