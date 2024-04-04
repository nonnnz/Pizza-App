import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import {
  getAllShoppingCarts,
  getShoppingCartById,
  createShoppingCart,
  updateShoppingCart,
  deleteShoppingCart,
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/ShoppingCartController.js";

const router = Router();

// shopping carts
router.get("/shopping-carts/all", verifyUser, getAllShoppingCarts);
router.get("/shopping-carts", verifyUser, getShoppingCartById);
router.post("/shopping-carts", verifyUser, createShoppingCart);
router.put("/shopping-carts/:id", verifyUser, updateShoppingCart);
router.delete("/shopping-carts/:id", verifyUser, deleteShoppingCart);

// cart items
router.get("/shopping-carts/cart-items", verifyUser, getCartItemsByCartId);
router.post("/shopping-carts/cart-items", verifyUser, createCartItem);
router.put("/shopping-carts/cart-items/:itemId", verifyUser, updateCartItem);
router.delete("/shopping-carts/cart-items/:itemId", verifyUser, deleteCartItem);

export default router;
