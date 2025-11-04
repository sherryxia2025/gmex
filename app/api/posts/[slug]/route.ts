import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCategories } from "@/models/category";
import { findPostBySlug } from "@/models/post";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const post = await findPostBySlug(slug, locale);

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 },
      );
    }

    // Get categories for related posts or navigation
    const categories = await getCategories({
      page: 1,
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: {
        post,
        categories,
      },
    });
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 },
    );
  }
}
