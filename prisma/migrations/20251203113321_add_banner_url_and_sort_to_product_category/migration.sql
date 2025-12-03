-- AlterTable
ALTER TABLE "product_categories" ADD COLUMN "banner_url" VARCHAR(255);

-- AlterTable
ALTER TABLE "product_categories" ADD COLUMN "sort" INTEGER NOT NULL DEFAULT 0;

