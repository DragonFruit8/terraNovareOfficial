import slugify from "slugify"; // ✅ Import slugify package
import sql from "../db.js";

// ✅ Fetch All Products (Admin)
export const getAllProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT product_id, name, price, stock
      FROM products
    `;

    console.log("✅ Fetched all products:", products);
    res.json(products);
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

    const updatedUser = await sql`
      UPDATE users
      SET fullname = ${fullname}, email = ${email.toLowerCase()}, roles = ${roles}
      WHERE user_id = ${user_id}
      RETURNING user_id, fullname, email, roles;
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("❌ Error updating user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {  fullname, address, city, state, country } = req.body;

    // if ( !fullname) {
    //   return res.status(400).json({ error: "Username and full name are required." });
    // }

    const updatedUser = await sql`
      UPDATE users
      SET 
        fullname = ${fullname}, 
        address = ${address}, 
        city = ${city}, 
        state = ${state}, 
        country = ${country}
      WHERE user_id = ${userId}
      RETURNING user_id, fullname, address, city, state, country;
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser[0]);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Add New Product
export const addProduct = async (req, res) => {
  try {
    const { name, price, stock, description, image_url } = req.body;

    if (!name || !price || !stock) {
      return res.status(400).json({ error: "Name, price, and stock are required." });
    }

    const slug = slugify(name, { lower: true, strict: true }); // ✅ Generate slug

    const newProduct = await sql`
      INSERT INTO products (name, slug, price, stock, description, image_url)
      VALUES (${name}, ${slug}, ${price}, ${stock}, ${description}, ${image_url})
      RETURNING *;
    `;

    console.log("✅ Product added:", newProduct[0]);
    res.json(newProduct[0]);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Fetch product by ID
    const product = await sql`
      SELECT * FROM products WHERE product_id = ${id}
    `;

    if (product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product Fetched:", product[0]);
    res.json(product[0]);
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { name, slug, price, stock, is_presale, stripe_product_id, stripe_price_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required." });
    }
// ADD description!!
    console.log("🔍 Updating Product:", { product_id, name, slug, price, stock,is_presale, description, stripe_product_id, stripe_price_id });

    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, 
          slug = ${slug}, 
          price = ${price}, 
          stock = ${stock}, 
          is_presale = ${is_presale},
          description = ${description}
          stripe_product_id = ${stripe_product_id}, 
          stripe_price_id = ${stripe_price_id}
      WHERE product_id = ${product_id}
      RETURNING *;
    `;

    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("✅ Product updated:", updatedProduct[0]);
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// ✅ Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔍 Deleting product with ID:", id);

    // ✅ Check if product exists
    const productExists = await sql`
      SELECT * FROM products WHERE product_id = ${id}
    `;
    if (productExists.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    // ✅ Delete the product
    await sql`
      DELETE FROM products WHERE product_id = ${id}
    `;

    console.log(`✅ Product with ID ${id} deleted.`);
    res.json({ message: "Product deleted successfully!" });

  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};