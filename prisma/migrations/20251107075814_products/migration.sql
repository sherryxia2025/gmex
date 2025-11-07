-- CreateTable
CREATE TABLE "product_categories" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "features" JSONB,
    "cover_url" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "uuid" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "category_uuid" VARCHAR(255),
    "price" DOUBLE PRECISION,
    "status" VARCHAR(50),
    "cover_url" VARCHAR(255),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_uuid_key" ON "product_categories"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_name_key" ON "product_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_uuid_key" ON "products"("uuid");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_uuid_fkey" FOREIGN KEY ("category_uuid") REFERENCES "product_categories"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
