"use client";

import { Edit, Plus, Upload } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ImportDialog } from "@/components/blocks/import-dialog";
import DeleteButton from "@/components/blocks/table/delete-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ProductCategory = {
  id: number;
  uuid: string;
  name: string;
  title: string;
  description: string | null;
  features: unknown;
  coverUrl: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export default function ProductCategoriesPageContent({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const t = useTranslations("admin.productCategories");
  const [importDialogOpen, setImportDialogOpen] = useState(false);

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
            <a
              href="/admin/product-categories/add"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("addCategory")}
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t("importCategories")}
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
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories && categories.length > 0 ? (
                categories.map((item: ProductCategory, idx: number) => {
                  return (
                    <TableRow
                      key={item.uuid || `category-${idx}`}
                      className="hover:bg-muted/50 transition-colors h-16"
                    >
                      <TableCell>
                        <span
                          className="font-medium"
                          title={String(item.name || "")}
                        >
                          {String(item.name || "")}
                        </span>
                      </TableCell>
                      <TableCell>{String(item.title || "")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {String(item.description || "")}
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
                            <a
                              href={`/admin/product-categories/${item.uuid}/edit`}
                            >
                              <Edit className="h-4 w-4" />
                              {t("actions.edit")}
                            </a>
                          </Button>
                          <DeleteButton
                            uuid={String(item.uuid || "")}
                            type="productCategory"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5}>
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

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/admin/product-categories/import", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          return data;
        }}
        title={t("importDialog.title")}
        description={t("importDialog.description")}
      />
    </div>
  );
}
