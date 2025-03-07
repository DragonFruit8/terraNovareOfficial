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
    <div className="text-center mt-5" role="success message">
      <h2 aria-hidden="false" >Payment Successful! 🎉</h2>
      <p aria-hidden="false">Redirecting to home...</p>
    </div>
  );
};

export default Success;
