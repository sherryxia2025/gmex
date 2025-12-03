import Empty from "@/components/blocks/empty";
import FormSlot from "@/components/dashboard/slots/form";
import {
  findProductCategoryByName,
  findProductCategoryByUuid,
  updateProductCategory,
} from "@/models/product-category";
import type { Form as FormSlotType } from "@/types/slots/form";

export default async function EditProductCategoryPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const category = await findProductCategoryByUuid(uuid);
  if (!category) {
    return <Empty message="product category not found" />;
  }

  const form: FormSlotType = {
    title: "Edit Product Category",
    crumb: {
      items: [
        {
          title: "Product Categories",
          url: "/admin/product-categories",
        },
        {
          title: "Edit Product Category",
          is_active: true,
        },
      ],
    },
    data: category,
    fields: [
      {
        name: "title",
        title: "Title",
        type: "text",
        placeholder: "",
        validation: {
          required: true,
        },
      },
      {
        name: "name",
        title: "Name",
        type: "text",
        placeholder: "",
        validation: {
          required: true,
        },
        tip: "category name should be unique and follow slug format (lowercase letters, numbers, and hyphens only, no spaces or special characters)",
      },
      {
        name: "description",
        title: "Description",
        type: "textarea",
        placeholder: "",
      },
      {
        name: "coverUrl",
        title: "Cover URL",
        type: "image-url",
        placeholder: "Enter cover image URL...",
      },
      {
        name: "bannerUrl",
        title: "Banner URL",
        type: "image-url",
        placeholder: "Enter banner image URL...",
      },
      {
        name: "sort",
        title: "Sort",
        type: "number",
        placeholder: "0",
        tip: "Lower numbers appear first",
        value: (category.sort ?? 0).toString(),
      },
      {
        name: "features",
        title: "Features",
        type: "textarea",
        placeholder: "Enter one feature per line",
        tip: "Enter one feature per line, each line will be a feature item",
        value:
          category.features && Array.isArray(category.features)
            ? (category.features as string[]).join("\n")
            : "",
      },
    ],
    submit: {
      button: {
        title: "Submit",
      },
      aiButtons: [
        {
          title: "Generate Cover Image",
          type: "generate-image",
          targetField: "coverUrl",
          variant: "outline",
        },
      ],
      handler: async (data: FormData) => {
        "use server";

        const title = data.get("title") as string;
        const name = data.get("name") as string;
        const description = data.get("description") as string;
        const coverUrl = data.get("coverUrl") as string;
        const bannerUrl = data.get("bannerUrl") as string;
        const sortStr = data.get("sort") as string;
        const featuresStr = data.get("features") as string;

        if (!title || !title.trim() || !name || !name.trim()) {
          throw new Error("invalid form data");
        }

        // Validate slug format: lowercase letters, numbers, and hyphens only
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        const trimmedName = name.trim();
        if (!slugRegex.test(trimmedName)) {
          throw new Error(
            "Name must be a valid slug: lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen, and cannot have consecutive hyphens.",
          );
        }

        const existCategory = await findProductCategoryByName(trimmedName);
        if (existCategory && existCategory.uuid !== uuid) {
          throw new Error("category with same name already exists");
        }

        let features: string[] | null | undefined;
        if (featuresStr?.trim()) {
          features = featuresStr
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        } else {
          features = null; // 清空 features
        }

        const sort = sortStr ? Number.parseInt(sortStr, 10) : 0;

        const category = {
          title,
          name: trimmedName,
          description: description?.trim() || null,
          coverUrl: coverUrl?.trim() || null,
          bannerUrl: bannerUrl?.trim() || null,
          sort: Number.isNaN(sort) ? 0 : sort,
          features,
        };

        try {
          await updateProductCategory(uuid, category);

          return {
            status: "success",
            message: "Product category updated",
            redirect_url: "/admin/product-categories",
          };
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Unknown error");
        }
      },
    },
  };

  return <FormSlot {...form} />;
}
