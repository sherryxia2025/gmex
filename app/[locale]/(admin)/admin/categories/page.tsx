import { Edit, Plus } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import DeleteButton from "@/components/blocks/table/delete-button";
// removed dropdown actions in favor of inline buttons
import CategoryStatusSelect from "@/components/categories/category-status-select";
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

// import type { NavItem } from "@/types/blocks/base";

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

export default async function CategoriesPage() {
  const categories = await getCategories({
    page: 1,
    limit: 50,
  });

  return <CategoriesPageContent categories={categories} />;
}

function CategoriesPageContent({ categories }: { categories: Category[] }) {
  const t = useTranslations("admin.categories");

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
            <a href="/admin/categories/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("addCategory")}
            </a>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.title")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead>{t("table.sort")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((item: Category, idx: number) => {
                  // no dropdown actions for categories now

                  return (
                    <TableRow
                      key={item.uuid || `category-${idx}`}
                      className="hover:bg-muted/50 transition-colors h-16"
                    >
                      <TableCell>
                        <a
                          href={`/posts?category=${encodeURIComponent(String(item.uuid || ""))}`}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          title={String(item.name || "")}
                        >
                          {String(item.name || "")}
                        </a>
                      </TableCell>
                      <TableCell>{String(item.title || "")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {String(item.description || "")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {String(item.sort || "")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <CategoryStatusSelect
                          uuid={String(item.uuid || "")}
                          value={item.status}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.createdAt
                          ? moment(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <a href={`/admin/categories/${item.uuid}/edit`}>
                              <Edit className="h-4 w-4" />
                              {t("actions.edit")}
                            </a>
                          </Button>
                          <DeleteButton
                            uuid={String(item.uuid || "")}
                            type="category"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                      <p>{t("messages.noCategoriesFound")}</p>
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
