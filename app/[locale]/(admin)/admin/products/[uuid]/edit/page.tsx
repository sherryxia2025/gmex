import Empty from "@/components/blocks/empty";
import FormSlot from "@/components/dashboard/slots/form";
import {
  findProductByName,
  findProductByUuid,
  ProductStatus,
  updateProduct,
} from "@/models/product";
import { getProductCategories } from "@/models/product-category";
import type { Prisma } from "@/prisma/generated/prisma";
import type { Form as FormSlotType } from "@/types/slots/form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;

  const product = await findProductByUuid(uuid);
  if (!product) {
    return <Empty message="product not found" />;
  }

  const categories = await getProductCategories({
    page: 1,
    limit: 100,
  });

  const form: FormSlotType = {
    title: "Edit Product",
    crumb: {
      items: [
        {
          title: "Products",
          url: "/admin/products",
        },
        {
          title: "Edit Product",
          is_active: true,
        },
      ],
    },
    data: {
      ...product,
      metadata: product.metadata ? JSON.stringify(product.metadata) : "",
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
        value: product.categoryUuid || "",
      },
      {
        name: "status",
        title: "Status",
        type: "select",
        options: Object.values(ProductStatus).map((status: string) => ({
          title: status,
          value: status,
        })),
        value: product.status || ProductStatus.Created,
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
        name: "sort",
        title: "Sort",
        type: "number",
        placeholder: "0",
        tip: "Lower numbers appear first",
        value: (product.sort ?? 0).toString(),
      },
      {
        name: "metadata",
        title: "Metadata",
        type: "key-value",
        placeholder: "添加键值对",
        value: product.metadata ? JSON.stringify(product.metadata) : "",
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
        const sortStr = data.get("sort") as string;
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
        if (existProduct && existProduct.uuid !== uuid) {
          throw new Error("product with same name already exists");
        }

        let metadata: Prisma.InputJsonValue | undefined;
        if (metadataStr?.trim()) {
          try {
            metadata = JSON.parse(metadataStr);
          } catch {
            // 如果解析失败，忽略 metadata
          }
        }

        const sort = sortStr ? Number.parseInt(sortStr, 10) : 0;

        const product = {
          name,
          title,
          status: status as ProductStatus,
          description: description || undefined,
          categoryUuid: categoryUuid || undefined,
          coverUrl: coverUrl || undefined,
          sort: Number.isNaN(sort) ? 0 : sort,
          metadata,
        };

        try {
          await updateProduct(uuid, product);

          return {
            status: "success",
            message: "Product updated",
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
