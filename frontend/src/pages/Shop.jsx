import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios.config";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import Meta from "../components/Meta";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Shop = () => {
  const { userData } = useUser();
  const { cartData, addToCart, increment, decrement, disableAddToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const navigate = useNavigate(); // Use for redirecting

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await axiosInstance.get("/products", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setProducts(response.data || []);
    } catch (error) {
      console.error(
        "❌ Error fetching products:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchRequestedProducts = async () => {
      if (!userData?.email) return;

      try {
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

  const handleBuyNow = async (product) => {
    if (!product.stripe_price_id?.startsWith("price_")) {
      toast.error("⚠️ Payment failed. Invalid product price.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/stripe/checkout", {
        price_id: product.stripe_price_id,
        userEmail: userData?.email,
      });

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Stripe session URL missing");
      }
    } catch (error) {
      console.error(
        "❌ Checkout session error:",
        error.response?.data || error.message
      );
      toast.error("❌ Payment failed. Try again.");
    }
  };

  const handleProductRequest = async (product) => {
    if (requestedProducts.includes(product.product_id)) {
      toast.warning("This product has already been requested!");
      return;
    }

    setRequestedProducts((prev) => [...prev, product.product_id]);

    try {
      await axiosInstance.post("/products/request", {
        user_email: userData.email,
        user_id: userData.user_id,
        product_id: product.product_id,
      });

      toast.success("✅ Product request submitted!");
    } catch (error) {
      console.error(
        "❌ Error requesting product:",
        error.response?.data || error.message
      );
      toast.error("❌ Failed to request product.");
      setRequestedProducts((prev) =>
        prev.filter((id) => id !== product.product_id)
      );
    }
  };

  const handleImageClick = (product) => setSelectedProduct(product);
  const handleCloseModal = () => setSelectedProduct(null);

  const renderProductCard = (product, isPresale = false) => {
    const isRequested = requestedProducts.includes(product.product_id);
    const cartItems = cartData.items || []; // Ensure `items` exists
    const cartItem = cartItems.find(
      (item) => item.product_id === product.product_id
    );
    const quantity = cartItem?.quantity || 0;

    return (
      <div key={product.product_id} className="col-md-4 mb-4 p-4">
        <div className={`card p-3 ${isPresale ? "border-warning" : ""}`}>
          <h3 className={`mb-2 ${isPresale ? "text-warning" : ""}`}>
            {product.name} {isPresale && "🔥 (Presale)"}
          </h3>
          <img
            src={product.image_url}
            alt={product.name}
            className="img-fluid rounded mb-2"
            style={{
              maxHeight: "400px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(product)}
            role="button"
            aria-label={`View details for ${product.name}`}
          />
          <p className="text-muted">
            <small>{product.description}</small>
          </p>
          {userData ? (
            product.price ? (
              <p className="fw-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </p>
            ) : (
              <p className="text-muted">Price not available</p>
            )
          ) : (
            <p className="text-muted">🔒 Login to see pricing</p>
          )}
          {userData && (
            <button
              className={`btn mt-3 ${
                isRequested ? "btn-secondary" : "btn-primary"
              }`}
              onClick={() => handleProductRequest(product)}
              disabled={isRequested}
              aria-label={
                isRequested ? "Already requested" : "Request this product"
              }
            >
              {isRequested ? "Already Requested ✅" : "Request Product"}
            </button>
          )}
          {product.stripe_price_id && (
            <button
              className="btn btn-success my-2"
              onClick={() => handleBuyNow(product)}
            >
              Buy Now
            </button>
          )}
          {!disableAddToCart && (
            <button
              className="btn btn-primary"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          )}
          {/* <button
            className="btn btn-primary my-2"
            onClick={() =>
              quantity > 0 ? navigate("/cart") : addToCart(product)
            }
          >
            {quantity > 0 ? "Go to Cart 🛒" : "Add to Cart"}
          </button> */}
          {quantity > 0 && (
            <div className="d-flex justify-content-center my-2">
              <button
                className="btn btn-danger me-3"
                onClick={() => decrement(product.product_id)}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="btn btn-success ms-3"
                onClick={() => increment(product.product_id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Meta
        title="Terra'Novare | Shop - Exclusive Products with Purpose"
        description="Support sustainability & Human Empowerment with Terra'Novare's exclusive shop."
        keywords="Reimagining eco-friendly products, sustainability, shop sustainable, ethical shopping"
        url="https://terranovare.tech/shop"
        image="/images/shop-preview.jpg"
      />

      <div className="container mt-5 min-vh-100">
        <h2>Shop</h2>

        {loading ? (
          <div className="text-center mt-5">
            <Spinner />
            <p>Loading products...</p>
          </div>
        ) : (
          <>
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

            <h3 className="mt-4">All Products</h3>
            <div className="row">
              {products
                .filter((product) => !product.is_presale)
                .map((product) => renderProductCard(product))}
            </div>
          </>
        )}
      </div>

      {selectedProduct && (
        <Modal show={true} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="img-fluid mb-3 rounded"
            />
            <p>{selectedProduct.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default Shop;
