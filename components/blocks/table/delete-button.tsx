"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  uuid: string;
  onDelete?: () => void;
  type?: "post" | "category";
}

export default function DeleteButton({
  uuid,
  onDelete,
  type = "post",
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      let response: Response;

      if (type === "post") {
        // Soft delete post by updating status to 'deleted'
        response = await fetch(`/api/admin/posts/${uuid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "deleted" }),
        });
      } else {
        // Fallback to original delete route for other types
        const resource = type === "category" ? "categories" : `${type}s`;
        response = await fetch(`/admin/${resource}/${uuid}/delete`, {
          method: "POST",
        });
      }

      const data = await response.json();

      if (response.ok && data.success) {
        onDelete?.();
        window.location.reload();
      } else {
        console.error("Failed to delete:", data.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
