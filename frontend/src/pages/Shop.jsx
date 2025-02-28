import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  `pk_live_51H9yaJCJsM5FOXWHe4MYqZdeoHiRQHmwDkmXuvs1qqprojx7p2kJq4QiDZOjTp7bhWjWi9VroFyPgQuSr9rwLOmT00fjHhiTva`
);

const Shop = () => {
  const { userData } = useUser();
  const [products, setProducts] = useState([]); 
  const [requestedProducts, setRequestedProducts] = useState([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("📡 Fetching products...");
        const response = await axiosInstance.get("/products");

        if (!response.data || response.data.length === 0) {
          toast.warning("⚠️ No products available.");
        }

        setProducts(response.data);
        console.log("✅ Products fetched:", response.data);
      } catch (error) {
        console.error("❌ Error fetching products:", error.response?.data || error.message);
        toast.error("❌ Failed to load products.");
      }
    };

    fetchProducts();
  }, []);

  /** ✅ Improved handleBuyNow */
  const handleBuyNow = async (product) => {
    if (!product?.stripe_price_id) {
      toast.error("⚠️ This product is not available for direct purchase.");
      return;
    }
  
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("❌ Stripe failed to load");
        return;
      }
  
      const { data } = await axiosInstance.post("/stripe/checkout", {
        product,
        userEmail: userData?.email,
      });
  
      console.log("🔹 Redirecting to:", data.url);
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("❌ Failed to initiate payment.");
      }
    } catch (error) {
      console.error("❌ Checkout session error:", error);
      toast.error("❌ Payment could not be processed.");
    }
  };
  

  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;

      try {
        console.log("🔍 Fetching requested products for:", userData.email);
        const { data } = await axiosInstance.get(`/products/requested?email=${encodeURIComponent(userData.email)}`);
        setRequestedProducts(data.map((req) => req.product_id));
      } catch (error) {
        console.error("❌ Error fetching requested products:", error.response?.data || error.message);
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
      console.error("❌ Error requesting product:", error.response?.data || error.message);
      toast.error("❌ Failed to request product. Please try again.");
      setRequestedProducts((prev) => prev.filter((id) => id !== product.product_id)); // ❌ Revert UI update
    }
  };

  const renderProductCard = (product, isPresale = false) => {
    const isRequested = requestedProducts.includes(product.product_id);
    const isBuyNowAvailable = product.stripe_price_id;

    return (
      <div key={product.product_id} className="col-md-4 mb-4">
        <div className={`card p-3 ${isPresale ? "border-warning" : ""}`}>
          <h5 className={isPresale ? "text-warning" : ""}>
            {product.name} {isPresale && "🔥 (Presale)"}
          </h5>
          <p>{product.description}</p>
          <img src={product.image_url} alt={product.name} className="img-fluid" />

          {/* Display price if userData exists */}
          {userData && (
            <p>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</p>
          )}

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
            <button className="btn btn-success mt-2" onClick={() => handleBuyNow(product)}>
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
      
      {/* ✅ Show Presale Section ONLY if at least one presale product exists */}
      {products.some((product) => product?.is_presale) && (
        <div>
          <h3 className="mt-4 text-warning">🔥 Presale Products</h3>
          <div className="row">
            {products.filter((product) => product.is_presale).map((product) => renderProductCard(product, true))}
          </div>
        </div>
      )}

      {/* ✅ Regular Products Section */}
      <h3 className="mt-4">All Products</h3>
      <div className="row">
        {products.filter((product) => !product.is_presale).length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.filter((product) => !product.is_presale).map((product) => renderProductCard(product, false))
        )}
      </div>
    </div>
  );
};

export default Shop;
