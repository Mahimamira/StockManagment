// controllers/sellerController.js
const Seller = require("../models/Seller");
const Product = require("../models/Product");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================
// 1️⃣ REGISTER SELLER
// ========================
const registerSeller = async (req, res) => {
  try {
    console.log("📝 Register seller - Body:", req.body);

    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "Name, email, password, and phone required" });
    }

    const existing = await Seller.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ FIXED: Handle location properly
    let locationData = {
      type: "Point",
      coordinates: [0, 0], // Default coordinates
    };

    if (location && location.coordinates) {
      locationData = location;
    } else if (location && typeof location === "object") {
      locationData = {
        type: "Point",
        coordinates: [
          parseFloat(location.longitude) || 0,
          parseFloat(location.latitude) || 0,
        ],
      };
    }

    const seller = await Seller.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      location: locationData,
    });

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET || "seller_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      token,
      sellerId: seller._id,
      name: seller.name,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
};

// ========================
// 2️⃣ LOGIN SELLER
// ========================
const loginSeller = async (req, res) => {
  try {
    console.log("🔐 Login seller - Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const seller = await Seller.findOne({ email: email.toLowerCase() });
    if (!seller) {
      return res.status(400).json({ error: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: seller._id },
      process.env.JWT_SECRET || "seller_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      sellerId: seller._id,
      name: seller.name,
      email: seller.email,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ========================
// 3️⃣ GET DASHBOARD DATA
// ========================
const getDashboardData = async (req, res) => {
  try {
    console.log("📊 Dashboard data - Seller ID:", req.seller._id);

    const sellerId = req.seller._id;

    const products = await Product.find({ sellerId });
    const orders = await Order.find({ seller: sellerId });

    let totalEarnings = 0;
    let unitsSold = 0;

    orders.forEach((order) => {
      totalEarnings += order.totalPrice || 0;
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          unitsSold += item.quantity || 0;
        });
      }
    });

    res.json({
      success: true,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalEarnings,
      unitsSold,
    });
  } catch (err) {
    console.error("❌ Dashboard error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// ========================
// 4️⃣ ADD PRODUCT
// ========================
const addProduct = async (req, res) => {
  try {
    console.log("➕ Add product - Body:", req.body);

    const { name, price, stock, description, image } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Name, price, and stock required" });
    }

    const product = await Product.create({
      sellerId: req.seller._id,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      description: description || "",
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("❌ Add product error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

// ========================
// 5️⃣ UPDATE STOCK
// ========================
const updateStock = async (req, res) => {
  try {
    console.log("📦 Update stock - Body:", req.body);

    const { productId, stock, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // ✅ Verify product belongs to seller
    if (product.sellerId.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (stock !== undefined) product.stock = parseInt(stock);
    if (price !== undefined) product.price = parseFloat(price);

    await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("❌ Update stock error:", err);
    res.status(500).json({ error: "Failed to update stock" });
  }
};

// ========================
// 6️⃣ GET SELLER PROFILE
// ========================
const getSellerProfile = async (req, res) => {
  try {
    console.log("👤 Get seller profile - ID:", req.params.id);

    const seller = await Seller.findById(req.params.id).select("-password");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.json(seller); // ✅ Return seller directly for frontend compatibility
  } catch (err) {
    console.error("❌ Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ========================
// 7️⃣ GET SELLER ORDERS
// ========================
const getSellerOrders = async (req, res) => {
  try {
    console.log("📋 Get seller orders - Seller ID:", req.seller._id);

    const orders = await Order.find({ seller: req.seller._id })
      .populate("items.productId", "name")
      .sort({ orderedAt: -1 });

    res.json(orders); // ✅ Return array directly
  } catch (err) {
    console.error("❌ Get orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ========================
// 8️⃣ GET SELLER PRODUCTS
// ========================
const getSellerProducts = async (req, res) => {
  try {
    console.log("📦 Get seller products - Seller ID:", req.seller._id);

    const products = await Product.find({ sellerId: req.seller._id });

    res.json(products); // ✅ Return array directly
  } catch (err) {
    console.error("❌ Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ========================
// 9️⃣ UPDATE ORDER STATUS
// ========================
const updateOrderStatus = async (req, res) => {
  try {
    console.log("🔄 Update order status - Body:", req.body);

    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ✅ Verify order belongs to seller
    if (order.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.error("❌ Update status error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// ========================
// 🔟 EXPORT ALL FUNCTIONS
// ========================
module.exports = {
  registerSeller,
  loginSeller,
  getDashboardData,
  addProduct,
  updateStock,
  getSellerProfile,
  getSellerOrders,
  getSellerProducts,
  updateOrderStatus,
};
