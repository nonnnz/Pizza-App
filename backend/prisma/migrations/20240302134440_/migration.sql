/*
  Warnings:

  - Added the required column `us_fname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "us_fname" TEXT NOT NULL;
