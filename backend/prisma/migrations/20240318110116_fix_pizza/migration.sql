/*
  Warnings:

  - Changed the type of `pz_qty` on the `Pizza` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pizza" ALTER COLUMN "pz_des" SET DATA TYPE TEXT,
DROP COLUMN "pz_qty",
ADD COLUMN     "pz_qty" INTEGER NOT NULL;
