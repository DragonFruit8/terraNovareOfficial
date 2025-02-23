import express from "express";
import { getProducts, addProduct, requestProduct } from "../controllers/product.controller.js";
import {sendProductRequestEmail} from "../controllers/user.controller.js";
import pool from "../config/db.js"; // ✅ Import your database connection


const router = express.Router();

router.get("/", getProducts);
router.post("/add", addProduct);
router.post("/request", requestProduct);
router.post("/product-request", sendProductRequestEmail);

// ✅ New route to fetch user's requested products
router.get("/requested", async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const requestedProducts = await pool.query(
            "SELECT product_id FROM product_requests WHERE user_email = $1",
            [email]
        );

        console.log("✅ Requested Products Found:", requestedProducts.rows);
        res.json(requestedProducts.rows); // Make sure to send only the rows
    } catch (error) {
        console.error("❌ Error fetching requested products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;
