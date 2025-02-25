import express from "express";
import { getProducts, addProduct, requestProduct, deleteAllProductRequests } from "../controllers/product.controller.js";
import { sendProductRequestEmail } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js"; // ✅ Ensure authentication

const router = express.Router();

router.get("/", getProducts);
router.post("/add", addProduct);
router.post("/request", authenticateUser, requestProduct);
router.post("/product-request", sendProductRequestEmail);
router.delete("/request/delete-all", authenticateUser, deleteAllProductRequests);

export default router;
