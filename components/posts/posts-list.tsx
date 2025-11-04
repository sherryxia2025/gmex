"use client";

import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  uuid: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  content: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  status: string | null;
  coverUrl: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  locale: string | null;
  categoryUuid: string | null;
}

interface PostsListProps {
  posts: Post[];
  currentPage: number;
  selectedCategory?: string;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  categories?: Array<{ uuid: string; title: string }>;
}

export default function PostsList({
  posts,
  currentPage,
  selectedCategory,
  hasNextPage = false,
  hasPrevPage = false,
  categories = [],
}: PostsListProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("posts");

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-600 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-[#151417] dark:text-white mb-3 transition-colors">
            {t("noPosts")}
          </h3>
          <p className="text-[#666666] dark:text-[#A0A0A0] mb-4 transition-colors">
            {selectedCategory ? t("noPostsInCategory") : t("noPostsYet")}
          </p>
          {selectedCategory && (
            <Button
              asChild
              variant="outline"
              className="bg-gray-50 dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-600 text-[#151417] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#2A2A2A]/80 transition-colors"
            >
              <Link href="/posts">{t("viewAllPosts")}</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-6 py-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {posts.map((post) => (
          <PostCard key={post.uuid} post={post} categories={categories} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        isLoading={isLoading}
        onPageChange={() => setIsLoading(true)}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </div>
  );
}

function PostCard({
  post,
  categories,
}: {
  post: Post;
  categories: Array<{ uuid: string; title: string }>;
}) {
  const t = useTranslations("posts");
  const categoryTitle = post.categoryUuid
    ? categories.find((c) => c.uuid === post.categoryUuid)?.title
    : undefined;

  return (
    <div className="bg-white dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col min-h-[480px] min-w-0 flex-1 hover:shadow-sm">
      <Link href={`/posts/${post.slug}`} className="flex-1 flex flex-col">
        {post.coverUrl ? (
          <div className="relative h-64 w-full overflow-hidden border-b border-gray-100 dark:border-gray-800">
            <Image
              src={post.coverUrl}
              alt={post.title || "Post cover"}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-64 w-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-semibold text-[#151417] dark:text-white line-clamp-3 text-left w-full px-5">
              {post.title || "Untitled Post"}
            </h3>
          </div>
        )}
        <div className="flex-1 flex flex-col p-7 gap-4 justify-between">
          <h3 className="text-xl font-bold text-[#151417] dark:text-white mb-1 line-clamp-2 group-hover:text-[#F14636] transition-colors text-left">
            {post.title || "Untitled Post"}
          </h3>
          {post.description && (
            <p className="text-[15px] text-[#666] dark:text-[#aaa] line-clamp-2 mb-2 text-left">
              {post.description}
            </p>
          )}

          {categoryTitle && (
            <div className="pt-1">
              <Badge
                variant="secondary"
                className="text-xs bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-[#333] dark:text-[#ddd]"
              >
                {categoryTitle}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="text-[13px] text-[#222] dark:text-[#eee] font-medium flex items-center gap-1 cursor-pointer text-[#F14636]">
              {t("readMore")}{" "}
              <span aria-hidden>
                <ArrowRight className="h-3 w-3" />
              </span>
            </span>
            <div className="flex gap-4 items-center text-xs text-[#888] dark:text-[#A0A0A0]">
              {post.authorName && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {post.authorName}
                </span>
              )}
              {post.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {moment(post.createdAt).format("MMM DD")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

function Pagination({
  currentPage,
  isLoading,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: {
  currentPage: number;
  isLoading: boolean;
  onPageChange: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}) {
  const t = useTranslations("posts");
  const handlePageChange = (newPage: number) => {
    if (isLoading || newPage < 1) return;
    onPageChange();

    // Navigate to new page using Next.js router
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    window.location.href = `/posts?${params.toString()}`;
  };

  // Don't show pagination if there's only one page or no posts
  if (!hasNextPage && !hasPrevPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage || isLoading}
        className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-600 text-[#151417] dark:text-[#A0A0A0] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]/80 disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {t("previous")}
      </Button>

      <div className="flex items-center gap-2">
        <span className="text-sm text-[#666666] dark:text-[#A0A0A0] transition-colors">
          {t("page")} {currentPage}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNextPage || isLoading}
        className="bg-white dark:bg-[#2A2A2A] border-gray-200 dark:border-gray-600 text-[#151417] dark:text-[#A0A0A0] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]/80 disabled:opacity-50 transition-colors"
      >
        {t("next")}
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
