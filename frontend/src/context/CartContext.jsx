import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext"; // ✅ Import UserContext

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const { isLoggedIn } = useUser(); // ✅ Use userData from UserContext
  const [disableAddToCart, setDisableAddToCart] = useState(true); // ✅ Set to `true` initially
  const [cartData, setCartData] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : { items: [] }; // ✅ Always an object with `items: []`
  });

  // ✅ Ensure `cartData` is loaded properly from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    // DELETE AFTER IMPLEMENT
    setDisableAddToCart(true);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (!parsedCart.items) parsedCart.items = []; // ✅ Ensure `items` is always an array
        setCartData(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartData({ items: [] }); // ✅ Reset cart if corrupted
      }
    }
  }, []);

  // ✅ Sync `cartData` with localStorage every time it updates
  useEffect(() => {
    if (cartData && cartData.items) {
      localStorage.setItem("cart", JSON.stringify(cartData));
    }
  }, [cartData]);

  // ✅ Add to Cart Function
  const addToCart = (product) => {
    setCartData((prevCart) => {
      const updatedCart = { ...prevCart };
      if (!updatedCart.items) updatedCart.items = []; // ✅ Ensure `items` exists

      const existingItem = updatedCart.items.find(
        (item) => item.product_id === product.product_id
      );

      if (existingItem) {
        updatedCart.items = updatedCart.items.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart.items = [...updatedCart.items, { ...product, quantity: 1 }];
      }

      return updatedCart;
    });
  };

  const increment = (productId) => {
    setCartData((prevCart) => ({
      ...prevCart,
      items: prevCart.items?.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ) || [],
    }));
  };

  const decrement = (productId) => {
    setCartData((prevCart) => ({
      ...prevCart,
      items: prevCart.items
        ?.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) || [],
    }));
  };

  const removeFromCart = (productId) => {
    setCartData((prevCart) => ({
      ...prevCart,
      items: prevCart.items?.filter((item) => item.product_id !== productId) || [],
    }));
  };

  const mergedCart = (userCart) => {
    let mergedItems = [...(userCart.items || [])];

    (cartData.items || []).forEach((cartItem) => {
      const existingItem = mergedItems.find(
        (item) => item.product_id === cartItem.product_id
      );

      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        mergedItems.push(cartItem);
      }
    });

    setCartData({ items: mergedItems });
    localStorage.setItem("cart", JSON.stringify({ items: mergedItems }));
  };

  return (
    <CartContext.Provider
      value={{
        isLoggedIn,
        cartData,
        addToCart,
        increment,
        decrement,
        removeFromCart,
        mergedCart,
        disableAddToCart
      }}
    >
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
