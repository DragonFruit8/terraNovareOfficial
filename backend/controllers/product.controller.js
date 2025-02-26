import pool from "../config/db.js";
import { sendProductRequestEmail } from "../services/email.service.js"; 
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT product_id, name, description, image_url, is_presale
      FROM products
      ORDER BY created_at DESC
    `);
    
    res.status(200).json(result.rows); // ✅ Send all products, including presale ones

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
export const getProductRequests = async (req, res) => {
  const { email } = req.query; // ✅ Check if email is provided

  try {
    let query, params;

    if (email) {
      // ✅ Fetch user-specific product requests
      query = `SELECT product_id FROM product_requests WHERE user_email = $1`;
      params = [email];
    } else {
      // ✅ Fetch all product requests (admin)
      query = `
        SELECT pr.id, pr.user_email, pr.product, pr.quantity, pr.status, pr.requested_at,
               u.address, u.city, u.state, u.country
        FROM product_requests pr
        JOIN users u ON pr.user_id = u.user_id
        ORDER BY pr.requested_at DESC;
      `;
      params = []; // No parameters for fetching all
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error("❌ Error fetching product requests:", error);
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
// export const sendProductRequestEmail = async (to, productName) => {
//   const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject: "Product Request Confirmation",
//       text: `Thank you for requesting ${productName}. We will notify you once it's available!`,
//   };

//   try {
//       console.log("📧 Preparing to send email to:", to);
//       const info = await transporter.sendMail(mailOptions);
//       console.log("✅ Email sent successfully:", info.response);
//       return info;
//   } catch (error) {
//       console.error("❌ Error sending email:", error);
//       throw new Error("Failed to send email");
//   }
// };

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
  const { user_email, user_id, product_id } = req.body;

  try {
      console.log("📩 Incoming product request from:", user_email, "for product:", product_id);

      // ✅ Fetch product name
      const productQuery = await pool.query(
          "SELECT name FROM products WHERE product_id = $1",
          [product_id]
      );

      if (productQuery.rowCount === 0) {
          console.error("❌ Product not found:", product_id);
          return res.status(404).json({ error: "Product not found" });
      }

      const productName = productQuery.rows[0].name;
      console.log("✅ Product found:", productName);

      // ✅ Check if product is already requested
      const existingRequest = await pool.query(
          "SELECT * FROM product_requests WHERE user_email = $1 AND product_id = $2",
          [user_email, product_id]
      );

      if (existingRequest.rowCount > 0) {
          console.log("⚠️ Product already requested by this user. Sending confirmation email anyway...");

          // ✅ Send email confirmation even if already requested
          await sendProductRequestEmail(user_email, productName);
          return res.status(200).json({ message: "Product already requested. Email sent again." });
      }

      // ✅ Insert new request
      console.log("📝 Inserting request into database...");
      await pool.query(
          "INSERT INTO product_requests (user_id, user_email, product_id, product, requested_at, status) VALUES ($1, $2, $3, $4, NOW(), 'pending')",
          [user_id, user_email, product_id, productName]
      );
      console.log("✅ Request inserted successfully.");

      // ✅ Send confirmation email
      console.log("📧 Attempting to send email to:", user_email);
      await sendProductRequestEmail(user_email, productName);
      console.log("✅ Email successfully sent!");

      res.status(201).json({ message: "Product requested successfully and email sent." });

  } catch (error) {
      console.error("❌ Error processing product request:", error);
      res.status(500).json({ error: "Server error while requesting product." });
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
  const { email } = req.query; // ✅ Check if a specific email is provided

  try {
    let query, params;

    if (email) {
      // ✅ Fetch only requested products for a specific user
      query = `SELECT product_id FROM product_requests WHERE user_email = $1`;
      params = [email];
    } else {
      // ✅ Fetch all product requests (admin view)
      query = `
        SELECT pr.id, pr.user_email, pr.product, pr.quantity, pr.status, pr.requested_at,
               u.address, u.city, u.state, u.country
        FROM product_requests pr
        JOIN users u ON pr.user_id = u.user_id
        ORDER BY pr.requested_at DESC;
      `;
      params = []; // No params needed for all requests
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error("❌ Error fetching product requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
