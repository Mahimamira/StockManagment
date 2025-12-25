// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  getUserProfile,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  placeOrder,
  getUserOrders,
  getAllProducts,
} = require("../controllers/userController");

const authUser = require("../middleware/authUser");

console.log("🔧 Setting up user routes...");

// ============================================
// 📌 PUBLIC ROUTES
// ============================================
router.post("/register", registerUser);
router.post("/login", login);

// ✅ Products route (can be accessed without auth for browsing)
router.get("/products/all", getAllProducts);

// ============================================
// 📌 PROTECTED ROUTES (require auth)
// ============================================
router.get("/profile", authUser, getUserProfile);

// ============================================
// 📌 CART ROUTES
// ============================================
router.get("/cart", authUser, getCart);
router.post("/cart/add", authUser, addToCart);
router.put("/cart/update", authUser, updateCartItem);
router.delete("/cart/:productId", authUser, removeCartItem);

// ============================================
// 📌 ORDER ROUTES
// ============================================
router.post("/orders/place", authUser, placeOrder);
router.get("/orders", authUser, getUserOrders);

console.log("✅ User routes setup complete");

module.exports = router;
