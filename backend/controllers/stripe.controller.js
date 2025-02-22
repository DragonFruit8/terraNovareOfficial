import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, userEmail } = req.body;

    console.log("🔍 Received User Email:", userEmail);

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      line_items: lineItems,
    });

    console.log("✅ Stripe Checkout Session Created:", session.id);

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe Checkout Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const syncProductWithStripe = async (product) => {
  try {
    if (product.stripe_product_id && product.stripe_price_id) {
      return;
    }

    console.log(`🛒 Creating Stripe Product for: ${product.name}`);

    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description || "",
      images: product.image_url ? [product.image_url] : [],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100),
      currency: "usd",
    });

    await pool.query(
      `UPDATE products 
       SET stripe_product_id = $1, stripe_price_id = $2 
       WHERE product_id = $3`,
      [stripeProduct.id, stripePrice.id, product.product_id]
    );

    console.log(`✅ Stripe Product Created: ${stripeProduct.id}, Price: ${stripePrice.id}`);
  } catch (error) {
    console.error("❌ Error syncing product with Stripe:", error);
  }
};

export const syncAllProducts = async () => {
  try {
    const products = await pool.query(`SELECT * FROM products`);

    for (const product of products.rows) {
      await syncProductWithStripe(product);
    }
  } catch (error) {
    console.error("❌ Error syncing all products:", error);
  }
};
