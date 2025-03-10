import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axiosInstance from "../api/axios.config";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ cartItems }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cartData, clearCart } = useCart();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      // ✅ Send cart details to backend for payment processing
      const { data } = await axiosInstance.post("/stripe/checkout", {
        email: userData?.email,
        cartItems,
      });

      if (data?.clientSecret) {
        const { paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: elements.getElement(CardElement) },
        });

        if (paymentIntent.status === "succeeded") {
          // ✅ Send confirmation email after successful payment
          await axiosInstance.post("/send-confirmation-email", {
            email: userData?.email,
            cartItems,
            total: cartData.items.reduce((sum, { price, quantity }) => sum + parseFloat(price) * quantity, 0),
          });

          // ✅ Clear cart after successful purchase
          clearCart();
          navigate("/success");
        }
      }
    } catch (error) {
      console.error("❌ Payment error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="mb-3" />
      <button className="btn btn-success" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default CheckoutForm;
