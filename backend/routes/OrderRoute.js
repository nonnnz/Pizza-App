import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/OrderController.js";

const router = Router();

router.get("/orders", verifyUser, adminOnly, getAllOrders);
router.get("/orders/:id", verifyUser, getOrderById);
router.post("/orders", verifyUser, createOrder);
router.put("/orders/:id", verifyUser, adminOnly, updateOrder);
router.delete("/orders/:id", verifyUser, adminOnly, deleteOrder);

export default router;