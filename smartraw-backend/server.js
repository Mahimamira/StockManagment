// server.js
// ✅ COMPLETE FILE - Copy this EXACTLY

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("\n🚀 Starting server...\n");

// ============================================
// 📌 MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log("✅ Middleware loaded");

// ============================================
// 📌 DATABASE CONNECTION
// ============================================
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/smartraw",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ============================================
// 📌 ROUTES
// ============================================

console.log("\n🔧 Loading routes...\n");

// User routes
try {
  const userRoutes = require("./routes/userRoutes");
  app.use("/api/user", userRoutes);
  console.log("✅ /api/user routes loaded");
} catch (err) {
  console.error("❌ Error loading user routes:", err.message);
}

// Seller routes
try {
  const sellerRoutes = require("./routes/sellerRoutes");
  app.use("/api/seller", sellerRoutes);
  console.log("✅ /api/seller routes loaded");
} catch (err) {
  console.error("❌ Error loading seller routes:", err.message);
}

// Order routes (optional - orders are in user/seller routes)
try {
  const orderRoutes = require("./routes/orderRoutes");
  app.use("/api/orders", orderRoutes);
  console.log("✅ /api/orders routes loaded");
} catch (err) {
  console.error("❌ Error loading order routes:", err.message);
}
// Admin routes
try {
  const adminRoutes = require("./routes/adminRoutes");
  app.use("/api/admin", adminRoutes);
  console.log("✅ /api/admin routes loaded");
} catch (err) {
  console.error("❌ Error loading admin routes:", err.message);
}


// ============================================
// 📌 HEALTH CHECK
// ============================================
app.get("/", (req, res) => {
  res.send("api is running");
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// 📌 ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

// ============================================
// 📌 START SERVER
// ============================================

app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log(`🎉 Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
  console.log("=".repeat(50) + "\n");
});