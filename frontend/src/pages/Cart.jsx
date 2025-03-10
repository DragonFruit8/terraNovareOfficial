import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartData, increment, decrement, removeFromCart } = useCart();
  const { userData, isProfileIncomplete, loading } = useUser();
  const navigate = useNavigate();
  const [canProceed, setCanProceed] = useState(false);

  // ✅ Log userData & isProfileIncomplete for debugging
  useEffect(() => {
    console.log("🔍 Debug: userData:", userData);
    console.log("🔍 Debug: isProfileIncomplete:", isProfileIncomplete());

    if (!loading) {
      setCanProceed(!isProfileIncomplete());
    }
  }, [loading, userData, isProfileIncomplete]);

  useEffect(() => {
    if (!loading && userData) {
      setCanProceed(!isProfileIncomplete()); // ✅ Ensure latest userData is used
    }
  }, [loading, userData, isProfileIncomplete]);

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="container mt-5">
        <h2>Your Cart is Empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Your Cart</h2>
      <div className="row">
        {cartData.items.map(
          ({ product_id, image_url, name, price, quantity }) => (
            <div key={product_id} className="col-md-12 mb-3">
              <div className="card p-3 d-flex flex-row align-items-center shadow-sm">
                {/* ✅ Product Image */}
                <img
                  src={image_url}
                  alt={name}
                  className="img-fluid img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    marginRight: "15px",
                  }}
                />

                {/* ✅ Product Details */}
                <div className="flex-grow-1">
                  <h5 className="mb-1">{name}</h5>
                  <p className="mb-1">Price: ${parseFloat(price).toFixed(2)}</p>

                  {/* ✅ Quantity Adjuster */}
                  <div className="d-flex align-items-center mt-2">
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() =>
                        quantity === 1
                          ? removeFromCart(product_id)
                          : decrement(product_id)
                      } // ✅ Remove if quantity is 1
                    >
                      -
                    </button>
                    <span className="mx-2">{quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-success ms-2"
                      onClick={() => increment(product_id)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ✅ Remove Item Button */}
                <button
                  className="btn btn-sm btn-danger ms-3"
                  onClick={() => removeFromCart(product_id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <h3 className="mt-4">
        Total: $
        {cartData.items
          .reduce(
            (sum, { price, quantity }) => sum + parseFloat(price) * quantity,
            0
          )
          .toFixed(2)}
      </h3>

      {/* ✅ Address Validation Message */}
      {!canProceed && !loading && (
        <p className="text-danger mt-3">
          ⚠️ Your shipping address is incomplete. Please update your profile
          before proceeding to checkout.
        </p>
      )}

      {/* ✅ Proceed to Checkout Button */}
      <button
        className="btn btn-primary mt-3"
        onClick={() => navigate("/checkout")}
        disabled={!canProceed}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
