import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import pool from "../config/db.js";
import logger from '../logger.js';


dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// logger.info("✅ STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY ? "Loaded" : "MISSING!");

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    logger.error("❌ Stripe API keys are missing! Check your .env file.");
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
        logger.error(`Invalid stripe_price_id: ${priceId}`, error);
        return { isValid: false, quantity: 0 };
    }
};

export const createCheckoutSession = async (req, res) => {
  try {
    // logger.info("Received request body:", req.body);

    let { amount, email } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: "Missing amount or email" });
    }

    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // logger.info("Creating Stripe session for amount:", amount, "and email:", email);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email, // ✅ Ensure this is correct
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
              description: "Support our cause!",
            },
            unit_amount: amount * 100, // ✅ Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // logger.info("Stripe session created successfully:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    logger.error("Stripe Checkout Error:", error); // ✅ Log the full Stripe error
    res.status(500).json({ error: error.message });
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

            // logger.info("✅ Webhook Event Verified:", event.type);

            // ✅ Handle Checkout Session Completed
            if (event.type === "checkout.session.completed") {
                const session = event.data.object;
                // logger.info("💰 Payment Successful:", session);

                const userEmail = session.customer_email;

                if (!userEmail) {
                    logger.error("❌ No email found in session");
                    return res.status(400).json({ error: "No email found" });
                }

                // ✅ Find the user by email
                const userQuery = await pool.query(
                    "SELECT user_id FROM users WHERE email = $1",
                    [userEmail]
                );

                if (userQuery.rows.length === 0) {
                    logger.error("❌ User not found for email:", userEmail);
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

                // logger.info("📦 Order Created:", orderQuery.rows[0]);
                return res.json({ success: true, order: orderQuery.rows[0] });
            }

            res.sendStatus(200);
        } catch (error) {
            logger.error("❌ Webhook Error:", error.message);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }
    }
);


// ✅ Correctly export the function
export const syncAllProducts = async () => {
    // logger.info("Syncing all products with Stripe...");
    // Your logic to sync products
  };
  
export default router;
