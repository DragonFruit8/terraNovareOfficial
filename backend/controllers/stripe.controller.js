import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, userEmail } = req.body;

    console.log("🔍 Received User Email:", userEmail); // ✅ Debugging step

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image_url],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: userEmail, // ✅ Ensure this is correctly passed
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
    // 🔹 Check if product already has a Stripe ID
    if (product.stripe_product_id && product.stripe_price_id) {
      // console.log(`✅ Product already linked to Stripe: ${product.name}`);
      return;
    }

    console.log(`🛒 Creating Stripe Product for: ${product.name}`);

    // 🔹 Create a product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description,
      images: [product.image_url],
    });

    // 🔹 Create a price in Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // Convert to cents
      currency: "usd",
    });

    // 🔹 Store Stripe product & price ID in your database
    await sql`
      UPDATE products 
      SET stripe_product_id = ${stripeProduct.id}, stripe_price_id = ${stripePrice.id} 
      WHERE product_id = ${product.product_id}
    `;

    console.log(`✅ Stripe Product Created: ${stripeProduct.id}, Price: ${stripePrice.id}`);
  } catch (error) {
    console.error("❌ Error syncing product with Stripe:", error);
  }
};
export const syncAllProducts = async () => {
  try {
    const products = await sql`SELECT * FROM products`;

    for (const product of products) {
      await syncProductWithStripe(product);
    }
  } catch (error) {
    console.error("❌ Error syncing all products:", error);
  }
};