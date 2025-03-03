import slugify from "slugify"; // ✅ Import slugify package
import Stripe from 'stripe';
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


import pool from "../config/db.js";

const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
};

// ✅ Fetch All Products (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await pool.query(
      `SELECT product_id, name, slug, price, description, stock, is_presale, image_url, release_date, stripe_product_id, stripe_price_id
       FROM products`
    );

    // console.log("✅ Fetched all products:", products.rows);
    res.json(products.rows);
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Update User Profile (Admin)
export const updateUserProfileByAdmin = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { fullname, email, roles } = req.body;

    if (!fullname || !email || !roles) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const updatedUser = await pool.query(
      `UPDATE users
       SET fullname = $1, email = $2, roles = $3
       WHERE user_id = $4
       RETURNING user_id, fullname, email, roles;`,
      [fullname, email.toLowerCase(), roles, user_id]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error("❌ Error updating user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { fullname, address, city, state, country } = req.body;

    const updatedUser = await pool.query(
      `UPDATE users
       SET 
         fullname = $1, 
         address = $2, 
         city = $3, 
         state = $4, 
         country = $5
       WHERE user_id = $6
       RETURNING user_id, fullname, address, city, state, country;`,
      [fullname, address, city, state, country, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Add New Product
// Helper function to generate a slug from the product name
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      stock,
      description,
      image_url,
      is_presale,
      release_date,
      slug
    } = req.body;

    // Ensure required fields are present
    if (!name || !price || !stock || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create the product in Stripe
    const stripeProduct = await stripe.products.create({
      name,
      images: image_url ? [image_url] : [], // Include image if available
    });
    const stripeProductId = stripeProduct.id;

    // Create the price in Stripe (Stripe requires price in cents)
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert dollars to cents
      currency: "usd",
      product: stripeProductId,
    });
    const stripePriceId = stripePrice.id;

    // Helper function to generate a slug from the product name
    const generateSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, "-");

    // Use provided slug or generate one if not provided
    const finalSlug = slug || generateSlug(name);

    // Convert release_date to proper format (or set to NULL)
    const formattedReleaseDate = release_date ? new Date(release_date).toISOString() : null;

    // Insert the new product into the database
    const result = await pool.query(
      `
      INSERT INTO products (name, slug, price, stock, description, image_url, is_presale, release_date, stripe_product_id, stripe_price_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
      `,
      [
        name,
        finalSlug,
        price,
        stock,
        description,
        image_url,
        is_presale,
        formattedReleaseDate,
        stripeProductId,
        stripePriceId,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;

    // ✅ Fetch product by ID
    const product = await pool.query(
      `SELECT * FROM products WHERE product_id = $1`, 
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // console.log("✅ Product Fetched:", product.rows[0]);
    res.json(product.rows[0]);
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, slug, price, stock, is_presale, release_date, image_url, description, stripe_product_id, stripe_price_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    // console.log("🔍 Updating Product:", { product_id, name, price, stock, is_presale, release_date, description, image_url, stripe_product_id, stripe_price_id });

    const formattedReleaseDate = release_date ? new Date(release_date).toISOString() : null;

    const updatedProduct = await pool.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           stock = COALESCE($3, stock),
           description = COALESCE($4, description),
           image_url = COALESCE($5, image_url),
           stripe_product_id = COALESCE($6, stripe_product_id),
           stripe_price_id = COALESCE($7, stripe_price_id),
           is_presale = COALESCE($8, is_presale),
           release_date = COALESCE($9, release_date)
       WHERE product_id = $10
       RETURNING *`, // ✅ Ensure updated product is returned
      [name, price, stock, description, image_url, stripe_product_id, stripe_price_id, is_presale, formattedReleaseDate, product_id]
    );

    if (updatedProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // console.log("✅ Product updated:", updatedProduct.rows[0]);
    res.json({ message: "Product updated successfully!", product: updatedProduct.rows[0] });
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    // console.log("🔍 Deleting product with ID:", product_id);

    // ✅ Check if product exists
    const productExists = await pool.query(
      `SELECT 1 FROM products WHERE product_id = $1`,
      [product_id]
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // ✅ Delete the product
    await pool.query(
      `DELETE FROM products WHERE product_id = $1`,
      [product_id]
    );

    // console.log(`✅ Product with ID ${product_id} deleted.`);
    res.json({ message: "Product deleted successfully!" });

  } catch (error) {
    console.error("❌ Error deleting product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Make a user an admin
export const makeAdmin = async (req, res) => {
  try {
    const { user_id } = req.params;

    // ✅ Debugging: Log user_id before proceeding
    // console.log("🔍 Received user_id:", user_id);

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ✅ Ensure the requester is an admin
    if (!req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    // ✅ Convert user_id to an integer (ensure it's a valid number)
    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedUserId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // ✅ Update user roles to include "admin"
    const updateUser = await pool.query(
      `UPDATE users SET roles = array_append(roles, 'admin') WHERE user_id = $1 RETURNING *`,
      [parsedUserId]
    );

    if (updateUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User promoted to admin!", user: updateUser.rows[0] });
  } catch (error) {
    console.error("❌ Error promoting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Remove admin role
export const removeAdmin = async (req, res) => {
  try {
    const { user_id } = req.params;

    // ✅ Ensure only admins can remove the role
    if (!req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    // ✅ Update user roles to remove "admin"
    const updateUser = await pool.query(
      `UPDATE users SET roles = array_remove(roles, 'admin') WHERE user_id = $1 RETURNING *`,
      [user_id]
    );

    if (updateUser.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "Admin role removed!", user: updateUser.rows[0] });
  } catch (error) {
    console.error("❌ Error removing admin role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};