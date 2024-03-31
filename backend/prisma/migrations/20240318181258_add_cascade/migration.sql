-- DropForeignKey
ALTER TABLE "AddressBook" DROP CONSTRAINT "AddressBook_addb_user_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cart_shoppingcart_id_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartit_food_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingCart" DROP CONSTRAINT "ShoppingCart_cart_user_id_fkey";

-- AddForeignKey
ALTER TABLE "AddressBook" ADD CONSTRAINT "AddressBook_addb_user_id_fkey" FOREIGN KEY ("addb_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingCart" ADD CONSTRAINT "ShoppingCart_cart_user_id_fkey" FOREIGN KEY ("cart_user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_shoppingcart_id_fkey" FOREIGN KEY ("cart_shoppingcart_id") REFERENCES "ShoppingCart"("cart_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartit_food_id_fkey" FOREIGN KEY ("cartit_food_id") REFERENCES "Food"("fd_id") ON DELETE CASCADE ON UPDATE CASCADE;
