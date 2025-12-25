// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// ✅ If using CartContext
import { CartProvider } from "./context/CartContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
);

