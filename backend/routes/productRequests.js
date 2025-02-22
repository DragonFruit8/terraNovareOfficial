import express from "express";
import pool from "../db.js";
import { sendProductRequestEmail } from "../utils/email.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { product_id, user_email, product } = req.body;

  try {
    // ✅ Check if this product request already exists for the user
    const existingRequest = await  pool.query(`
      SELECT * FROM product_requests WHERE product = ${product} AND user_email = ${user_email}
    `,[    ]);

    if (existingRequest.length > 0) {
      return res.status(400).json({ error: "You have already requested this product." });
    }

    // ✅ Insert new product request
    const newRequest = await  pool.query(`
      INSERT INTO product_requests (product_id, user_email, product) 
      VALUES (${product_id || null}, ${user_email}, ${product}) 
      RETURNING *
    `,[    ]);

    // ✅ Send confirmation email
    await sendProductRequestEmail(user_email, product);

    res.json({ message: "Product request submitted successfully!", request: newRequest[0] });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
