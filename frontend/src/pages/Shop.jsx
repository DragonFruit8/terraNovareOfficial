import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const Shop = () => {
  const { userData } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading ] = useState(true);
  const [requestedProducts, setRequestedProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true); // ✅ Start loading before fetching

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // ✅ Increase timeout to 10s

    try {
      const response = await axiosInstance.get("/products", {
        signal: controller.signal, // ✅ Attach abort signal
      });

      clearTimeout(timeoutId); // ✅ Clear timeout if successful

      if (!response.data || response.data.length === 0) {
        toast.warning("⚠️ No products available.");
      }

      setProducts(response.data);
    } catch (error) {
      clearTimeout(timeoutId); // ✅ Ensure timeout is cleared

      if (error.name === "AbortError") {
        console.error("⏳ Request timed out. Please try again.");
        toast.error("⏳ Server is slow. Please refresh.");
      } else {
        console.error("❌ Error fetching products:", error.response?.data || error.message);
        toast.error("❌ Failed to load products.");
      }
    } finally {
      setLoading(false); // ✅ Stop loading after request completes
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** ✅ Improved handleBuyNow */
  const handleBuyNow = async (product) => {
    if (!product.stripe_price_id || !product.stripe_price_id.startsWith("price_")) {
      console.error("⚠️ Invalid Stripe Price ID:", product.stripe_price_id);
      toast.error("⚠️ Payment failed. Invalid product price.");
      return;
    }
  
    try {
      console.log("🔗 Sending price ID to Stripe:", product.stripe_price_id);
  
      const { data } = await axiosInstance.post("/stripe/checkout", {
        price_id: product.stripe_price_id, // ✅ Send only price_id
        userEmail: userData?.email, // ✅ Send userEmail
      });
  
      if (data?.url) {
        window.location.href = data.url; // ✅ Redirect to Stripe checkout
      } else {
        throw new Error("Stripe session URL missing");
      }
    } catch (error) {
      console.error("❌ Checkout session error:", error.response?.data || error.message);
      toast.error("❌ Payment failed. Try again.");
    }
  };
  
  
  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;

      try {
        // console.log("🔍 Fetching requested products for:", userData.email);
        const { data } = await axiosInstance.get(
          `/products/requested?email=${encodeURIComponent(userData.email)}`
        );
        setRequestedProducts(data.map((req) => req.product_id));
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

    setRequestedProducts((prev) => [...prev, product.product_id]); // ✅ Optimistic UI update

    try {
      const response = await axiosInstance.post("/products/request", {
        user_email: userData.email,
        user_id: userData.user_id,
        product_id: product.product_id,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Product request submitted!");
      }
    } catch (error) {
      console.error(
        "❌ Error requesting product:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to request product. Please try again.");
      setRequestedProducts((prev) =>
        prev.filter((id) => id !== product.product_id)
      ); // ❌ Revert UI update
    }
  };

  const renderProductCard = (product, isPresale = false) => {
    const isRequested = requestedProducts.includes(product.product_id);
    const isBuyNowAvailable = product.stripe_price_id;

    return (
      <div key={product.product_id} className="col-md-6 mb-4 p-4">
        <div className={`card p-3 ${isPresale ? "border-warning" : ""}`}>
          <h3 className={isPresale ? "text-warning" : ""}>
            {product.name} {isPresale && "🔥 (Presale)"}
          </h3>
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid rounded mb-2"
            style={{ maxHeight: "400px", objectFit: "cover" }} // ✅ Limits image height
            />
            <p className="py-2"><small>{product.description}</small></p>

          {/* Display price if userData exists */}
          {userData &&
          product.price !== undefined &&
          product.price !== null &&
          !isNaN(product.price) ? (
            <p>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(product.price)}
            </p>
          ) : (
            <p className="text-muted">Price not available</p>
          )}

          {userData ? (
            <button
              className={`btn mt-3 mb-2 ${
                isRequested ? "btn-secondary" : "btn-primary"
              }`}
              onClick={() => handleProductRequest(product)}
              disabled={isRequested}
            >
              {isRequested
                ? "Already Requested ✅"
                : isPresale
                ? "Request Presale Product"
                : "Request Product"}
            </button>
          ) : (
            <p className="text-muted mt-2">🔒 Login to request this product</p>
          )}

          {/* "Buy Now" button only if stripe_price_id exists */}
          {isBuyNowAvailable && (
            <button
              className="btn btn-success my-2"
              onClick={() => handleBuyNow(product)}
            >
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

    {/* ✅ Show Spinner While Loading */}
    {loading ? (
      <div className="text-center mt-5">
        <Spinner /> 
        <p>Loading products...</p>
      </div>
    ) : (
      <>
        {/* ✅ Show Presale Section ONLY if at least one presale product exists */}
        {products.some((product) => product?.is_presale) && (
          <div>
            <h3 className="mt-4 text-warning">🔥 Presale Products</h3>
            <div className="row">
              {products
                .filter((product) => product.is_presale)
                .map((product) => renderProductCard(product, true))}
            </div>
          </div>
        )}

        {/* ✅ Regular Products Section */}
        <h3 className="mt-4">All Products</h3>
        <div className="row">
          {products.filter((product) => !product.is_presale).length === 0 ? (
            <p>No products available.</p>
          ) : (
            products
              .filter((product) => !product.is_presale)
              .map((product) => renderProductCard(product, false))
          )}
        </div>
      </>
    )}
  </div>
  );
};

export default Shop;
