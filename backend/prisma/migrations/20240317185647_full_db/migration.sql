/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `us_fullname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'INPROGRESS', 'OUTFORDELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PayMethod" AS ENUM ('CASH', 'CREDITCARD');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_created_by_id_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "us_fullname" TEXT NOT NULL;

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "AddressBook" (
    "addb_id" SERIAL NOT NULL,
    "addb_user_id" TEXT NOT NULL,
    "addb_buildingNo" TEXT NOT NULL,
    "addb_buildingName" TEXT NOT NULL,
    "addb_street" TEXT NOT NULL,
    "addb_prov" TEXT NOT NULL,
    "addb_dist" TEXT NOT NULL,
    "addb_subdist" TEXT NOT NULL,
    "addb_zipcode" TEXT NOT NULL,
    "addb_directionguide" TEXT NOT NULL DEFAULT '',
    "addb_phone" TEXT NOT NULL,
    "addb_name" TEXT NOT NULL,

    CONSTRAINT "AddressBook_pkey" PRIMARY KEY ("addb_id")
);

-- CreateTable
CREATE TABLE "ShoppingCart" (
    "cart_id" SERIAL NOT NULL,
    "cart_user_id" TEXT NOT NULL,
    "cart_total" DOUBLE PRECISION NOT NULL,
    "cart_active" BOOLEAN NOT NULL,

    CONSTRAINT "ShoppingCart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "cart_itemid" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cartit_total" DOUBLE PRECISION NOT NULL,
    "cart_shoppingcart_id" INTEGER NOT NULL,
    "cartit_food_id" INTEGER NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("cart_shoppingcart_id","cartit_food_id")
);

-- CreateTable
CREATE TABLE "Food" (
    "fd_id" SERIAL NOT NULL,
    "fd_name" TEXT NOT NULL,
    "fd_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("fd_id")
);

-- CreateTable
CREATE TABLE "PizzaDetail" (
    "pd_id" SERIAL NOT NULL,
    "size_name" TEXT NOT NULL,
    "crust_name" TEXT NOT NULL,
    "fd_id" INTEGER NOT NULL,
    "pz_id" INTEGER NOT NULL,

    CONSTRAINT "PizzaDetail_pkey" PRIMARY KEY ("pd_id")
);

-- CreateTable
CREATE TABLE "Pizza" (
    "pz_id" SERIAL NOT NULL,
    "pz_name" TEXT NOT NULL,
    "pz_des" DOUBLE PRECISION NOT NULL,
    "pz_qty" TEXT NOT NULL,
    "pz_image" TEXT NOT NULL DEFAULT 'pizza
ot-found.png',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pizza_pkey" PRIMARY KEY ("pz_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "deli_charge" DOUBLE PRECISION NOT NULL,
    "order_total" DOUBLE PRECISION NOT NULL,
    "deli_address" TEXT NOT NULL,
    "pay_method" "PayMethod" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "order_itemid" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderit_total" DOUBLE PRECISION NOT NULL,
    "order_order_id" INTEGER NOT NULL,
    "orderit_food_id" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("order_order_id","orderit_food_id")
);

-- AddForeignKey
ALTER TABLE "AddressBook" ADD CONSTRAINT "AddressBook_addb_user_id_fkey" FOREIGN KEY ("addb_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_cart_user_id_fkey" FOREIGN KEY ("cart_user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_shoppingcart_id_fkey" FOREIGN KEY ("cart_shoppingcart_id") REFERENCES "ShoppingCart"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartit_food_id_fkey" FOREIGN KEY ("cartit_food_id") REFERENCES "Food"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaDetail" ADD CONSTRAINT "PizzaDetail_fd_id_fkey" FOREIGN KEY ("fd_id") REFERENCES "Food"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PizzaDetail" ADD CONSTRAINT "PizzaDetail_pz_id_fkey" FOREIGN KEY ("pz_id") REFERENCES "Pizza"("pz_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_order_id_fkey" FOREIGN KEY ("order_order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderit_food_id_fkey" FOREIGN KEY ("orderit_food_id") REFERENCES "Food"("fd_id") ON DELETE RESTRICT ON UPDATE CASCADE;
