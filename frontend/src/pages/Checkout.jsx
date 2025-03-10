import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { stripePromise } from "../api/stripe.config";
import CheckoutForm from "../components/CheckoutForm";

const Checkout = () => {
  const { cartData } = useCart();

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary fw-bold">Secure Checkout</h2>
      
      <div className="row mt-4">
        {/* ✅ Order Summary Section */}
        <div className="col-md-6">
          <h4 className="fw-bold">Order Summary</h4>
          <div className="order-summary p-3 rounded shadow-sm bg-light">
            {cartData.items && cartData.items.length > 0 ? (
              cartData.items.map(({ product_id, image_url, name, price, quantity }) => (
                <div key={product_id} className="d-flex align-items-center mb-3 border-bottom pb-2">
                  <img
                    src={image_url}
                    alt={name}
                    className="img-thumbnail me-3"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{name}</h5>
                    <p className="mb-1 text-muted">
                      {quantity} × ${parseFloat(price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Your cart is empty.</p>
            )}
            <h4 className="fw-bold mt-3">Total: $
              {cartData.items?.reduce((sum, { price, quantity }) => sum + parseFloat(price) * quantity, 0).toFixed(2)}
            </h4>
          </div>
        </div>

        {/* ✅ Checkout Form Section */}
        <div className="col-md-6">
          <h4 className="fw-bold">Payment Details</h4>
          <div className="p-4 shadow-sm bg-white rounded">
            <Elements stripe={stripePromise}>
              <CheckoutForm cartItems={cartData.items} />
            </Elements>
          </div>
        </div>
      </div>
      
      {/* ✅ Simple Styling for Professional Look */}
      <style>
        {`
          .order-summary {
            max-height: 300px;
            overflow-y: auto;
          }
          .bg-light {
            background-color: #f8f9fa !important;
          }
        `}
      </style>
    </div>
  );
};

export default Checkout;
