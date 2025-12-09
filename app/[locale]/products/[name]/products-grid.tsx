"use client";

import { useState } from "react";
import type { Prisma } from "@/prisma/generated/prisma";
import { ProductCard } from "./product-card";
import { ProductViewer } from "./product-viewer";

interface Product {
  uuid: string;
  name: string;
  title: string | null;
  description: string | null;
  coverUrl: string | null;
  metadata: Prisma.JsonValue | null;
}

interface ProductsGridProps {
  products: Product[];
}

export function ProductsGrid({ products }: ProductsGridProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setViewerIndex(index);
  };

  const handleCloseViewer = () => {
    setViewerIndex(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        {products.map((product, index) => (
          <ProductCard
            key={product.uuid}
            product={product}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>

      {viewerIndex !== null && (
        <ProductViewer
          products={products}
          initialIndex={viewerIndex}
          isOpen={true}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
}

