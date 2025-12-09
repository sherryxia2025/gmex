import { revalidateTag } from "next/cache";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import prisma from "@/prisma";
import { Prisma } from "@/prisma/generated/prisma";

type ProductCategory = {
  id: number;
  uuid: string;
  name: string;
  title: string;
  description: string | null;
  features: Prisma.JsonValue | null;
  coverUrl: string | null;
  bannerUrl: string | null;
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export async function insertProductCategory(data: {
  uuid: string;
  name: string;
  title: string;
  description?: string;
  features?: Prisma.InputJsonValue;
  coverUrl?: string;
  bannerUrl?: string;
  sort?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): Promise<ProductCategory> {
  const category = await prisma.productCategory.create({
    data: {
      uuid: data.uuid,
      name: data.name,
      title: data.title,
      description: data.description,
      features: data.features,
      coverUrl: data.coverUrl,
      bannerUrl: data.bannerUrl,
      sort: data.sort ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  });
  revalidateTag("product-categories");

  return category;
}

export async function updateProductCategory(
  uuid: string,
  data: {
    name?: string;
    title?: string;
    description?: string | null;
    features?: Prisma.InputJsonValue | null;
    coverUrl?: string | null;
    bannerUrl?: string | null;
    sort?: number;
    updatedAt?: Date;
  },
): Promise<ProductCategory> {
  const updateData: {
    name?: string;
    title?: string;
    description?: string | null;
    features?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    coverUrl?: string | null;
    bannerUrl?: string | null;
    sort?: number;
    updatedAt: Date;
  } = {
    updatedAt: data.updatedAt || new Date(),
  };

  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.title !== undefined) {
    updateData.title = data.title;
  }
  if (data.description !== undefined) {
    updateData.description = data.description || null;
  }
  if (data.features !== undefined) {
    updateData.features =
      data.features === null ? Prisma.JsonNull : data.features;
  }
  if (data.coverUrl !== undefined) {
    updateData.coverUrl = data.coverUrl || null;
  }
  if (data.bannerUrl !== undefined) {
    updateData.bannerUrl = data.bannerUrl || null;
  }
  if (data.sort !== undefined) {
    updateData.sort = data.sort;
  }

  const category = await prisma.productCategory.update({
    where: { uuid },
    data: updateData,
  });

  revalidateTag(`product-category-name:${data.name}`);
  revalidateTag(`product-category-id:${uuid}`);
  revalidateTag("product-categories");

  return category;
}

export async function findProductCategoryByName(
  name: string,
): Promise<ProductCategory | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`product-category-name:${name}`);

  const category = await prisma.productCategory.findFirst({
    where: {
      name,
    },
  });

  return category;
}

export async function findProductCategoryByUuid(
  uuid: string,
): Promise<ProductCategory | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`product-category-id:${uuid}`);
  const category = await prisma.productCategory.findUnique({
    where: { uuid },
  });

  return category;
}

export async function getProductCategories({
  page = 1,
  limit = 100,
}: {
  page?: number;
  limit?: number;
}): Promise<ProductCategory[]> {
  "use cache";
  cacheLife("days");
  cacheTag("product-categories");

  const offset = (page - 1) * limit;

  const data = await prisma.productCategory.findMany({
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getProductCategoriesTotal(): Promise<number> {
  "use cache";
  cacheLife("days");
  cacheTag("product-categories");

  const total = await prisma.productCategory.count();
  return total;
}

export async function deleteProductCategory(uuid: string): Promise<void> {
  await prisma.productCategory.delete({
    where: { uuid },
  });
  revalidateTag("product-categories");
}
