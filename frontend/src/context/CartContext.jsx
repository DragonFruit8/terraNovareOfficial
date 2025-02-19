import { createContext, useContext, useEffect, useState } from "react";
import cartService from "../services/cart.service";
import { useUser } from "./UserContext"; // ✅ Import UserContext

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { userData, isLoggedIn } = useUser(); // ✅ Use userData from UserContext
  const [cartData, setCartData] = useState({ items: [] });

  // ✅ Fetch Cart when User Logs In
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userData || !userData.id) return;
        const response = await cartService.getCart(userData.id);
        setCartData(response.data || { items: [] });
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, [userData]); // ✅ Runs when userData changes

  // ✅ Add to Cart Function
  const addToCart = async (product) => {
    try {
      const response = await cartService.addToCart(product.product_id, 1);
      if (!response || !response.data) {
        console.error("❌ No response from addToCart API");
        return;
      }
  
      setCartData((prev) => {
        const updatedItems = prev?.items ? [...prev.items, product] : [product]; // ✅ Ensure prev.items is always an array
  
        return { ...prev, items: updatedItems };
      });
  
      // console.log("🛒 Cart Updated:", response.data);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };
  

  const increment = async (product_id) => {
    try {
      await cartService.increment(product_id); // Removed response assignment
      setCartData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product_id === product_id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      }));
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };
  
  const decrement = async (product_id) => {
    try {
      await cartService.decrement(product_id); // Removed response assignment
      setCartData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.product_id === product_id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      }));
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };


  const removeFromCart = async (product_id) => {
    try {
      await cartService.removeFromCart(product_id);
      setCartData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.product_id !== product_id),
      }));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ isLoggedIn, cartData, addToCart, increment, decrement, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };
