import { LogOut, ShieldCheck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { RiUserLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/store/auth";

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function Profile({ user }: UserProfileProps) {
  const router = useRouter();
  const t = useTranslations();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAdminPanel = () => {
    router.push("/admin");
  };

  const handleUserCenter = () => {
    router.push("/user-center");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex outline-none items-center justify-center gap-2 cursor-pointer"
        >
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity border border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={user.image || ""}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64" sideOffset={8}>
        <DropdownMenuLabel className="flex items-center gap-3 p-2">
          <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
            <AvatarImage
              src={user.image || ""}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground">{user.email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleAdminPanel} className="cursor-pointer">
          <ShieldCheck className="h-4 w-4 mr-2" />
          {t("user.profile.adminPanel")}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleUserCenter} className="cursor-pointer">
          <RiUserLine className="h-4 w-4 mr-2" />
          {t("user.profile.userCenter")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t("auth.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
