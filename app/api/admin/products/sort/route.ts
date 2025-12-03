import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { findProductByUuid, updateProduct } from "@/models/product";
import { getProducts } from "@/models/product";

/**
 * Calculate fractional sort value between two adjacent items
 */
function calculateFractionalSort(
  prevSort: number | null,
  nextSort: number | null,
): number {
  if (prevSort === null && nextSort === null) {
    // First item
    return 1;
  }
  if (prevSort === null && nextSort !== null) {
    // Insert at the beginning
    return nextSort - 1;
  }
  if (nextSort === null && prevSort !== null) {
    // Insert at the end
    return prevSort + 1;
  }
  // Insert between two items
  if (prevSort !== null && nextSort !== null) {
    return (prevSort + nextSort) / 2;
  }
  return 1;
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { productUuid, categoryUuid, newIndex } = body as {
      productUuid: string;
      categoryUuid: string | null;
      newIndex: number;
    };

    if (!productUuid || newIndex === undefined) {
      return NextResponse.json(
        { success: false, error: "productUuid and newIndex are required" },
        { status: 400 },
      );
    }

    // Get all products in the same category, sorted by sort field
    const products = await getProducts({
      categoryUuid: categoryUuid || undefined,
      page: 1,
      limit: 1000,
    });

    // Filter products in the same category and sort by sort field
    const categoryProducts = products
      .filter((p) => (p.categoryUuid || null) === categoryUuid)
      .sort((a, b) => a.sort - b.sort);

    // Find the product being moved
    const productIndex = categoryProducts.findIndex(
      (p) => p.uuid === productUuid,
    );
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: "product not found in category" },
        { status: 404 },
      );
    }

    // Remove the product from its current position
    const [movedProduct] = categoryProducts.splice(productIndex, 1);

    // Insert at new position
    categoryProducts.splice(newIndex, 0, movedProduct);

    // Calculate new sort value using fractional sort
    const prevProduct =
      newIndex > 0 ? categoryProducts[newIndex - 1] : null;
    const nextProduct =
      newIndex < categoryProducts.length - 1
        ? categoryProducts[newIndex + 1]
        : null;

    const newSort = calculateFractionalSort(
      prevProduct?.sort ?? null,
      nextProduct?.sort ?? null,
    );

    // Update the product's sort value
    await updateProduct(productUuid, {
      sort: newSort,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { sort: newSort },
    });
  } catch (error) {
    console.error("Failed to update product sort:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product sort" },
      { status: 500 },
    );
  }
}

