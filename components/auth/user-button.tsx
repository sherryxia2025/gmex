"use client";

import Profile from "@/components/user/profile";
import { useAuth } from "@/store/auth";

export default function AuthButton() {
  const { user } = useAuth();


  if (user) {
    return <Profile user={user} />;
  }

  return null;
}
