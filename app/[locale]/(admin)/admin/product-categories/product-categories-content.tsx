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
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

function SortableRow({
  category,
  t,
}: {
  category: ProductCategory;
  t: (key: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.uuid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={category.uuid}
      className="hover:bg-muted/50 transition-colors h-16"
    >
      <TableCell className="w-8 cursor-grab active:cursor-grabbing">
        <div {...attributes} {...listeners} className="flex items-center">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </TableCell>
      <TableCell>
        <span className="font-medium" title={String(category.name || "")}>
          {String(category.name || "")}
        </span>
      </TableCell>
      <TableCell>{String(category.title || "")}</TableCell>
      <TableCell className="text-muted-foreground">
        {String(category.description || "")}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {category.createdAt
          ? moment(category.createdAt).format("YYYY-MM-DD HH:mm:ss")
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
            <a href={`/admin/product-categories/${category.uuid}/edit`}>
              <Edit className="h-4 w-4" />
              {t("actions.edit")}
            </a>
          </Button>
          <DeleteButton
            uuid={String(category.uuid || "")}
            type="productCategory"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function ProductCategoriesPageContent({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const t = useTranslations("admin.productCategories");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [localCategories, setLocalCategories] =
    useState<ProductCategory[]>(categories);

  // Sort categories by sort field
  const sortedCategories = useMemo(() => {
    return [...localCategories].sort((a, b) => a.sort - b.sort);
  }, [localCategories]);

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

    const oldIndex = sortedCategories.findIndex((c) => c.uuid === active.id);
    const newIndex = sortedCategories.findIndex((c) => c.uuid === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Update local state optimistically
    const reordered = [...sortedCategories];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    setLocalCategories(reordered);

    // Update sort on server
    try {
      const response = await fetch("/api/admin/product-categories/sort", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryUuid: active.id,
          newIndex,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to update sort");
      }

      // Update the category's sort value in local state
      setLocalCategories((prev) =>
        prev.map((c) =>
          c.uuid === active.id ? { ...c, sort: data.data.sort } : c,
        ),
      );
    } catch (error) {
      console.error("Failed to update sort:", error);
      // Revert on error
      setLocalCategories(categories);
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.title")}</TableHead>
                  <TableHead>{t("table.description")}</TableHead>
                  <TableHead>{t("table.createdAt")}</TableHead>
                  <TableHead>{t("table.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCategories.length > 0 ? (
                  <SortableContext
                    items={sortedCategories.map((c) => c.uuid)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sortedCategories.map((category) => (
                      <SortableRow
                        key={category.uuid}
                        category={category}
                        t={t}
                      />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
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
      </DndContext>

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
