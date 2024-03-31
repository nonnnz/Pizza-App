import { Router } from "express";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
import { getAllFoods, getFoodById, createFood, deleteFood, getAllPizzaWithDetailsAndFood, getPizzaById, createPizza, deletePizza} from "../controllers/FoodController.js";

const router = Router();

// Pizza Routes
router.post("/pizza", verifyUser, createPizza);
router.get("/pizza", getAllPizzaWithDetailsAndFood);
router.get("/pizza/:id", getPizzaById); // Example route for getting a specific pizza by ID
router.delete("/pizza/:id", verifyUser, adminOnly, deletePizza); // Example route for deleting a pizza by ID

// Food Routes
router.get("/food", getAllFoods);
router.get("/food/:id", getFoodById); // Example route for getting a specific food item by ID
router.post("/food", verifyUser, adminOnly, createFood);
router.delete("/food/:id", verifyUser, adminOnly, deleteFood); // Example route for deleting a food item by ID

export default router;