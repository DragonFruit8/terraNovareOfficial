import express from "express";
import { 
    getProducts, 
    addProduct, 
    requestProduct, 
    deleteAllProductRequests, 
    getAllProductRequests,
    updateProduct,
    getAllProducts,
    updateProductRequest,
    updateRequestQuantity,
    deleteProduct
 } from "../controllers/product.controller.js";
import { sendProductRequestEmail } from "../controllers/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js"; // ✅ Ensure authentication

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/products", authenticateUser, getAllProducts);
router.get("/requests/all", authenticateUser, getAllProductRequests);
router.post("/add", addProduct);
router.post("/request", authenticateUser, requestProduct);
router.post("/product-request", sendProductRequestEmail);
router.put("/requests/update/:id", authenticateUser, updateProductRequest);
router.put("/requests/update-quantity/:id", authenticateUser, updateRequestQuantity);
router.put("/admin/products/:product_id", authenticateUser, updateProduct);
router.delete("/products/:id", authenticateUser, deleteProduct);
router.delete("/requests/delete-all", authenticateUser, deleteAllProductRequests);

export default router;
