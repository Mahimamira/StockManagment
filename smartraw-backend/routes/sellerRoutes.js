// routes/sellerRoutes.js
// ✅ COMPLETE FILE - Copy this EXACTLY

const express = require("express");
const router = express.Router();

// ✅ Import the controller with ALL functions
const {
  registerSeller,
  loginSeller,
  getDashboardData,
  addProduct,
  updateStock,
  getSellerProfile,
  getSellerOrders,
  getSellerProducts,
  updateOrderStatus,
} = require("../controllers/sellerController");

// ✅ Import auth middleware
const auth = require("../middleware/auth");

console.log("🔧 Setting up seller routes...");

// ============================================
// 📌 PUBLIC AUTH ROUTES
// ============================================

router.post("/register", registerSeller);
router.post("/login", loginSeller);

// ============================================
// 📌 PROTECTED ROUTES (require auth)
// ============================================

router.get("/dashboard", auth, getDashboardData);
router.post("/add-product", auth, addProduct);
router.put("/update-stock", auth, updateStock);
router.get("/profile/:id", getSellerProfile);
router.get("/orders", auth, getSellerOrders);
router.get("/products", auth, getSellerProducts);
router.put("/orders/:orderId/status", auth, updateOrderStatus);

console.log("✅ Seller routes setup complete");

module.exports = router;