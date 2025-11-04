import prisma from "@/prisma";

export enum CategoryStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

type Category = {
  id: number;
  uuid: string;
  name: string;
  title: string;
  description: string | null;
  status: string | null;
  sort: number;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export async function insertCategory(data: {
  uuid: string;
  name: string;
  title: string;
  description?: string;
  status?: string;
  sort?: number;
  createdAt?: Date;
  updatedAt?: Date;
}): Promise<Category> {
  const category = await prisma.category.create({
    data: {
      uuid: data.uuid,
      name: data.name,
      title: data.title,
      description: data.description,
      status: data.status,
      sort: data.sort || 0,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    },
  });

  return category;
}

export async function updateCategory(
  uuid: string,
  data: {
    name?: string;
    title?: string;
    description?: string;
    status?: string;
    sort?: number;
    updatedAt?: Date;
  },
): Promise<Category> {
  const category = await prisma.category.update({
    where: { uuid },
    data: {
      name: data.name,
      title: data.title,
      description: data.description,
      status: data.status,
      sort: data.sort,
      updatedAt: data.updatedAt,
    },
  });

  return category;
}

export async function findCategoryByName(
  name: string,
): Promise<Category | null> {
  const category = await prisma.category.findFirst({
    where: {
      name,
      status: CategoryStatus.Online,
    },
  });

  return category;
}

export async function findCategoryByUuid(
  uuid: string,
): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { uuid },
  });

  return category;
}

export async function getCategories({
  status,
  page = 1,
  limit = 10,
}: {
  status?: CategoryStatus;
  page?: number;
  limit?: number;
}): Promise<Category[]> {
  const offset = (page - 1) * limit;

  const data = await prisma.category.findMany({
    where: status ? { status } : undefined,
    orderBy: [{ sort: "desc" }, { createdAt: "desc" }],
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getCategoriesTotal({
  status,
}: {
  status?: CategoryStatus;
}): Promise<number> {
  const total = await prisma.category.count({
    where: status ? { status } : undefined,
  });

  return total;
}
