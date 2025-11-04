"use client";

import { useState } from "react";
import { GitHubUsernameDialog } from "@/components/github";
import { Button } from "@/components/ui/button";

interface BindGithubCellProps {
  orderNo: string;
  status: string;
  githubUsername?: string | null;
}

export function BindGithubCell({
  orderNo,
  status,
  githubUsername,
}: BindGithubCellProps) {
  const [binding, setBinding] = useState(false);
  const [bound, setBound] = useState(!!githubUsername);
  const [currentName, setCurrentName] = useState(githubUsername || "");
  const [open, setOpen] = useState(false);

  const canBind = status === "paid" && !bound;

  const handleConfirm = async (username: string) => {
    if (!username.trim()) return;
    try {
      setBinding(true);
      const res = await fetch(`/api/user/orders/${orderNo}/bind-github`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      if (res.ok) {
        setBound(true);
        setCurrentName(username.trim());
        setOpen(false);
      } else {
        const data = await res.json();
        alert(data?.error || "Bind failed");
      }
    } finally {
      setBinding(false);
    }
  };

  if (bound) {
    const resend = async () => {
      try {
        setBinding(true);
        await fetch("/api/github/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: currentName, orderNo }),
        });
      } finally {
        setBinding(false);
      }
    };

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {currentName}
        </span>
        <Button size="sm" variant="outline" onClick={resend} disabled={binding}>
          {binding ? "Sending..." : "Resend"}
        </Button>
      </div>
    );
  }

  if (!canBind) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={binding}>
        {binding ? "Binding..." : "Bind GitHub"}
      </Button>
      <GitHubUsernameDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={handleConfirm}
        loading={binding}
      />
    </>
  );
}
