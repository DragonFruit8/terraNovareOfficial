
import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import pool from "../config/db.js";
 

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
// console.log("✅ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "MISSING!");
if (!process.env.STRIPE_SECRET_KEY) {
    console.error("❌ Stripe API key is missing! Check your .env file.");
    process.exit(1); // Stop the server if key is missing
}

router.post("/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    // console.log("✅ Webhook Event Received:", event);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // console.log("💰 Payment Successful:", session);

      const userEmail = session.customer_email; // 🔍 Get user email from Stripe
      // console.log("🔍 User Email from Stripe:", userEmail);

      if (!userEmail) {
        console.error("❌ No email found in session");
        return res.status(400).json({ error: "No email found" });
      }

      // Find the user by email
      const user = await  pool.query(`SELECT user_id FROM users WHERE email = ${userEmail}`,[    ]);
      if (user.length === 0) {
        console.error("❌ User not found for email:", userEmail);
        return res.status(400).json({ error: "User not found" });
      }

      // Insert order into database
      const order = await  pool.query(`
        INSERT INTO orders (user_id, status, date, amount, total, ref, payment_method)
        VALUES (${user[0].user_id}, 'pending', NOW(), ${session.amount_total / 100}, ${session.amount_total / 100}, ${session.payment_intent}, 'STRIPE')
        RETURNING *;
      `,[    ]);

      // console.log("📦 Order Created:", order[0]);
      return res.json({ success: true, order: order[0] });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;
