-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "title" VARCHAR(255),
    "description" TEXT,
    "content" TEXT,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "status" VARCHAR(50),
    "cover_url" VARCHAR(255),
    "author_name" VARCHAR(255),
    "author_avatar_url" VARCHAR(255),
    "locale" VARCHAR(50),
    "category_uuid" VARCHAR(255),

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_uuid_key" ON "posts"("uuid");
