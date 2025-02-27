import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosInstance from "../api/axios.config"; // ✅ Import backend API config

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    if (!stripe || !elements) {
      setMessage("❌ Stripe is not loaded. Try again.");
      setIsProcessing(false);
      return;
    }

    try {
      // ✅ Step 1: Create a PaymentIntent on the backend
      const { data } = await axiosInstance.post("/checkout/create-payment-intent", {
        email,
        name,
        amount: 5000, // Amount in cents ($50.00)
      });

      // ✅ Step 2: Confirm Payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      });

      if (error) {
        setMessage(`❌ Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful! Thank you.");
      }

    } catch (error) {
      console.error("❌ Payment error:", error);
      setMessage("❌ Payment failed. Please try again.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="border p-4 rounded">
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Card Details</label>
          <CardElement className="form-control p-2" />
        </div>

        <button type="submit" className="btn   w-100" disabled={!stripe || isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
