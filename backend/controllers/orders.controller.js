import pool from "../config/db.js"; // Adjust based on your DB connection
import logger from '../logger.js';

export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id; // Authenticated User
    const orders = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY date DESC`,
      [user_id]
    );
    return res.json(orders.rows);
  } catch (error) {
    logger.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 Get all orders for the logged-in user
export const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await pool.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY date DESC`,
      [user_id]
    );
    res.json(orders.rows);
  } catch (error) {
    logger.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 Create a new order (Checkout process)
export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { total, payment_method } = req.body;

    if (!total || !payment_method) {
      return res.status(400).json({ error: "Total amount and payment method are required" });
    }

    // Insert new order
    const order = await pool.query(
      `INSERT INTO orders (user_id, status, date, amount, payment_method)
       VALUES ($1, 'pending', NOW(), $2, $3)
       RETURNING *`,
      [user_id, total, payment_method]
    );

    res.json({ message: "Order placed successfully", order: order.rows[0] });
  } catch (error) {
    logger.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    // 🔍 Fetch Order Info
    const order = await pool.query(
      `SELECT * FROM orders WHERE order_id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔍 Fetch Ordered Items
    const items = await pool.query(
      `SELECT oi.product_id, p.name, p.price, oi.quantity
       FROM order_item oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = $1`,
      [id]
    );

    return res.json({ ...order.rows[0], items: items.rows });
  } catch (error) {
    logger.error("Error fetching order details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
