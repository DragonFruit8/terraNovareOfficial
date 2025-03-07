import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  `pk_live_51H9yaJCJsM5FOXWHe4MYqZdeoHiRQHmwDkmXuvs1qqprojx7p2kJq4QiDZOjTp7bhWjWi9VroFyPgQuSr9rwLOmT00fjHhiTva`
);

const CheckoutModal = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 aria-hidden="false" >Checkout for {product.name}</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm productId={product.product_id} quantity={1} />
        </Elements>
        <button className="btn btn-secondary mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
