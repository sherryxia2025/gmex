import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProductCategories } from "@/models/product-category";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const categories = await getProductCategories({
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product categories" },
      { status: 500 },
    );
  }
}
