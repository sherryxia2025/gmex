import { adminClient, oneTapClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// https://www.better-auth.com/docs/integrations/next
export const authClient = createAuthClient({
  // Use same-origin by default to avoid cross-origin issues
  // Leaving baseURL undefined makes the client use window.location.origin
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      autoSelect: true,
      cancelOnTapOutside: true,
      context: "signin",
      uxMode: "popup",
      // Configure prompt behavior and exponential backoff:
      promptOptions: {
        baseDelay: 300, // Base delay in ms (default: 1000)
        maxAttempts: 0, // Maximum number of attempts before triggering onPromptNotification (default: 5)
      },
    }),
    adminClient(),
  ],
});
