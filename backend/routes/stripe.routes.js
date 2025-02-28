import Stripe from "stripe";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("⚠️ No stripe-signature header found.");
    return res.status(400).send("Stripe Signature Missing.");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("✅ Webhook Event Received:", event);
  } catch (err) {
    console.error("⚠️ Webhook Signature Verification Failed!", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  if (event.type === "checkout.session.completed") {
    console.log("💰 Payment Successful! Order should be processed.");
  }

  res.status(200).json({ received: true });
});
router.post("/checkout", async (req, res) => {
  try {
    const { product, userEmail } = req.body;

    if (!product || !product.price_id || !product.price_id.startsWith("price_")) {
      return res.status(400).json({ error: "Invalid Stripe Price ID" });
    }

    console.log("💳 Creating Stripe checkout session for:", product.name, product.price_id);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      line_items: [
        {
          price: product.price_id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;