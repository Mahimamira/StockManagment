// ============================================
// 🧭 components/user/UserNavbar.jsx (with Cart Count)
// ============================================
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

export default function UserNavbar({ setSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/user/login");
  };

  const cartCount = getCartCount();

  return (
    <nav className="bg-white text-black border-b-2 border-orange-500 shadow-md px-6 py-3 flex justify-between items-center">
      <div
        className="text-2xl font-bold text-orange-600 cursor-pointer"
        onClick={() => navigate("/user/home")}
      >
        SmartRaw
      </div>

      <div className="flex-grow px-4">
        <input
          type="text"
          placeholder="Search masala, chat..."
          className="w-full border-b border-gray-400 focus:outline-none py-1 px-2"
          onChange={(e) => {
            setQuery(e.target.value);
            setSearch(e.target.value);
          }}
          value={query}
        />
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => navigate("/user/orders")}>Orders</button>
        
        {/* Cart with Badge */}
        <button 
          onClick={() => navigate("/user/cart")}
          className="relative"
        >
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        
        <button onClick={() => navigate("/user/profile")}>👤</button>
        <button onClick={handleLogout} className="text-orange-600">
          Logout
        </button>
      </div>
    </nav>
  );
}