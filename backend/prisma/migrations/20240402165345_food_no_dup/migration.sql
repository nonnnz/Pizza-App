/*
  Warnings:

  - A unique constraint covering the columns `[fd_name]` on the table `Food` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pizza" ALTER COLUMN "pz_image" SET DEFAULT 'pizza/not-found.png';

-- CreateIndex
CREATE UNIQUE INDEX "Food_fd_name_key" ON "Food"("fd_name");
