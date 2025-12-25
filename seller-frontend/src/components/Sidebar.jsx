// components/Sidebar.jsx
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "../utils/axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = () => {
  const [seller, setSeller] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("sellerToken");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        axios
          .get(`/profile/${decoded.id}`)
          .then((res) => {
            // ✅ Handle both response formats
            setSeller(res.data.seller || res.data);
          })
          .catch((err) => {
            console.error("Failed to fetch seller profile:", err);
          });
      } catch (err) {
        console.error("Token decode error:", err);
        localStorage.removeItem("sellerToken");
        navigate("/login");
      }
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // ✅ Helper to check active route
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 h-screen fixed bg-orange-700 text-white p-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-4">SmartRaw</h1>

        {/* Profile Section */}
        <div className="relative mb-6">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <FaUserCircle className="text-4xl text-white" />
            <span className="text-lg font-semibold text-white">
              {seller.name || "Loading..."}
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
              <div className="px-4 py-2 border-b border-gray-200 text-sm">
                {seller.email}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ✅ FIXED: Correct routes */}
        <nav className="flex flex-col gap-3">
          <Link
            to="/seller/dashboard"
            className={`p-2 rounded transition ${
              isActive("/seller/dashboard")
                ? "bg-orange-800 text-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/seller/add-product"
            className={`p-2 rounded transition ${
              isActive("/seller/add-product")
                ? "bg-orange-800 text-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            ➕ Add Product
          </Link>
          <Link
            to="/seller/orders"
            className={`p-2 rounded transition ${
              isActive("/seller/orders")
                ? "bg-orange-800 text-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            📦 Orders
          </Link>
          <Link
            to="/seller/stocks"
            className={`p-2 rounded transition ${
              isActive("/seller/stocks")
                ? "bg-orange-800 text-yellow-300"
                : "hover:text-yellow-300"
            }`}
          >
            📋 Stocks
          </Link>
        </nav>
      </div>

      <div className="text-sm text-white/70">{seller.email}</div>
    </div>
  );
};

export default Sidebar;
