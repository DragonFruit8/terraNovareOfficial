import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51H9yaJCJsM5FOXWHqbppEf6qNGuuLHOWiDcX9n9JXW5a62Kq1uSWhuhCbIMkPVf7fc7g16Icq6FKVvchxqxCBzTu00Bl3o1w1K");

const Shop = () => {
  const { userData } = useUser();
  const [products, setProducts] = useState([]); // ✅ Store products
  const [requestedProducts, setRequestedProducts] = useState([]); // ✅ Store requested products

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/products"); // ✅ Fetches all products
        // product_id, 
        // name, 
        // description, 
        // image_url, 
        // is_presale,
        // stripe_product_id,
        // stripe_price_id
        setProducts(response.data);
        console.log("✅ Products fetched:", response.data);
      } catch (error) {
        console.error(
          "❌ Error fetching products:",
          error.response?.data || error.message
        );
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = async (products) => {
    const stripe = await stripePromise;
  
    // Extract only the stripe_price_id from each product
    const productPrices = products.map(product => ({
      priceId: product.stripe_price_id,
      quantity: 1, // Default quantity (modify if needed)
    }));
  
    try {
      const { data } = await axiosInstance.post("/create-checkout-session", {
        products: productPrices, // Send only necessary data
      });
  
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) console.error("Stripe error", error);
    } catch (error) {
      console.error("Checkout session error:", error);
    }
  };

  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;
  
      try {
        console.log("🔍 Fetching requested products for:", userData.email);
  
        const { data } = await axiosInstance.get(
          `/products/requested?email=${encodeURIComponent(userData.email)}`
        );
        setRequestedProducts(data.map((req) => req.product_id)); // ✅ Store requested product IDs
      } catch (error) {
        console.error(
          "❌ Error fetching requested products:",
          error.response?.data || error.message
        );
      }
    };
  
    fetchRequestedProducts();
  }, [userData]); // ✅ Ensures fetching happens only once when `userData` is available
  

  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;

      try {
        console.log("🔍 Fetching requested products for:", userData.email);

        const { data } = await axiosInstance.get(
          `/products/requested?email=${encodeURIComponent(userData.email)}`
        );
        setRequestedProducts(data.map((req) => req.product_id)); // ✅ Store requested product IDs
      } catch (error) {
        console.error(
          "❌ Error fetching requested products:",
          error.response?.data || error.message
        );
      }
    };

    fetchRequestedProducts();
  }, [userData]);

  const handleProductRequest = async (product) => {
    if (requestedProducts.includes(product.product_id)) {
      toast.warning("This product has already been requested!");
      return;
    }
  
    try {
      // console.log("📩 Requesting product:", product.product_id);
  
      const response = await axiosInstance.post("/products/request", {
        user_email: userData.email,
        user_id: userData.user_id,
        product_id: product.product_id,
      });
  
      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Product request submitted!");
        setRequestedProducts((prev) => [...prev, product.product_id]);
      }
    } catch (error) {
      console.error(
        "❌ Error requesting product:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to request product. Please try again.");
    }
  };
  
  const renderProductCard = (product, isPresale = false) => {
    const isRequested = requestedProducts.includes(product.product_id);
    const isBuyNowAvailable = product.stripe_price_id !== undefined && product.stripe_price_id !== null;
  
    return (
      <div key={product.product_id} className="col-md-4 mb-4">
        <div className={`card p-3 ${isPresale ? "border-warning" : ""}`}>
          <h5 className={isPresale ? "text-warning" : ""}>
            {product.name} {isPresale && "🔥 (Presale)"}
          </h5>
          <p>{product.description}</p>
          <img src={product.image_url} alt={product.name} className="img-fluid" />
  
          {/* Display price if userData exists */}
          {userData && <p>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</p>}
  
          {userData ? (
            <button
              className={`btn mt-3 ${isRequested ? "btn-secondary" : "btn-primary"}`}
              onClick={() => handleProductRequest(product)}
              disabled={isRequested}
            >
              {isRequested ? "Already Requested ✅" : isPresale ? "Request Presale Product" : "Request Product"}
            </button>
          ) : (
            <p className="text-muted mt-2">🔒 Login to request this product</p>
          )}
  
          {/* "Buy Now" button only if stripe_price_id exists */}
          {isBuyNowAvailable && (
            <button className="btn btn-success mt-2" onClick={() => handleBuyNow(product.stripe_price_id)}>
              Buy Now
            </button>
          )}
        </div>
      </div>
    );
  };
  
  
  return (
    <div className="container mt-5 min-vh-100">
    <h2>Shop</h2>

    {/* ✅ Section for Presale Products */}
    <h3 className="mt-4 text-warning">🔥 Presale Products</h3>
    <div className="row">
      {products.filter((product) => product.is_presale).length === 0 ? (
        <p>No presale products available.</p>
      ) : (
        products
          .filter((product) => product.is_presale)
          .map((product) => renderProductCard(product, true))
      )}
    </div>

    {/* ✅ Regular Products Section */}
    <h3 className="mt-4">All Products</h3>
    <div className="row">
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => renderProductCard(product))
      )}
    </div>
  </div>
  );
};

export default Shop;
