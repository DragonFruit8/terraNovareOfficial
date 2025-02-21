import sql from "../db.js"; // Neon database connection
import jwt from "jsonwebtoken";

export const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("Error: Missing user ID in request");
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = req.user.id; // ✅ Extract user ID from auth token
    // console.log("Fetching cart for user ID:", userId);

    const cart = await sql`SELECT * FROM cart WHERE user_id = ${userId}`;

    if (!cart.length) {
      // console.log("Cart is empty for user:", userId);
      return res.json({ message: "Cart is empty", items: [] });
    }

    if (cart.length === 0) {
      // console.log("🛒 No cart found, creating one for user:", user_id);
      cart = await sql`INSERT INTO cart (user_id) VALUES (${user_id}) RETURNING *`;
    }
    const cart_id = cart[0].cart_id;
    // console.log("✅ Cart ID found:", cart_id);
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const addToCart = async (req, res) => {
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

    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    let cart = await sql`SELECT * FROM cart WHERE user_id = ${user_id}`;
    if (cart.length === 0) {
      cart = await sql`INSERT INTO cart (user_id) VALUES (${user_id}) RETURNING *`;
    }

    const cartItem = await sql`
      INSERT INTO cart_item (cart_id, product_id, quantity)
      VALUES (${cart[0].cart_id}, ${product_id}, ${quantity})
      ON CONFLICT (cart_id, product_id) 
      DO UPDATE SET quantity = cart_item.quantity + ${quantity}
      RETURNING *;
    `;

    return res.json({ message: "Item added to cart successfully", data: cartItem });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// Make sure to impliment same token access to remove from addToCart, to verify user
export const removeFromCart = async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: "Product ID is required" });

  try {
    await sql`DELETE FROM cart_item WHERE user_id = ${req.user.id} AND product_id = ${product_id}`;
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const incrementItem = async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: "Product ID is required" });

  try {
    await sql`UPDATE cart_item SET quantity = quantity + 1 WHERE user_id = ${req.user.id} AND product_id = ${product_id}`;
    res.json({ message: "Item quantity increased" });
  } catch (error) {
    console.error("Error incrementing item:", error);
    res.status(500).json({ error: "Server error" });
  }
};
export const decrementItem = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id; // Ensure authenticated user

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await sql`SELECT * FROM cart WHERE user_id = ${user_id}`;
    if (cart.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartItem = await sql`
      UPDATE cart_item
      SET quantity = quantity - 1
      WHERE cart_id = ${cart[0].cart_id} AND product_id = ${product_id} 
      RETURNING *;
    `;

    if (!cartItem.length) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    return res.json({ message: "Item quantity decreased", data: cartItem });
  } catch (error) {
    console.error("Error decrementing item:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
