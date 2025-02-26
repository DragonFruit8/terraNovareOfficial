import React from "react";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cartData, cartSubtotal, increment, decrement, removeFromCart } = useCart();

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return <div className="container mt-5"><h2>Your Cart is Empty 🛒</h2></div>;
  }

  return (
    <div className="container mt-5">
    <h2>Your Cart</h2>
    <div className="row">
      {cartData.items.map((item) => (
        <div key={item.product_id} className="col-md-4">
          <div className="card">
            <img src={item.image_url} alt={item.name} className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">{item.name}</h5>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="d-flex align-items-center">
                <button className="btn btn-sm btn-secondary me-2" onClick={() => decrement(item.product_id)}> - </button>
                <span>{item.quantity}</span>
                <button className="btn btn-sm btn-secondary ms-2" onClick={() => increment(item.product_id)}> + </button>
              </div>
              <button className="btn btn-danger mt-2" onClick={() => removeFromCart(item.product_id)}>❌ Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
    <h3 className="mt-4">Total: ${cartSubtotal.toFixed(2)}</h3>
    <button className="btn btn-primary mt-3">Proceed to Checkout</button>
  </div>
  );
};

export default Cart;
