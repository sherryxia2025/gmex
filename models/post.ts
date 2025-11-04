import prisma from "@/prisma";

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

type Post = {
  id: number;
  uuid: string;
  slug: string | null;
  title: string | null;
  description: string | null;
  content: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  status: string | null;
  coverUrl: string | null;
  authorName: string | null;
  authorAvatarUrl: string | null;
  locale: string | null;
  categoryUuid: string | null;
};

export async function insertPost(data: {
  uuid: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  coverUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  locale?: string;
  categoryUuid?: string;
}): Promise<Post> {
  const post = await prisma.post.create({
    data: {
      uuid: data.uuid,
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      status: data.status,
      coverUrl: data.coverUrl,
      authorName: data.authorName,
      authorAvatarUrl: data.authorAvatarUrl,
      locale: data.locale,
      categoryUuid: data.categoryUuid,
    },
  });

  return post;
}

export async function updatePost(
  uuid: string,
  data: {
    slug?: string;
    title?: string;
    description?: string;
    content?: string;
    updatedAt?: Date;
    status?: string;
    coverUrl?: string;
    authorName?: string;
    authorAvatarUrl?: string;
    locale?: string;
    categoryUuid?: string;
  },
): Promise<Post> {
  const post = await prisma.post.update({
    where: { uuid },
    data: {
      slug: data.slug,
      title: data.title,
      description: data.description,
      content: data.content,
      updatedAt: data.updatedAt,
      status: data.status,
      coverUrl: data.coverUrl,
      authorName: data.authorName,
      authorAvatarUrl: data.authorAvatarUrl,
      locale: data.locale,
      categoryUuid: data.categoryUuid,
    },
  });

  return post;
}

export async function findPostByUuid(uuid: string): Promise<Post | null> {
  const post = await prisma.post.findUnique({
    where: { uuid },
  });

  return post;
}

export async function findPostBySlug(
  slug: string,
  locale: string,
): Promise<Post | null> {
  slug = decodeURIComponent(slug);
  const post = await prisma.post.findFirst({
    where: {
      slug,
      OR: [{ locale }, { locale: "all" }],
    },
  });

  return post;
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50,
  status?: PostStatus,
): Promise<Post[]> {
  const offset = (page - 1) * limit;

  const whereClause = status ? { status } : {};

  const data = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50,
): Promise<Post[]> {
  const offset = (page - 1) * limit;

  const data = await prisma.post.findMany({
    where: {
      OR: [{ locale }, { locale: "all" }],
      status: PostStatus.Online,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getPostsByLocaleWithPagination(
  locale: string,
  page: number = 1,
  limit: number = 50,
): Promise<{
  posts: Post[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
}> {
  const offset = (page - 1) * limit;

  // Get total count
  const total = await prisma.post.count({
    where: {
      OR: [{ locale }, { locale: "all" }],
      status: PostStatus.Online,
    },
  });

  // Get posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ locale }, { locale: "all" }],
      status: PostStatus.Online,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const hasNextPage = offset + limit < total;
  const hasPrevPage = page > 1;

  return {
    posts,
    hasNextPage,
    hasPrevPage,
    total,
  };
}

export async function getPostsByLocaleAndCategory(
  locale: string,
  categoryUuid: string,
  page: number = 1,
  limit: number = 50,
): Promise<Post[]> {
  const offset = (page - 1) * limit;

  const data = await prisma.post.findMany({
    where: {
      OR: [{ locale }, { locale: "all" }],
      status: PostStatus.Online,
      categoryUuid,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  return data;
}

export async function getPostsTotal(): Promise<number> {
  const total = await prisma.post.count();

  return total;
}

export async function deletePost(uuid: string): Promise<void> {
  await prisma.post.delete({
    where: { uuid },
  });
}
