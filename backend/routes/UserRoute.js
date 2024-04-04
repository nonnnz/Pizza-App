import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = Router();

router.get("/users", verifyUser, adminOnly, getAllUsers);
router.get("/users/:id", verifyUser, getUserById);
router.post("/users", createUser);
router.put("/users/:id", verifyUser, updateUser);
router.delete("/users/:id", verifyUser, adminOnly, deleteUser);

export default router;
