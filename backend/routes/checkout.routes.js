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
    const { price_id, userEmail } = req.body;

    // ✅ Validate Input
    if (!price_id || !userEmail) {
      console.error("⚠️ Missing price ID or user email:", { price_id, userEmail });
      return res.status(400).json({ error: "Missing required parameters: price ID or user email." });
    }

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/shop?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/shop`,
    });

    console.log(`✅ Stripe session created: ${session.id}`);
    res.json({ url: session.url });

  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});



router.get("/success", async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      id: session.id,
      status: session.payment_status,
      customer: session.customer_details,
    });

  } catch (error) {
    console.error("❌ Stripe Success Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
