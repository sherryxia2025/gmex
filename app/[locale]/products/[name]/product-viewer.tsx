"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Prisma } from "@/prisma/generated/prisma";

interface Product {
  uuid: string;
  name: string;
  title: string | null;
  description: string | null;
  coverUrl: string | null;
  metadata: Prisma.JsonValue | null;
}

interface ProductViewerProps {
  products: Product[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductViewer({
  products,
  initialIndex,
  isOpen,
  onClose,
}: ProductViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  const currentProduct = products[currentIndex];

  // format key name: first letter uppercase, handle camel case
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // format value: handle different types of data
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item : String(item)))
        .join(", ");
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  // get all key-value pairs of metadata
  const metadataEntries = useMemo(() => {
    if (!currentProduct) return [];
    const metadata = currentProduct.metadata as Record<string, unknown> | null;
    return metadata
      ? Object.entries(metadata).filter(
          ([, value]) => value !== null && value !== undefined && value !== "",
        )
      : [];
  }, [currentProduct]);

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex flex-col">
      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute top-1/2 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Image Section - Main Focus */}
        <div className="flex-1 flex items-center justify-center p-8 min-h-0">
          {currentProduct.coverUrl ? (
            <div className="relative w-full h-full max-w-7xl max-h-full">
              <Image
                src={currentProduct.coverUrl}
                alt={currentProduct.title || currentProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 90vw"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="text-white/50 text-lg">No image available</div>
          )}
        </div>

        {/* Info Section - Secondary */}
        <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 p-6 max-h-[30vh] overflow-y-auto">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-white text-xl font-semibold mb-2">
              {currentProduct.title || currentProduct.name}
            </h2>

            {currentProduct.description && (
              <p className="text-white/70 text-sm mb-4">
                {currentProduct.description}
              </p>
            )}

            {metadataEntries.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                {metadataEntries.map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <span className="text-white/50 text-xs uppercase tracking-wide">
                      {formatKey(key)}
                    </span>
                    <span className="text-white/80 text-sm break-words">
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Index Indicator */}
            {products.length > 1 && (
              <div className="mt-4 text-white/50 text-xs">
                {currentIndex + 1} / {products.length}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
