"use client";

// --- Icons ---
import { MoonStarIcon } from "@/components/tiptap-icons/moon-star-icon";
import { SunIcon } from "@/components/tiptap-icons/sun-icon";
// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useMount } from "@/hooks/use-mount";
// --- Theme ---
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  const mounted = useMount();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button aria-label="Theme toggle" data-style="ghost">
        <SunIcon className="tiptap-button-icon" />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      data-style="ghost"
    >
      {isDarkMode ? (
        <MoonStarIcon className="tiptap-button-icon" />
      ) : (
        <SunIcon className="tiptap-button-icon" />
      )}
    </Button>
  );
}
