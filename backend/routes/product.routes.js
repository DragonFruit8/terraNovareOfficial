import express from "express";
import {
  getProducts,
  getAllProducts,
  addProduct,
  getAllProductRequests,
  getProductRequests,
  requestProduct,
  updateProductRequest,
  updateRequestQuantity,
  updateProduct,
  deleteProduct,
  deleteAllProductRequests,
  deleteProductRequest
} from "../controllers/product.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js"; 
import { sendProductRequestEmail } from "../services/email.service.js";

const router = express.Router();

// ✅ Fetch all products
router.get("/", getProducts);
router.get("/admin/products", authenticateUser, getAllProducts);

// ✅ Fetch all product requests (Admin)
router.get("/requests", getProductRequests); 

// ✅ Fetch requested products for users
router.get("/requested", getAllProductRequests); 

// ✅ Request a product (POST)
router.post("/request", authenticateUser, requestProduct, sendProductRequestEmail); 

// ✅ Add a new product (Admin)
router.post("/add", authenticateUser, addProduct); 

// ✅ Update product requests
router.put("/requests/update/:id", authenticateUser, updateProductRequest);
router.put("/requests/update-quantity/:id", authenticateUser, updateRequestQuantity);

// ✅ Update an admin product
router.put("/admin/products/:product_id", authenticateUser, updateProduct);

// ✅ Delete requests/products
router.delete("/products/:id", authenticateUser, deleteProduct);
router.delete("/requests/delete-all", authenticateUser, deleteAllProductRequests);
router.delete("/requests/:id", authenticateUser, deleteProductRequest);

export default router;
