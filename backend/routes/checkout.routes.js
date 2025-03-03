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
    const { price_id, userEmail } = req.body; // ✅ Extract only price_id and userEmail

    // Validate input
    if (!price_id || !userEmail) {
      console.error("⚠️ Missing price ID or user email:", { price_id, userEmail });
      return res.status(400).json({ error: "Missing price ID or user email" });
    }

    // console.log("✅ Creating Stripe Checkout Session with:", { price_id, userEmail });

    // Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price: price_id, // ✅ Use only price_id
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url }); // ✅ Return the checkout URL

  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
