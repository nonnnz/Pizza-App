-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'KITCHEN', 'DELIVERY', 'MANAGER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "us_fname" TEXT NOT NULL,
    "us_lname" TEXT NOT NULL,
    "us_gender" TEXT NOT NULL,
    "us_role" "Role" NOT NULL DEFAULT 'USER',
    "us_phone" TEXT NOT NULL,
    "us_birthdate" TIMESTAMP(3) NOT NULL,
    "us_email" TEXT NOT NULL,
    "us_password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "pd_id" SERIAL NOT NULL,
    "pd_name" TEXT NOT NULL,
    "pd_price" DOUBLE PRECISION NOT NULL,
    "created_by_id" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("pd_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_us_email_key" ON "User"("us_email");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
