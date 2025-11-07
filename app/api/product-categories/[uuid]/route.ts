import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProducts, ProductStatus } from "@/models/product";
import { findProductCategoryByUuid } from "@/models/product-category";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;

    const category = await findProductCategoryByUuid(uuid);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Product category not found" },
        { status: 404 },
      );
    }

    // Get products in this category
    const products = await getProducts({
      categoryUuid: uuid,
      status: ProductStatus.Online,
      page: 1,
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: {
        category,
        products,
      },
    });
  } catch (error) {
    console.error("Failed to fetch product category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product category" },
      { status: 500 },
    );
  }
}
