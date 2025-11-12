"use client";

import { Image as ImageIcon, Loader, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ImageUrlFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function ImageUrlField({
  value = "",
  onChange,
  placeholder = "Enter image URL or upload a file...",
  disabled = false,
  className = "",
}: ImageUrlFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const handleUrlChange = (url: string) => {
    onChange?.(url);
    if (url) {
      setIsLoading(true);
      setImageError(false);
    }
  };

  const clearImage = () => {
    onChange?.("");
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      );
      return;
    }

    // Validate file size (10MB)
    const maxSize = 4.5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        `File size exceeds maximum allowed (${maxSize / 1024 / 1024}MB)`,
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange?.(data.url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isUploading}
            type="url"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUploadClick}
          disabled={disabled || isUploading}
        >
          {isUploading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
            disabled={disabled || isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value && isValidUrl(value) && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>Preview</span>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
              )}
              {imageError ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Failed to load image</p>
                    <p className="text-xs">Please check the URL</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-contain"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: isLoading ? "none" : "block" }}
                />
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
