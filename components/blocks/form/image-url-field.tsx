"use client";

import { Image as ImageIcon, Loader, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
  placeholder = "Enter image URL...",
  disabled = false,
  className = "",
}: ImageUrlFieldProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

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
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            type="url"
          />
        </div>
        {value && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

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
