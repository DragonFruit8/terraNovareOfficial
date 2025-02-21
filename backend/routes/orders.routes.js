import express from "express";
import { getOrders, createOrder, getOrderDetails } from "../controllers/orders.controller.js";
import {authenticateUser} from "../middleware/auth.middleware.js"; // Ensure user is logged in

const router = express.Router();

// ✅ Fetch all orders for the logged-in user
router.get("/", authenticateUser, getOrders);
// ✅ Create a new order (Handled via Stripe webhook)
router.post("/", authenticateUser, createOrder);
// ✅ Fetch a single order with details
router.get("/:id", authenticateUser, getOrderDetails);

export default router;
