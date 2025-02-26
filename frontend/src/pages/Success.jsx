import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    clearCart();
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [clearCart, navigate]);

  return (
    <div className="text-center mt-5">
      <h2>Payment Successful! 🎉</h2>
      <p>Redirecting to home...</p>
    </div>
  );
};

export default Success;
