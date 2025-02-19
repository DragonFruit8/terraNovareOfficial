import express from "express";
import {
  getAllProducts,
  updateProduct,
  addProduct,
  deleteProduct
} from "../controllers/admin.controller.js";
import { updateUserProfileByAdmin, updateAdminProfile } from "../controllers/admin.controller.js";
import { authenticateUser, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/update", authenticateUser, isAdmin, updateAdminProfile)

// ✅ Fetch all users
router.get("/users", authenticateUser, isAdmin);

// ✅ Admin update user profile
router.put("/users/:user_id", authenticateUser, isAdmin, updateUserProfileByAdmin);

// ✅ Get all products
router.get(
  "/products",
  authenticateUser,
  isAdmin,
  getAllProducts,
//   addProduct
);
// ✅ Add new product
router.post(
  "/products",
  authenticateUser,
  isAdmin,
  addProduct
);
// ✅ Update product (Ensure correct product ID)
router.put(
  "/products/:id",
  authenticateUser,
  isAdmin,
  updateProduct // 🛠️ Removed getProductById & addProduct
);
// ✅ Delete product
router.delete(
  "/products/:id",
  authenticateUser,
  isAdmin,
  deleteProduct
);

export default router;
