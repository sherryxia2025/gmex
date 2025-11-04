-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_no" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_uuid" TEXT NOT NULL DEFAULT '',
    "user_email" TEXT NOT NULL DEFAULT '',
    "amount" INTEGER NOT NULL,
    "interval" VARCHAR(50),
    "expired_at" TIMESTAMP(3),
    "status" VARCHAR(50) NOT NULL,
    "stripe_session_id" TEXT,
    "credits" INTEGER NOT NULL,
    "currency" VARCHAR(50),
    "sub_id" TEXT,
    "sub_interval_count" INTEGER,
    "sub_cycle_anchor" INTEGER,
    "sub_period_end" INTEGER,
    "sub_period_start" INTEGER,
    "sub_times" INTEGER,
    "product_id" TEXT,
    "product_name" TEXT,
    "valid_months" INTEGER,
    "order_detail" TEXT,
    "paid_at" TIMESTAMP(3),
    "paid_email" TEXT,
    "paid_detail" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");
