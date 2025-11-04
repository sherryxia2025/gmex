"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Category {
  uuid: string;
  name: string;
  title: string;
  description: string | null;
}
interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("posts");

  const handleCategoryChange = (categoryUuid: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryUuid) {
      params.set("category", categoryUuid);
    } else {
      params.delete("category");
    }

    // Reset to page 1 when changing category
    params.delete("page");

    router.push(`/posts?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm text-[#666666] dark:text-[#A0A0A0] font-medium transition-colors">
        {t("category")}:
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {/* All Categories Button */}
        <Button
          variant={!selectedCategory ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(null)}
          className={
            !selectedCategory
              ? "bg-[#F14636] hover:bg-[#F14636]/80 text-white"
              : "bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 text-[#151417] dark:text-[#A0A0A0] hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors"
          }
        >
          All
        </Button>

        {/* Category Buttons */}
        {categories.map((category) => (
          <Button
            key={category.uuid}
            variant={selectedCategory === category.uuid ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.uuid)}
            className={
              selectedCategory === category.uuid
                ? "bg-[#F14636] hover:bg-[#F14636]/80 text-white"
                : "bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 text-[#151417] dark:text-[#A0A0A0] hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors"
            }
          >
            {category.title}
          </Button>
        ))}
      </div>
    </div>
  );
}
