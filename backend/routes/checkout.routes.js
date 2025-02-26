import express from "express";
import Stripe from "stripe";

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
    const { items } = req.body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cart",
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});

export default router;
