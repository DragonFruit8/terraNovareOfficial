import React from "react";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Success = () => {
  const { userData } = useUser();
  const { cartData } = useCart();

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success fw-bold">Payment Successful! 🎉</h2>
      <p className="text-muted">Your order has been processed successfully.</p>

      {/* ✅ Address Verification Section */}
      <div className="mt-4 p-3 border rounded shadow-sm bg-light">
        <h4 className="fw-bold">Shipping Address</h4>
        <p>
          {userData?.name || "Customer Name"} <br />
          {userData?.address || "Street Address"} <br />
          {userData?.city}, {userData?.state} {userData?.zip} <br />
          {userData?.country || "USA"} <br />
        </p>
      </div>

      {/* ✅ Order Details */}
      <div className="mt-4 p-3 border rounded shadow-sm">
        <h4 className="fw-bold">Order Summary</h4>
        {cartData.items?.map((item) => (
          <p key={item.product_id}>
            {item.quantity}x {item.name} - ${item.price.toFixed(2)}
          </p>
        ))}
        <h4 className="fw-bold mt-3">Total: $
          {cartData.items?.reduce((sum, { price, quantity }) => sum + parseFloat(price) * quantity, 0).toFixed(2)}
        </h4>
      </div>

      <p className="mt-3 text-muted">Please verify your address. If incorrect, contact support.</p>
    </div>
  );
};

export default Success;
