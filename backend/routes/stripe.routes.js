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
    // console.log("✅ Webhook Event Received:", event);
  } catch (err) {
    console.error("⚠️ Webhook Signature Verification Failed!", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  if (event.type === "checkout.session.completed") {
    // console.log("💰 Payment Successful! Order should be processed.");
  }

  res.status(200).json({ received: true });
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

export const createCheckoutSession = async (req, res) => {
  try {
    // console.log("Received request body:", req.body); // Debugging

    let { amount, email } = req.body;

    if (!amount || !email) {
      return res.status(400).json({ error: "Missing amount or email" });
    }

    // Convert amount to a number and check validity
    amount = Number(amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // ✅ Debugging: Log amount and email before making the Stripe request
    // console.log("Creating Stripe session for amount:", amount, "and email:", email);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
              description: "Support our cause!",
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // console.log("Stripe session created:", session.id); // ✅ Log successful session creation
    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export default router;