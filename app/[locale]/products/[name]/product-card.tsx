"use client";

import Image from "next/image";
import type { Prisma } from "@/prisma/generated/prisma";

interface ProductCardProps {
  product: {
    uuid: string;
    name: string;
    title: string | null;
    description: string | null;
    coverUrl: string | null;
    metadata: Prisma.JsonValue | null;
  };
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all duration-300 h-full border border-gray-100 hover:border-gray-200 cursor-pointer text-left"
    >
      {/* Product Image */}
      {product.coverUrl && (
        <div className="w-full h-56 sm:h-64 lg:h-72 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
            <Image
              src={product.coverUrl}
              alt={product.title || product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2">
          {product.title || product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
            {product.description}
          </p>
        )}
      </div>
    </button>
  );
}
