import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import pool from "../config/db.js";


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

console.log("✅ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "MISSING!");

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Stripe API keys are missing! Check your .env file.");
    process.exit(1); // Stop the server if keys are missing
}

export const validateStripePrice = async (priceId) => {
    try {
        if (!priceId) return false;
        const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });

        // Extract quantity if available in Stripe metadata
        const quantity = price.product.metadata?.quantity || 1;

        return { isValid: price && price.active, quantity };
    } catch (error) {
        console.error(`Invalid stripe_price_id: ${priceId}`, error);
        return { isValid: false, quantity: 0 };
    }
};


// ✅ Middleware to handle raw body for Stripe Webhooks
router.post(
    "/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        const sig = req.headers["stripe-signature"];

        try {
            // ✅ Verify webhook signature
            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            console.log("✅ Webhook Event Verified:", event.type);

            // ✅ Handle Checkout Session Completed
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                console.log("💰 Payment Successful:", session);

                const userEmail = session.customer_email;

                if (!userEmail) {
                    console.error("❌ No email found in session");
                    return res.status(400).json({ error: "No email found" });
                }

                // ✅ Find the user by email
                const userQuery = await pool.query(
                    "SELECT user_id FROM users WHERE email = $1",
                    [userEmail]
                );

                if (userQuery.rows.length === 0) {
                    console.error("❌ User not found for email:", userEmail);
                    return res.status(400).json({ error: "User not found" });
                }

                const userId = userQuery.rows[0].user_id;

                // ✅ Insert order into database safely using parameterized query
                const orderQuery = await pool.query(
                    `INSERT INTO orders (user_id, status, date, amount, total, ref, payment_method)
                     VALUES ($1, 'pending', NOW(), $2, $3, $4, 'STRIPE') RETURNING *`,
                    [
                        userId,
                        session.amount_total / 100, // Convert cents to dollars
                        session.amount_total / 100, // Total amount
                        session.payment_intent, // Stripe Payment Intent ID
                    ]
                );

                console.log("📦 Order Created:", orderQuery.rows[0]);
                return res.json({ success: true, order: orderQuery.rows[0] });
            }

            res.sendStatus(200);
        } catch (error) {
            console.error("❌ Webhook Error:", error.message);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
);


// ✅ Correctly export the function
export const syncAllProducts = async () => {
    console.log("Syncing all products with Stripe...");
    // Your logic to sync products
  };
  
export default router;
