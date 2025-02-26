import pool from "../config/db.js";
import Stripe from "stripe";
import { sendProductRequestEmail } from "../controllers/user.controller.js"; // ✅ Ensure correct import
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
    const {
      name,
      price,
      stock,
      description,
      is_presale,
      release_date,
      stripe_product_id,
      stripe_price_id,
    } = req.body;

    // ✅ Ensure only admins can update products
    if (!req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const updatedProduct = await pool.query(
      `UPDATE products 
           SET name = $1, price = $2, stock = $3, description = $4, is_presale = $5, release_date = $6, stripe_product_id = $7, stripe_price_id = $8
           WHERE product_id = $9 RETURNING *`,
      [
        name,
        price,
        stock,
        description,
        is_presale,
        release_date,
        stripe_product_id,
        stripe_price_id,
        product_id,
      ]
    );

    if (updatedProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res
      .status(200)
      .json({
        message: "Product updated successfully!",
        product: updatedProduct.rows[0],
      });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    // ✅ Ensure only admins can access
    if (!req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const products = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.status(200).json(products.rows);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateProductRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Ensure only admins can update request status
    if (!req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const updatedRequest = await pool.query(
      `UPDATE product_requests 
           SET status = $1 
           WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (updatedRequest.rowCount === 0) {
      return res.status(404).json({ error: "Product request not found." });
    }

    res
      .status(200)
      .json({
        message: "Product request updated successfully!",
        request: updatedRequest.rows[0],
      });
  } catch (error) {
    console.error("❌ Error updating product request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteProductRequest = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🛠 Deleting request with ID:", id);

    if (!id) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const deletedRequest = await pool.query(
      `DELETE FROM product_requests WHERE id = $1 RETURNING *`,
      [id]
    );

    if (deletedRequest.rowCount === 0) {
      return res.status(404).json({ error: "Product request not found." });
    }

    res.status(200).json({ message: "Product request deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateRequestQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // ✅ Ensure only admins can update request quantity
    if (!req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    const updatedRequest = await pool.query(
      `UPDATE product_requests 
           SET quantity = $1 
           WHERE id = $2 RETURNING *`,
      [quantity, id]
    );

    if (updatedRequest.rowCount === 0) {
      return res.status(404).json({ error: "Product request not found." });
    }

    res
      .status(200)
      .json({
        message: "Quantity updated successfully!",
        request: updatedRequest.rows[0],
      });
  } catch (error) {
    console.error("❌ Error updating product request quantity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Ensure only admins can delete products
    if (!req.user.roles.includes("admin")) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    const deletedProduct = await pool.query(
      "DELETE FROM products WHERE product_id = $1 RETURNING *",
      [id]
    );

    if (deletedProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// DUPLICATE CODE
// ✅ Add New Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, description, image_url, is_presale, release_date, slug } = req.body;

    // ✅ Ensure only admins can add products
    if (!req.user.roles.includes("admin")) {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    // ✅ Generate Stripe product
    console.log("🛒 Creating Stripe Product for:", name);
    
    const stripeProduct = await stripe.products.create({
      name,
      description: description || "",
      images: image_url ? [image_url] : [],
    });
    const stripeProductId = stripeProduct.id;

    // ✅ Create Stripe price
    console.log("💲 Creating Stripe Price for:", name);
    
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert dollars to cents
      currency: "usd",
      product: stripeProductId,
    });
    const stripePriceId = stripePrice.id;

    // ✅ Helper function to generate a slug
    const generateSlug = (name) => {
      return name.toLowerCase().trim().replace(/\s+/g, "-");
    };

    // ✅ Use provided slug or generate one if not provided
    const finalSlug = slug || generateSlug(name);

    // ✅ Insert into the database
    const newProduct = await pool.query(
      `INSERT INTO products (name, slug, price, stock, description, image_url, is_presale, release_date, stripe_product_id, stripe_price_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [name, finalSlug, price, stock, description, image_url, is_presale, release_date, stripeProductId, stripePriceId]
    );

    console.log("✅ Product successfully added:", newProduct.rows[0]);
    
    res.status(201).json({ 
      message: "Product added successfully!", 
      product: newProduct.rows[0],
      stripe_product_id: stripeProductId,
      stripe_price_id: stripePriceId,
    });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Request a product (Users can request a product)
export const requestProduct = async (req, res) => {
  try {
    const { product_id } = req.body;

    if (!req.user || !req.user.email) {
      return res.status(400).json({ error: "User email is required." });
    }

    const user_email = req.user.email;
    const user_id = req.user.user_id;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required." });
    }

    console.log(
      "📩 Processing request for product:",
      product_id,
      "by user:",
      user_id,
      user_email
    );

    // ✅ Fetch the user's full address from the users table
    const userQuery = await pool.query(
      `SELECT address, city, state, country FROM users WHERE user_id = $1`,
      [user_id]
    );

    console.log("🔍 User Address Data:", userQuery.rows); // ✅ DEBUGGING LOG

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const { address, city, state, country } = userQuery.rows[0];

    console.log("✅ Retrieved Address:", { address, city, state, country }); // ✅ DEBUGGING LOG

    if (!address || !city || !state || !country) {
      return res.status(400).json({ error: "User address is incomplete." });
    }

    // ✅ Check if the product exists
    const productQuery = await pool.query(
      "SELECT name FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productQuery.rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product_name = productQuery.rows[0].name;

    // ✅ Check if the user has already requested this product
    const existingRequest = await pool.query(
      "SELECT * FROM product_requests WHERE product_id = $1 AND user_id = $2",
      [product_id, user_id]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(409).json({ error: "Product already requested." });
    }

    // ✅ Insert the product request with the user's address
    const newRequest = await pool.query(
      `INSERT INTO product_requests (product_id, user_id, user_email, product, address, city, state, country, requested_at, quantity, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, 'pending') 
       RETURNING *;`,
      [
        product_id,
        user_id,
        user_email,
        product_name,
        address,
        city,
        state,
        country,
        1,
      ] // Default quantity = 1
    );

    console.log("✅ Product request saved:", newRequest.rows[0]);
    res
      .status(201)
      .json({
        message: "Product request submitted successfully!",
        request: newRequest.rows[0],
      });
  } catch (error) {
    console.error("❌ Error processing product request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteAllProductRequests = async (req, res) => {
  try {
    console.log("🔍 Checking user roles:", req.user); // Debugging log

    // ✅ Ensure only admins can delete requests
    if (!req.user?.roles || !req.user.roles.includes("admin")) {
      console.error("❌ Unauthorized: User is not an admin.");
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin access required" });
    }

    await pool.query("DELETE FROM product_requests");

    console.log("✅ All product requests deleted.");
    res.status(200).json({ message: "All product requests deleted." });
  } catch (error) {
    console.error("❌ Error deleting product requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllProductRequests = async (req, res) => {
  try {
    const requests = await pool.query(`
      SELECT pr.id, pr.user_email, pr.product, pr.quantity, pr.status, pr.requested_at,
             u.address, u.city, u.state, u.country
      FROM product_requests pr
      JOIN users u ON pr.user_id = u.user_id
      ORDER BY pr.requested_at DESC;
    `);

    res.status(200).json(requests.rows);
  } catch (error) {
    console.error("❌ Error fetching product requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

