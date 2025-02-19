import express from "express";
import { getCart, addToCart, removeFromCart, decrementItem } from "../controllers/cart.controller.js";
import {authenticateUser} from "../middleware/auth.middleware.js"; // ✅ Import auth middleware

const router = express.Router();

router.get("/", authenticateUser, getCart); // 🔒 Secure the route
router.post("/add", authenticateUser, addToCart); // 🔒 Secure Add to Cart
router.delete("/delete", authenticateUser, removeFromCart); // 🔒 Secure Remove from Cart
router.put("/decrement", authenticateUser, decrementItem);

export default router;