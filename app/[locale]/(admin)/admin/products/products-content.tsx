"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, GripVertical, Plus, Upload } from "lucide-react";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
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
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  category: {
    uuid: string;
    name: string;
    title: string;
  } | null;
};

type GroupedProducts = {
  categoryUuid: string | null;
  categoryTitle: string;
  categorySort: number;
  products: Product[];
};

function SortableRow({
  product,
  t,
}: {
  product: Product;
  t: (key: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={product.uuid}
      className="hover:bg-muted/50 transition-colors h-16"
    >
      <TableCell className="w-8 cursor-grab active:cursor-grabbing">
        <div {...attributes} {...listeners} className="flex items-center">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium" title={String(product.name || "")}>
          {String(product.name || "")}
        </span>
      </TableCell>
      <TableCell>{String(product.title || "")}</TableCell>
      <TableCell className="text-muted-foreground">
        {product.category ? product.category.title : "-"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <ProductStatusSelect
          uuid={String(product.uuid || "")}
          value={product.status}
        />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {product.createdAt
          ? moment(product.createdAt).format("YYYY-MM-DD HH:mm:ss")
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
            <a href={`/admin/products/${product.uuid}/edit`}>
              <Edit className="h-4 w-4" />
              {t("actions.edit")}
            </a>
          </Button>
          <DeleteButton uuid={String(product.uuid || "")} type="product" />
        </div>
      </TableCell>
    </TableRow>
  );
}

type ProductCategory = {
  uuid: string;
  name: string;
  title: string;
  sort: number;
};

export default function ProductsPageContent({
  products,
  categories,
}: {
  products: Array<Product & Record<string, unknown>>;
  categories: ProductCategory[];
}) {
  const t = useTranslations("admin.products");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState<Product[]>(
    products as Product[],
  );

  // Create category map for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string | null, ProductCategory>();
    map.set(null, { uuid: "", name: "", title: "未分类", sort: 999999 });
    categories.forEach((cat) => {
      map.set(cat.uuid, cat);
    });
    return map;
  }, [categories]);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups = new Map<string | null, GroupedProducts>();

    localProducts.forEach((product) => {
      const categoryUuid = product.categoryUuid || null;
      const category = categoryMap.get(categoryUuid);
      const categoryTitle = category?.title || "未分类";
      const categorySort = category?.sort ?? 999999;

      if (!groups.has(categoryUuid)) {
        groups.set(categoryUuid, {
          categoryUuid,
          categoryTitle,
          categorySort,
          products: [],
        });
      }

      const group = groups.get(categoryUuid);
      if (group) {
        group.products.push(product);
      }
    });

    // Sort products within each group by sort field
    groups.forEach((group) => {
      group.products.sort((a, b) => a.sort - b.sort);
    });

    // Sort groups by category sort field
    return Array.from(groups.values()).sort(
      (a, b) => a.categorySort - b.categorySort,
    );
  }, [localProducts, categoryMap]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find which category group the drag happened in
    const activeProduct = localProducts.find((p) => p.uuid === active.id);
    if (!activeProduct) return;

    const categoryUuid = activeProduct.categoryUuid || null;
    const group = groupedProducts.find((g) => g.categoryUuid === categoryUuid);
    if (!group) return;

    const oldIndex = group.products.findIndex((p) => p.uuid === active.id);
    const newIndex = group.products.findIndex((p) => p.uuid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Update local products state optimistically
    setLocalProducts((prev) => {
      const categoryProducts = prev.filter(
        (p) => (p.categoryUuid || null) === categoryUuid,
      );
      const otherProducts = prev.filter(
        (p) => (p.categoryUuid || null) !== categoryUuid,
      );

      const movedProduct = categoryProducts.find((p) => p.uuid === active.id);
      if (!movedProduct) return prev;

      const reordered = categoryProducts.filter((p) => p.uuid !== active.id);
      const insertIndex = reordered.findIndex((p) => p.uuid === over.id);
      if (insertIndex !== -1) {
        reordered.splice(insertIndex, 0, movedProduct);
      } else {
        reordered.push(movedProduct);
      }

      return [...otherProducts, ...reordered];
    });

    // Update sort on server
    try {
      const response = await fetch("/api/admin/products/sort", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productUuid: active.id,
          categoryUuid,
          newIndex,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update sort");
      }

      // Update the product's sort value in local state
      setLocalProducts((prev) =>
        prev.map((p) =>
          p.uuid === active.id ? { ...p, sort: data.data.sort } : p,
        ),
      );
    } catch (error) {
      console.error("Failed to update sort:", error);
      // Revert on error
      setLocalProducts(products as Product[]);
    }
  };

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

      {/* Grouped Tables */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {groupedProducts.map((group) => (
          <div key={group.categoryUuid || "uncategorized"} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {group.categoryTitle}
            </h2>
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>{t("table.name")}</TableHead>
                      <TableHead>{t("table.title")}</TableHead>
                      <TableHead>{t("table.category")}</TableHead>
                      <TableHead>{t("table.status")}</TableHead>
                      <TableHead>{t("table.createdAt")}</TableHead>
                      <TableHead>{t("table.actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.products.length > 0 ? (
                      <SortableContext
                        items={group.products.map((p) => p.uuid)}
                        strategy={verticalListSortingStrategy}
                      >
                        {group.products.map((product) => (
                          <SortableRow
                            key={product.uuid}
                            product={product}
                            t={t}
                          />
                        ))}
                      </SortableContext>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7}>
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
          </div>
        ))}
      </DndContext>

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
