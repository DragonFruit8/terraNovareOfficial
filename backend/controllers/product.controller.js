import sql from "../db.js";
// import { sendProductRequestEmail } from "../utils/email.js"; // ✅ For confirmation emails

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    await sql`SET plan_cache_mode = force_generic_plan;`; // Force query replanning

    const products = await sql`
      SELECT product_id,image_url, name, price, stock FROM products
    `;

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, price, stock } = req.body; // ✅ Include stock
    console.log(req.body, req,params)

    if (!name || !price || stock === undefined) {
      return res.status(400).json({ error: "Name, price, and stock are required" });
    }

    // ✅ Force PostgreSQL to refresh the query plan
    await sql`SET plan_cache_mode = force_generic_plan;`;

    // ✅ Update product details, including stock
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, stock = ${stock}
      WHERE product_id = ${product_id}
      RETURNING product_id, name, price, stock;
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product updated:", updatedProduct[0]);
    res.json(updatedProduct[0]); // ✅ Return updated product
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Add New Product
export const addProduct = async (req, res) => {
  try {
    let { name, price, stock } = req.body;

    console.log("📩 Received Product Data:", { name, price, stock }); // 🔍 Debug

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    // ✅ Convert stock to an integer, default to 10 if missing
    stock = stock !== undefined ? parseInt(stock, 10) : 10;

    console.log("🔄 Final Insert Data:", { name, price, stock }); // 🔍 Debug

    const newProduct = await sql`
      INSERT INTO products (name, price, stock)
      VALUES (${name}, ${price}, ${stock})
      RETURNING product_id, name, price, stock;
    `;

    console.log("✅ Product added successfully:", newProduct[0]); // 🔍 Confirm insertion

    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error("❌ Error adding product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Request a product (Users can request a product)
export const requestProduct = async (req, res) => {
  try {
    const { product_id, userEmail } = req.body;

    // ✅ Validate input
    if (!product_id || !userEmail) {
      console.error("❌ Missing required fields:", { product_id, userEmail });
      return res.status(400).json({ error: "Product ID and user email are required." });
    }

    // ✅ Normalize email to lowercase
    const normalizedEmail = userEmail.toLowerCase().trim();

    // ✅ Check if the product exists before proceeding
    const productExists = await sql`
      SELECT product_id FROM products WHERE product_id = ${product_id}
    `;

    if (productExists.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // ✅ Check if request already exists
    const existingRequest = await sql`
      SELECT request_id FROM product_requests 
      WHERE product_id = ${product_id} AND LOWER(user_email) = ${normalizedEmail}
    `;

    if (existingRequest.length > 0) {
      console.warn(`⚠️ Duplicate request detected for product ${product_id} by ${normalizedEmail}`);
      return res.status(409).json({ error: "You have already requested this product." });
    }

    // ✅ Insert new product request
    const newRequest = await sql`
      INSERT INTO product_requests (product_id, user_email, requested_at) 
      VALUES (${product_id}, ${normalizedEmail}, NOW())
      RETURNING request_id, product_id, user_email, requested_at;
    `;

    console.log("✅ Product request saved:", newRequest[0]);
    res.status(201).json({ message: "Product request submitted successfully!", request: newRequest[0] });

  } catch (error) {
    console.error("❌ Error processing product request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
