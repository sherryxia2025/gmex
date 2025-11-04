import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCategories } from "@/models/category";
import { getAllPosts } from "@/models/post";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const category = searchParams.get("category");
    const locale = searchParams.get("locale") || "en";

    // Get posts with pagination
    const posts = await getAllPosts(page, limit);

    // Filter by category if specified
    let filteredPosts = posts;
    if (category) {
      filteredPosts = posts.filter((post) => post.categoryUuid === category);
    }

    // Filter by locale, include posts marked as "all"
    filteredPosts = filteredPosts.filter(
      (post) => post.locale === locale || post.locale === "all",
    );

    // Get categories for filter
    const categories = await getCategories({
      page: 1,
      limit: 100,
    });

    return NextResponse.json({
      success: true,
      data: {
        posts: filteredPosts,
        categories,
        pagination: {
          page,
          limit,
          total: filteredPosts.length,
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
