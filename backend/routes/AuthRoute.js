import { Router } from "express";
import { Login, logout, Me } from "../controllers/AuthController.js";

const router = Router();

router.get("/me", Me);
router.post("/login", Login);
router.delete("/logout", logout);

export default router;
