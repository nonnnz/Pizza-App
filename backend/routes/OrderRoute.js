import { Router } from "express";
import { verifyUser, adminOnly, empolyeeOnly } from "../middleware/AuthUser.js";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/OrderController.js";

const router = Router();

router.get("/orders", verifyUser, empolyeeOnly, getAllOrders);
router.get("/orders/:id", verifyUser, getOrderById);
router.post("/orders", verifyUser, createOrder);
router.put("/orders/:id", verifyUser, empolyeeOnly, updateOrder);
router.delete("/orders/:id", verifyUser, empolyeeOnly, deleteOrder);

export default router;