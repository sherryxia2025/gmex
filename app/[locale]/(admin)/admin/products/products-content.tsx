"use client";

import { Edit, Plus, Upload } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ImportDialog } from "@/components/blocks/import-dialog";
import DeleteButton from "@/components/blocks/table/delete-button";
import ProductStatusSelect from "@/components/categories/product-status-select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: number;
  uuid: string;
  name: string;
  title: string | null;
  description: string | null;
  categoryUuid: string | null;
  status: string | null;
  coverUrl: string | null;
  metadata: unknown;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: {
    uuid: string;
    name: string;
    title: string;
  } | null;
};

export default function ProductsPageContent({
  products,
}: {
  products: Array<Product & Record<string, unknown>>;
}) {
  const t = useTranslations("admin.products");
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
            <a href="/admin/products/add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("addProduct")}
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {t("importProducts")}
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
                <TableHead>{t("table.category")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead>{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((item: Product, idx: number) => {
                  return (
                    <TableRow
                      key={item.uuid || `product-${idx}`}
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
                        {item.category ? item.category.title : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <ProductStatusSelect
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
                            <a href={`/admin/products/${item.uuid}/edit`}>
                              <Edit className="h-4 w-4" />
                              {t("actions.edit")}
                            </a>
                          </Button>
                          <DeleteButton
                            uuid={String(item.uuid || "")}
                            type="product"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="flex w-full justify-center items-center py-8 text-muted-foreground">
                      <p>{t("messages.noProductsFound")}</p>
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

          const response = await fetch("/api/admin/products/import", {
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
