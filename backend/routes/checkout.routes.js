import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { email, amount } = req.body;

    // ✅ Step 1: Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      receipt_email: email,
    });

    res.json({ clientSecret: paymentIntent.client_secret }); // ✅ Send to frontend
  } catch (error) {
    console.error("❌ Stripe error:", error);
    res.status(500).json({ error: "Payment processing failed." });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    console.log("🔹 Checkout Request Received:", req.body);

    const { product, userEmail } = req.body;

    if (!product || !userEmail) {
      console.error("⚠️ Missing product or user email");
      return res.status(400).json({ error: "Missing product or user email" });
    }

    // 🔹 Validate `stripe_price_id`
    if (!product.stripe_price_id || !product.stripe_price_id.startsWith("price_")) {
      console.error("❌ Invalid stripe_price_id:", product.stripe_price_id);
      return res.status(400).json({ error: "Invalid Stripe Price ID" });
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price: product.stripe_price_id, // ✅ Ensure this exists in Stripe
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    console.log("✅ Stripe Checkout Session Created:", session.url);
    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

export default router;
