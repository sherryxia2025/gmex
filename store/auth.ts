import type { User } from "better-auth/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { authClient } from "@/lib/auth-client";

interface AuthState {
  // User state
  user: User | null;
  isAuthenticated: boolean;

  // Auth actions
  signIn: (
    provider: string,
    options?: { callbackURL?: string },
  ) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,

      signIn: async (provider: string, options?: { callbackURL?: string }) => {
        const { callbackURL } = options || {};
        try {
          await authClient.signIn.social({
            provider,
            callbackURL,
          });

          const session = await authClient.getSession();
          set({
            user: session?.data?.user || null,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("Sign in error:", error);
          throw error;
        }
      },

      signOut: async () => {
        try {
          await authClient.signOut();
          set({ user: null, isAuthenticated: false });
          location.reload();
        } catch (error) {
          console.error("Sign out error:", error);
          throw error;
        }
      },

      initialize: async () => {
        const session = await authClient.getSession();

        const user = session?.data?.user || null;

        set({
          user,
          isAuthenticated: true,
        });

        if (!user) {
          authClient.oneTap();
        }
      },
    }),
    {
      name: "auth-store",
    },
  ),
);
