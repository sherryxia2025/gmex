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
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  });

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
    updatedAt?: Date;
  },
): Promise<ProductCategory> {
  const updateData: {
    name?: string;
    title?: string;
    description?: string | null;
    features?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
    coverUrl?: string | null;
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

  const category = await prisma.productCategory.update({
    where: { uuid },
    data: updateData,
  });

  return category;
}

export async function findProductCategoryByName(
  name: string,
): Promise<ProductCategory | null> {
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
  const offset = (page - 1) * limit;

  const data = await prisma.productCategory.findMany({
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getProductCategoriesTotal(): Promise<number> {
  const total = await prisma.productCategory.count();
  return total;
}

export async function deleteProductCategory(uuid: string): Promise<void> {
  await prisma.productCategory.delete({
    where: { uuid },
  });
}
