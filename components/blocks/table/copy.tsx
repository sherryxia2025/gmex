"use client";
import type { ReactNode } from "react";
import { toast } from "sonner";

export default function ({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCopy();
    }
  };

  return (
    <button
      className="cursor-pointer"
      onClick={handleCopy}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {children}
    </button>
  );
}
