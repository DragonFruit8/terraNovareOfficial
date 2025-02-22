import Stripe from "stripe";
import pool from "../db.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Sync a Single Product with Stripe
export const syncProductWithStripe = async (product) => {
  try {
    if (product.stripe_product_id && product.stripe_price_id) {
      console.log(`✅ Product already linked to Stripe: ${product.name}`);
      return;
    }

    console.log(`🛒 Creating Stripe Product for: ${product.name}`);

    const stripeProduct = await stripe.products.create({
      name: product.name,
      description: product.description || "No description available.",
      images: product.image_url ? [product.image_url] : [],
    });

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100),
      currency: "usd",
    });

    // ✅ Save Stripe IDs to Database
    await pool.query(
      `UPDATE products 
       SET stripe_product_id = $1, 
           stripe_price_id = $2 
       WHERE product_id = $3`,
      [stripeProduct.id, stripePrice.id, product.product_id]
    );

    console.log(`✅ Stripe Product Synced: ${stripeProduct.id}, Price: ${stripePrice.id}`);
  } catch (error) {
    console.error("❌ Error syncing product with Stripe:", error);
  }
};
// ✅ Sync All Products (Ensures Stock is NOT Reduced Randomly)
export const syncAllProducts = async () => {
  try {
    console.log("🔄 Syncing All Products...");

    const products = await pool.query(`SELECT * FROM products;`);

    for (const product of products.rows) {
      await syncProductWithStripe(product);
    }

    console.log("✅ Sync Completed!");
  } catch (error) {
    console.error("❌ Error syncing products:", error.message);
  }
};
// ✅ Reduce Stock Only When a Purchase is Made
export const purchaseProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log(`🛒 Attempting Purchase for Product ID: ${productId}`);

    const product = await pool.query(
      `SELECT stock FROM products WHERE product_id = $1`,
      [productId]
    );

    if (product.rows.length === 0) {
      console.error("❌ Product not found in DB");
      return res.status(404).json({ error: "Product not found." });
    }

    console.log(`🔍 Current Stock for Product ${productId}: ${product.rows[0].stock}`);

    if (product.rows[0].stock <= 0) {
      console.warn("⚠️ Out of Stock! Cannot reduce further.");
      return res.status(400).json({ error: "Out of stock!" });
    }

    // ✅ Reduce Stock Only for the Purchased Product
    const updatedStock = await pool.query(
      `UPDATE products 
       SET stock = stock - 1 
       WHERE product_id = $1
       RETURNING stock;`,
      [productId]
    );

    if (updatedStock.rows.length === 0) {
      console.error("❌ Stock update failed in DB.");
      return res.status(500).json({ error: "Stock update failed." });
    }

    console.log(`✅ Purchase Successful! New Stock for Product ${productId}: ${updatedStock.rows[0].stock}`);
    res.json({ message: "Purchase successful!", newStock: updatedStock.rows[0].stock });

  } catch (error) {
    console.error("❌ Error processing purchase:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};