import { CardElement, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import axiosInstance from "../api/axios.config";

const CheckoutForm = ({ productId, quantity }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      // Get Payment Intent Client Secret
      const { data } = await axiosInstance.post("/stripe/create-payment-intent", {
        productId,
        quantity,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setMessage(error.message);
      } else if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful! 🎉");
      }
    } catch (error) {
      setMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h2 aria-hidden="false" >Complete Your Purchase</h2>
      <CardElement className="form-control mb-3" />
        <PaymentElement />
      <button className="btn btn-primary" disabled={isProcessing || !stripe}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
      {message && <p aria-hidden="false" className="mt-3 text-danger">{message}</p>}
    </form>
  );
};

export default CheckoutForm;
