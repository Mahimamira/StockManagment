// routes/admin.js
const express = require("express");
const router = express.Router();
const Seller = require("../models/Seller");
const Order = require("../models/Order");
const adminAuth = require("../middleware/adminAuth");

const {
  register,
  login
} = require("../controllers/adminController");

// --- Admin Auth ---
router.post("/register", register);
router.post("/login", login);

// --- View all sellers ---
router.get("/sellers", adminAuth, async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});

// --- Verify seller ---
// routes/adminRoutes.js or similar
// routes/admin.js or wherever your admin routes are
// backend route
// PUT /api/admin/verify-seller/:id
router.put("/verify-seller/:id", adminAuth, async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(
      req.params.id,
      { verified: true }, // ✅ make sure field matches schema
      { new: true }
    );
    if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({ seller: updatedSeller });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});





// --- Remove seller ---
router.delete("/remove-seller/:id", adminAuth, async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove seller" });
  }
});

// --- Ranked Sellers by Order Count ---
router.get("/ranked-sellers", adminAuth, async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password");

    const sellersWithOrders = await Promise.all(
      sellers.map(async (seller) => {
        const orderCount = await Order.countDocuments({ seller: seller._id });
        return { ...seller.toObject(), totalOrders: orderCount };
      })
    );

    // Sort sellers by highest to lowest order count
    sellersWithOrders.sort((a, b) => b.totalOrders - a.totalOrders);

    res.json(sellersWithOrders);
  } catch (err) {
    console.error("Error ranking sellers:", err);
    res.status(500).json({ message: "Error ranking sellers", error: err.message });
  }
});

module.exports = router;
