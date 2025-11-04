import { Edit, Plus } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import DeleteButton from "@/components/blocks/table/delete-button";
import PostStatusSelect from "@/components/posts/post-status-select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCategories } from "@/models/category";
import { getAllPosts } from "@/models/post";

type Post = {
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
};

type Category = {
  id: number;
  uuid: string;
  name: string;
  title: string;
  description: string | null;
  status: string | null;
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  const posts = await getAllPosts(pageNum, limitNum);
  const categories = await getCategories({});

  return <PostsPageContent posts={posts} categories={categories} />;
}

function PostsPageContent({
  posts,
  categories,
}: {
  posts: Post[];
  categories: Category[];
}) {
  const t = useTranslations("admin.posts");

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="relative">
        <h1 className="text-4xl font-bold tracking-tighter">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button asChild>
            <a href="/admin/posts/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("addPost")}
            </a>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] min-w-[100px]">
                  {t("table.title")}
                </TableHead>
                <TableHead className="w-[15%] min-w-[120px] hidden lg:table-cell">
                  {t("table.slug")}
                </TableHead>

                <TableHead className="w-[12%] min-w-[100px] hidden sm:table-cell">
                  {t("table.category")}
                </TableHead>
                <TableHead className="w-[8%] min-w-[80px]">
                  {t("table.status")}
                </TableHead>
                <TableHead className="w-[12%] min-w-[140px] hidden lg:table-cell">
                  {t("table.createdAt")}
                </TableHead>
                <TableHead className="w-[10%] min-w-[100px]">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((item: Post, idx: number) => {
                  const category = categories?.find(
                    (category) => category.uuid === item.categoryUuid,
                  );

                  const getViewLocale = (locale?: string | null) => {
                    if (!locale || locale === "all") {
                      return "en";
                    }
                    return locale;
                  };

                  return (
                    <TableRow
                      key={item.uuid || `post-${idx}`}
                      className="hover:bg-muted/50 transition-colors h-16"
                    >
                      <TableCell
                        className="truncate"
                        title={String(item.title || "")}
                      >
                        <a
                          href={`/${getViewLocale(item.locale)}/posts/${item.slug}`}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {String(item.title || "")}
                        </a>
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground truncate hidden lg:table-cell"
                        title={String(item.slug || "")}
                      >
                        {String(item.slug || "")}
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden sm:table-cell">
                        {category?.title || "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <PostStatusSelect
                          uuid={String(item.uuid || "")}
                          value={item.status}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground hidden lg:table-cell">
                        {item.createdAt
                          ? moment(item.createdAt).format("MM-DD HH:mm")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <PostActions item={item} t={t} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                      <p>{t("messages.noPostsFound")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function PostActions({ item, t }: { item: Post; t: (key: string) => string }) {
  return (
    <>
      <Button
        asChild
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <a href={`/admin/posts/${item.uuid}/edit`}>
          {" "}
          <Edit className="h-4 w-4" />
          {t("actions.edit")}
        </a>
      </Button>
      <DeleteButton uuid={String(item.uuid || "")} />
    </>
  );
}
