import prisma from "@/prisma";
import type { Prisma } from "@/prisma/generated/prisma";

export enum ProductStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

type Product = {
  id: number;
  uuid: string;
  name: string;
  title: string | null;
  description: string | null;
  categoryUuid: string | null;
  status: string | null;
  coverUrl: string | null;
  metadata: Prisma.JsonValue | null;
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export async function insertProduct(data: {
  uuid: string;
  name: string;
  title?: string;
  description?: string;
  categoryUuid?: string;
  status?: string;
  coverUrl?: string;
  metadata?: Prisma.InputJsonValue;
  sort?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): Promise<Product> {
  const product = await prisma.product.create({
    data: {
      uuid: data.uuid,
      name: data.name,
      title: data.title,
      description: data.description,
      categoryUuid: data.categoryUuid,
      status: data.status,
      coverUrl: data.coverUrl,
      metadata: data.metadata,
      sort: data.sort ?? 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  });

  return product;
}

export async function updateProduct(
  uuid: string,
  data: {
    name?: string;
    title?: string;
    description?: string;
    categoryUuid?: string;
    status?: string;
    coverUrl?: string;
    metadata?: Prisma.InputJsonValue;
    sort?: number;
    updatedAt?: Date;
  },
): Promise<Product> {
  const product = await prisma.product.update({
    where: { uuid },
    data: {
      name: data.name,
      title: data.title,
      description: data.description,
      categoryUuid: data.categoryUuid,
      status: data.status,
      coverUrl: data.coverUrl,
      metadata: data.metadata,
      sort: data.sort,
      updatedAt: data.updatedAt,
    },
  });

  return product;
}

export async function findProductByUuid(uuid: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { uuid },
    include: {
      category: true,
    },
  });

  return product;
}

export async function findProductByName(name: string): Promise<Product | null> {
  const product = await prisma.product.findFirst({
    where: {
      name,
      status: ProductStatus.Online,
    },
  });

  return product;
}

export async function getProducts({
  status,
  categoryUuid,
  page = 1,
  limit = 10,
}: {
  status?: ProductStatus;
  categoryUuid?: string;
  page?: number;
  limit?: number;
}): Promise<Product[]> {
  const offset = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};
  if (status) {
    where.status = status;
  }
  if (categoryUuid) {
    where.categoryUuid = categoryUuid;
  }

  const data = await prisma.product.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: [{ sort: "asc" }, { createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getProductsTotal({
  status,
  categoryUuid,
}: {
  status?: ProductStatus;
  categoryUuid?: string;
}): Promise<number> {
  const where: Prisma.ProductWhereInput = {};
  if (status) {
    where.status = status;
  }
  if (categoryUuid) {
    where.categoryUuid = categoryUuid;
  }

  const total = await prisma.product.count({
    where,
  });

  return total;
}
