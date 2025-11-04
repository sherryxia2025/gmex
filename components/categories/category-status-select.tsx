"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  uuid: string;
  value: string | null;
};

export default function CategoryStatusSelect({ uuid, value }: Props) {
  const [status, setStatus] = useState<string>(value || "");
  const [loading, setLoading] = useState(false);

  const handleChange = async (next: string) => {
    try {
      setLoading(true);
      setStatus(next);
      await fetch(`/api/admin/categories/${uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
    } catch (e) {
      setStatus(value || "");
      console.error("Failed to update category status", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      value={status || ""}
      onValueChange={handleChange}
      disabled={loading}
    >
      <SelectTrigger className="min-w-[100px] h-8 text-xs">
        <SelectValue placeholder="status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="online">online</SelectItem>
        <SelectItem value="offline">offline</SelectItem>
        <SelectItem value="created">created</SelectItem>
        <SelectItem value="deleted">deleted</SelectItem>
      </SelectContent>
    </Select>
  );
}
