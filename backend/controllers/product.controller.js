import pool from "../db.js";
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

// ✅ Add New Product
export const addProduct = async (req, res) => {
  try {
    let { name, price, stock } = req.body;

    console.log("📩 Received Product Data:", { name, price, stock });

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    stock = stock !== undefined ? parseInt(stock, 10) : 10;

    console.log("🔄 Final Insert Data:", { name, price, stock });

    const newProduct = await pool.query(
      `INSERT INTO products (name, price, stock)
       VALUES ($1, $2, $3)
       RETURNING product_id, name, price, stock;`,
      [name, price, stock]
    );

    console.log("✅ Product added successfully:", newProduct.rows[0]);

    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Request a product (Users can request a product)
export const requestProduct = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // ✅ Extract token
  if (!token) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ Decode token
    const user_id = decoded.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const { product_id } = req.body;

    if (!product_id) {
      console.error("❌ Missing required field: product_id");
      return res.status(400).json({ error: "Product ID is required." });
    }

    // ✅ Check if the product exists before proceeding
    const productExists = await pool.query(
      `SELECT product_id FROM products WHERE product_id = $1`,
      [product_id]
    );

    if (productExists.rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // ✅ Check if request already exists
    const existingRequest = await pool.query(
      `SELECT request_id FROM product_requests 
       WHERE product_id = $1 AND user_id = $2`,
      [product_id, user_id]
    );

    if (existingRequest.rows.length > 0) {
      console.warn(`⚠️ Duplicate request detected for product ${product_id} by user ${user_id}`);
      return res.status(409).json({ error: "You have already requested this product." });
    }

    // ✅ Insert new product request
    const newRequest = await pool.query(
      `INSERT INTO product_requests (product_id, user_id, requested_at) 
       VALUES ($1, $2, NOW())
       RETURNING request_id, product_id, user_id, requested_at;`,
      [product_id, user_id]
    );

    console.log("✅ Product request saved:", newRequest.rows[0]);
    res.status(201).json({ message: "Product request submitted successfully!", request: newRequest.rows[0] });

  } catch (error) {
    console.error("❌ Error processing product request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
