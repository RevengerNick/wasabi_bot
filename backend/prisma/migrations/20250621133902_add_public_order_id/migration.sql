/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "public_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_public_id_key" ON "Order"("public_id");
