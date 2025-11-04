import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import PostsHeader from "@/app/[locale]/posts/posts-header";
import Footer from "@/components/blocks/home/footer";
import CategoryFilter from "@/components/posts/category-filter";
import PostsList from "@/components/posts/posts-list";
import { getLandingPage } from "@/i18n";
import { CategoryStatus, getCategories } from "@/models/category";
import { getPostsByLocaleWithPagination } from "@/models/post";

interface PostsPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "posts" });

  return {
    title: t("title"),
    description: t("description"),
  };
}
export default async function PostsPage({
  searchParams,
  params,
}: PostsPageProps) {
  const { category, page = "1" } = await searchParams;
  const { locale } = await params;
  const pageNum = parseInt(page, 10);
  const t = await getTranslations({ locale, namespace: "posts" });

  // Fetch data in parallel
  const [postsData, categories, landingPage] = await Promise.all([
    getPostsByLocaleWithPagination(locale, pageNum, 12),
    getCategories({ status: CategoryStatus.Online, page: 1, limit: 100 }),
    getLandingPage(locale),
  ]);

  // Filter posts by category if specified
  let filteredPosts = postsData.posts;
  let hasNextPage = postsData.hasNextPage;
  let hasPrevPage = postsData.hasPrevPage;

  if (category) {
    filteredPosts = postsData.posts.filter(
      (post) => post.categoryUuid === category,
    );
    // If filtering by category, we need to recalculate pagination
    // For now, we'll disable pagination when filtering
    hasNextPage = false;
    hasPrevPage = false;
  }

  return (
    <article className="min-h-screen w-full bg-white dark:bg-[#212121] transition-colors select-none">
      <PostsHeader />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl  pt-4 md:text-3xl font-bold text-[#151417] dark:text-white transition-colors mb-3">
            {t("title")}
          </h1>
          <p className="text-base text-[#666666] dark:text-[#A0A0A0] transition-colors max-w-xl mx-auto">
            {t("description")}
          </p>
        </div>
        {/* Posts List */}
        <Suspense
          fallback={<PostsListSkeleton footerProps={landingPage.footer} />}
        >
          <PostsList
            posts={filteredPosts}
            currentPage={pageNum}
            selectedCategory={category}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            categories={categories}
          />
        </Suspense>
      </div>
      <Footer {...(landingPage.footer || {})} />
    </article>
  );
}

function PostsListSkeleton({ footerProps }: { footerProps?: any }) {
  const skeletonItems = [
    "skeleton-1",
    "skeleton-2",
    "skeleton-3",
    "skeleton-4",
    "skeleton-5",
    "skeleton-6",
    "skeleton-7",
    "skeleton-8",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {skeletonItems.map((id) => (
        <div
          key={id}
          className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden animate-pulse"
        >
          <div className="p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700/50 rounded mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded mb-3 w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded mb-2 w-1/2" />
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="h-3 bg-gray-200 dark:bg-gray-700/50 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
      <Footer {...(footerProps || {})} />
    </div>
  );
}
