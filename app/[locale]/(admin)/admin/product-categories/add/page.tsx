import FormSlot from "@/components/dashboard/slots/form";
import { getUuid } from "@/lib/hash";
import {
  findProductCategoryByName,
  insertProductCategory,
} from "@/models/product-category";
import type { Form as FormSlotType } from "@/types/slots/form";

export default async function AddProductCategoryPage() {
  const form: FormSlotType = {
    title: "Add Product Category",
    crumb: {
      items: [
        {
          title: "Product Categories",
          url: "/admin/product-categories",
        },
        {
          title: "Add Product Category",
          is_active: true,
        },
      ],
    },
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
      },
      {
        name: "features",
        title: "Features",
        type: "textarea",
        placeholder: "Enter one feature per line",
        tip: "Enter one feature per line, each line will be a feature item",
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
        if (existCategory) {
          throw new Error("category with same name already exists");
        }

        let features: string[] | undefined;
        if (featuresStr?.trim()) {
          features = featuresStr
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        }

        const sort = sortStr ? Number.parseInt(sortStr, 10) : 0;

        const category = {
          uuid: getUuid(),
          createdAt: new Date(),
          title,
          name: trimmedName,
          description: description || undefined,
          coverUrl: coverUrl || undefined,
          bannerUrl: bannerUrl || undefined,
          sort: Number.isNaN(sort) ? 0 : sort,
          features,
        };

        try {
          await insertProductCategory(category);

          return {
            status: "success",
            message: "Product category added",
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
