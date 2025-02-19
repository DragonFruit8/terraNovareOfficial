import sql from "../db.js"; // Adjust based on your DB connection

export const getUserOrders = async (req, res) => {
  try {
    const user_id = req.user.id; // Authenticated User
    const orders = await sql`
      SELECT * FROM orders WHERE user_id = ${user_id} ORDER BY date DESC
    `;
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 Get all orders for the logged-in user
export const getOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await sql`
      SELECT * FROM orders WHERE user_id = ${user_id} ORDER BY date DESC
    `;
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
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
    const order = await sql`
      INSERT INTO orders (user_id, status, date, amount, payment_method)
      VALUES (${user_id}, 'pending', NOW(), ${total}, ${payment_method})
      RETURNING *
    `;

    res.json({ message: "Order placed successfully", order: order[0] });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    // 🔍 Fetch Order Info
    const order = await sql`
      SELECT * FROM orders WHERE order_id = ${id} AND user_id = ${user_id}
    `;

    if (order.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔍 Fetch Ordered Items
    const items = await sql`
      SELECT oi.product_id, p.name, p.price, oi.quantity
      FROM order_item oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ${id}
    `;

    return res.json({ ...order[0], items });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};