import FormSlot from "@/components/dashboard/slots/form";
import { getUuid } from "@/lib/hash";
import {
  findProductByName,
  insertProduct,
  ProductStatus,
} from "@/models/product";
import { getProductCategories } from "@/models/product-category";
import type { Prisma } from "@/prisma/generated/prisma";
import type { Form as FormSlotType } from "@/types/slots/form";

export default async function AddProductPage() {
  const categories = await getProductCategories({
    page: 1,
    limit: 100,
  });

  const form: FormSlotType = {
    title: "Add Product",
    crumb: {
      items: [
        {
          title: "Products",
          url: "/admin/products",
        },
        {
          title: "Add Product",
          is_active: true,
        },
      ],
    },
    fields: [
      {
        name: "name",
        title: "Name",
        type: "text",
        placeholder: "",
        validation: {
          required: true,
        },
        tip: "product name should be unique",
      },
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
        name: "categoryUuid",
        title: "Category",
        type: "select",
        options: categories?.map((category) => ({
          title: category.title,
          value: category.uuid,
        })),
        value: "",
      },
      {
        name: "status",
        title: "Status",
        type: "select",
        options: Object.values(ProductStatus).map((status: string) => ({
          title: status,
          value: status,
        })),
        value: ProductStatus.Online,
        validation: {
          required: true,
        },
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
        name: "metadata",
        title: "Metadata",
        type: "key-value",
        placeholder: "添加键值对",
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

        const name = data.get("name") as string;
        const title = data.get("title") as string;
        const categoryUuid = data.get("categoryUuid") as string;
        const status = data.get("status") as string;
        const description = data.get("description") as string;
        const coverUrl = data.get("coverUrl") as string;
        const metadataStr = data.get("metadata") as string;

        if (
          !name ||
          !name.trim() ||
          !title ||
          !title.trim() ||
          !status ||
          !status.trim()
        ) {
          throw new Error("invalid form data");
        }

        const existProduct = await findProductByName(name);
        if (existProduct) {
          throw new Error("product with same name already exists");
        }

        let metadata: Prisma.InputJsonValue | undefined;
        if (metadataStr?.trim()) {
          try {
            metadata = JSON.parse(metadataStr);
          } catch {
            // if parse failed, ignore metadata
          }
        }

        const product = {
          uuid: getUuid(),
          createdAt: new Date(),
          status: status as ProductStatus,
          name,
          title,
          description: description || undefined,
          categoryUuid: categoryUuid || undefined,
          coverUrl: coverUrl || undefined,
          metadata,
        };

        try {
          await insertProduct(product);

          return {
            status: "success",
            message: "Product added",
            redirect_url: "/admin/products",
          };
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Unknown error");
        }
      },
    },
  };

  return <FormSlot {...form} />;
}
