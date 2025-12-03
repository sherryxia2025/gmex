import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getProductCategories,
  updateProductCategory,
} from "@/models/product-category";

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
    const { categoryUuid, newIndex } = body as {
      categoryUuid: string;
      newIndex: number;
    };

    if (!categoryUuid || newIndex === undefined) {
      return NextResponse.json(
        { success: false, error: "categoryUuid and newIndex are required" },
        { status: 400 },
      );
    }

    // Get all categories, sorted by sort field
    const categories = await getProductCategories({
      page: 1,
      limit: 1000,
    });

    // Sort by sort field
    const sortedCategories = [...categories].sort((a, b) => a.sort - b.sort);

    // Find the category being moved
    const categoryIndex = sortedCategories.findIndex(
      (c) => c.uuid === categoryUuid,
    );
    if (categoryIndex === -1) {
      return NextResponse.json(
        { success: false, error: "category not found" },
        { status: 404 },
      );
    }

    // Remove the category from its current position
    const [movedCategory] = sortedCategories.splice(categoryIndex, 1);

    // Insert at new position
    sortedCategories.splice(newIndex, 0, movedCategory);

    // Calculate new sort value using fractional sort
    const prevCategory = newIndex > 0 ? sortedCategories[newIndex - 1] : null;
    const nextCategory =
      newIndex < sortedCategories.length - 1
        ? sortedCategories[newIndex + 1]
        : null;

    const newSort = calculateFractionalSort(
      prevCategory?.sort ?? null,
      nextCategory?.sort ?? null,
    );

    // Update the category's sort value
    await updateProductCategory(categoryUuid, {
      sort: newSort,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: { sort: newSort },
    });
  } catch (error) {
    console.error("Failed to update category sort:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category sort" },
      { status: 500 },
    );
  }
}
