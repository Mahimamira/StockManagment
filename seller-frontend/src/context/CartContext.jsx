// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosUser from "../utils/axiosUser";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend on mount
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      fetchCartFromBackend();
    }
  }, []);

  const fetchCartFromBackend = async () => {
    try {
      const { data } = await axiosUser.get("/cart");
      console.log("📦 Cart fetched from backend:", data);
      setCartItems(data || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartItems([]);
    }
  };

  const addToCart = async (product) => {
    try {
      setLoading(true);
      console.log("➕ Adding to cart:", product.name);

      await axiosUser.post("/cart/add", { productId: product._id });

      // Update local state immediately for better UX
      const existingItem = cartItems.find(
        (item) => item.product?._id === product._id
      );

      if (existingItem) {
        setCartItems(
          cartItems.map((item) =>
            item.product?._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems([...cartItems, { product, quantity: 1 }]);
      }

      console.log("✅ Added to cart successfully");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err);
      alert(err.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);

      const item = cartItems.find((item) => item.product?._id === productId);

      if (item && item.quantity > 1) {
        // Decrease quantity
        console.log("➖ Decreasing quantity for:", productId);
        await axiosUser.put("/cart/update", { productId, action: "decrement" });

        setCartItems(
          cartItems.map((item) =>
            item.product?._id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      } else {
        // Remove completely
        console.log("🗑️ Removing from cart:", productId);
        await axiosUser.delete(`/cart/${productId}`);

        setCartItems(cartItems.filter((item) => item.product?._id !== productId));
      }

      console.log("✅ Cart updated");
    } catch (err) {
      console.error("❌ Failed to update cart:", err);
      alert(err.response?.data?.error || "Failed to update cart");
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        getCartCount,
        loading,
        fetchCartFromBackend,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
