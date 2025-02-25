import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios.config";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Shop = () => {
  const { userData } = useUser(); 
  const [products, setProducts] = useState([]); // ✅ Store products
  const [requestedProducts, setRequestedProducts] = useState([]); // ✅ Store requested products

  useEffect(() => {
    // ✅ Fetch all products
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products");
        console.log(data) // See SAID DATA!
        setProducts(data); // ✅ Use setProducts
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // ✅ Fetch previously requested products
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;

      try {
        console.log("🔍 Fetching requested products for:", userData.email);

        const { data } = await axiosInstance.get(`/products/requested?email=${encodeURIComponent(userData.email)}`);
        setRequestedProducts(data.map((req) => req.product_id)); // ✅ Store requested product IDs
      } catch (error) {
        console.error("❌ Error fetching requested products:", error.response?.data || error.message);
      }
    };

    fetchRequestedProducts();
  }, [userData]);

  
  useEffect(() => {
    const fetchRequestedProducts = async () => {
        if (!userData?.email) return;

        try {
            console.log("🔍 Fetching requested products for:", userData.email);

            const { data } = await axiosInstance.get(`/products/requested?email=${encodeURIComponent(userData.email)}`);
            setRequestedProducts(data.map((req) => req.product_id)); // ✅ Store requested product IDs
        } catch (error) {
            console.error("❌ Error fetching requested products:", error.response?.data || error.message);
        }
    };

    fetchRequestedProducts();
}, [userData]);




const handleProductRequest = async (product) => {
  if (!product?.product_id) {
      console.error("❌ Missing product ID:", product);
      toast.error("Invalid product data.");
      return;
  }

const token = localStorage.getItem("token");
  if (!token) {
      toast.error("Session expired. Please log in again.");
      return;
  }

  try {
      console.log("📩 Sending Request Data:", { product_id: product.product_id });

      const response = await axiosInstance.post(
          "/products/request",
          { product_id: product.product_id }, 
          { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
          toast.success(response.data.message);

          // ✅ Immediately update the requestedProducts state
          setRequestedProducts((prevRequested) => [...new Set([...prevRequested, product.product_id])]);
      } else {
          throw new Error(response.data.message || "Product request failed.");
      }
  } catch (error) {
      console.error("❌ Request Error:", error.response?.data || error.message);

      if (error.response?.status === 409) {
          toast.info("⚠️ This product has already been requested.");
          setRequestedProducts((prevRequested) => [...new Set([...prevRequested, product.product_id])]); // ✅ Ensure UI updates
      } else if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("token"); 
          window.location.reload();
      } else {
          toast.error(error.response?.data?.error || "Failed to request product.");
      }
  }
};

  return (
    <div className="container mt-5 min-vh-100">
    <h2>Shop</h2>
    <div className="row">
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => {
          const isRequested = requestedProducts.includes(product.product_id); // ✅ Check if product is requested
  
          return (
            <div key={product.product_id} className="col-md-4 mb-4">
              <div className="card p-3">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
                <img src={product.image_url} alt={product.name} className="img-fluid" />
  
                {/* ✅ Only show button if the user is logged in */}
                {userData ? (
                  <button 
                    className={`btn mt-3 ${isRequested ? "btn-secondary" : "btn-primary"}`} 
                    onClick={() => handleProductRequest(product)}
                    disabled={isRequested} // ✅ Disable if already requested
                  >
                    {isRequested ? "Already Requested ✅" : "Request Product"}
                  </button>
                ) : (
                  <p className="text-muted mt-2">🔒 Login to request this product</p> // ✅ Show message for non-logged-in users
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
  
  );
};

export default Shop;
