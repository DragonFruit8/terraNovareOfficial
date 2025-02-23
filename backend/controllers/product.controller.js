import pool from "../db.js";
import slugify from "slugify";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import jwt from "jsonwebtoken"
// import { sendProductRequestEmail } from "../utils/email.js"; // ✅ For confirmation emails

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    await pool.query(`SET plan_cache_mode = force_generic_plan;`); // Force query replanning

    const products = await pool.query(
      `SELECT product_id, image_url, name, price, stock FROM products`
    );

    res.json(products.rows);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, price, stock } = req.body;

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Name, price, and stock are required" });
    }

    // ✅ Force PostgreSQL to refresh the query plan
    await pool.query(`SET plan_cache_mode = force_generic_plan;`);

    // ✅ Update product details
    const updatedProduct = await pool.query(
      `UPDATE products
       SET name = $1, price = $2, stock = $3
       WHERE product_id = $4
       RETURNING product_id, name, price, stock;`,
      [name, price, stock, product_id]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product updated:", updatedProduct.rows[0]);
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DUPLICATE CODE
// ✅ Add New Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, slug, stock, description } = req.body;
    
    // Create the product in Stripe
    const stripeProduct = await stripe.products.create({ name });
    const stripeProductId = stripeProduct.id;

    // Create the price in Stripe for this product (price in cents)
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // converting dollars to cents
      currency: "usd",
      product: stripeProductId
    });
    const stripePriceId = stripePrice.id;

    // Helper function to generate a slug from the product name
    const generateSlug = (name) => {
      return name.toLowerCase().trim().replace(/\s+/g, '-');
    };

    // Use the provided slug or generate one if not provided
    const finalSlug = slug || generateSlug(name);
    
    // Insert the new product into the DB, now including valid stripe_product_id and stripe_price_id
    const result = await pool.query(`
      INSERT INTO products(name, slug, price, stock, stripe_product_id, stripe_price_id, description)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [name, finalSlug, price, stock, stripeProductId, stripePriceId, description]);
    
    res.status(201).json(result.rows[0]);
    
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};




// ✅ Request a product (Users can request a product)
export const requestProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
      console.error("❌ No authentication token provided.");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔑 Decoded Token:", decoded);

      const user_id = decoded.user_id;  
      const user_email = decoded.email; 

      if (!user_id || !user_email) {
          console.error("❌ Missing user ID or email:", decoded);
          return res.status(400).json({ error: "User ID and email are required." });
      }

      const { product_id } = req.body;
      if (!product_id) {
          console.error("❌ Missing required field: product_id");
          return res.status(400).json({ error: "Product ID is required." });
      }

      console.log("📩 Processing request for product:", product_id, "by user:", user_id, user_email);

      // ✅ Fetch product name before inserting
      const productQuery = await pool.query(
          "SELECT name FROM products WHERE product_id = $1",
          [product_id]
      );

      if (productQuery.rows.length === 0) {
          return res.status(404).json({ error: "Product not found." });
      }

      const product_name = productQuery.rows[0].name;

      // ✅ Insert `product` (product name) in the request
      const newRequest = await pool.query(
          `INSERT INTO product_requests (product_id, user_id, user_email, product, requested_at) 
           VALUES ($1, $2, $3, $4, NOW())
           RETURNING *;`,
          [product_id, user_id, user_email, product_name]
      );

      console.log("✅ Product request saved:", newRequest.rows[0]);
      res.status(201).json({ message: "Product request submitted successfully!", request: newRequest.rows[0] });

  } catch (error) {
      console.error("❌ Error processing product request:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
