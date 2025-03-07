import pool from "../config/db.js"; // Neon database connection
import jwt from "jsonwebtoken";
import logger from '../logger.js';

export const getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.error("Error: Missing user ID in request");
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = req.user.id;

    const cart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [userId]
    );

    if (cart.rows.length === 0) {
      return res.json({ message: "Cart is empty", items: [] });
    }

    const cart_id = cart.rows[0].cart_id;
    res.json(cart.rows);
  } catch (error) {
    logger.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No authentication token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    if (!user_id) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    let cart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [user_id]
    );

    if (cart.rows.length === 0) {
      cart = await pool.query(
        `INSERT INTO cart (user_id) VALUES ($1) RETURNING *`,
        [user_id]
      );
    }

    const cartItem = await pool.query(
      `INSERT INTO cart_item (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) 
       DO UPDATE SET quantity = cart_item.quantity + $3
       RETURNING *;`,
      [cart.rows[0].cart_id, product_id, quantity]
    );

    return res.json({ message: "Item added to cart successfully", data: cartItem.rows[0] });
  } catch (error) {
    logger.error("❌ Error adding to cart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFromCart = async (req, res) => {
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
      return res.status(400).json({ error: "Product ID is required" });
    }

    // ✅ Check if the cart exists for the user
    const cart = await pool.query(
      `SELECT cart_id FROM cart WHERE user_id = $1`,
      [user_id]
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cart_id = cart.rows[0].cart_id;

    // ✅ Remove the product from the user's cart
    const removedItem = await pool.query(
      `DELETE FROM cart_item WHERE cart_id = $1 AND product_id = $2 RETURNING *`,
      [cart_id, product_id]
    );

    if (removedItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    res.json({ message: "Item removed from cart", data: removedItem.rows[0] });
  } catch (error) {
    logger.error("❌ Error removing from cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const incrementItem = async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: "Product ID is required" });

  try {
    await pool.query(
      `UPDATE cart_item SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2`,
      [req.user.id, product_id]
    );
    res.json({ message: "Item quantity increased" });
  } catch (error) {
    logger.error("Error incrementing item:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const decrementItem = async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const cart = await pool.query(
      `SELECT * FROM cart WHERE user_id = $1`,
      [user_id]
    );

    if (cart.rows.length === 0) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartItem = await pool.query(
      `UPDATE cart_item
       SET quantity = quantity - 1
       WHERE cart_id = $1 AND product_id = $2 
       RETURNING *;`,
      [cart.rows[0].cart_id, product_id]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    return res.json({ message: "Item quantity decreased", data: cartItem.rows[0] });
  } catch (error) {
    logger.error("Error decrementing item:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
