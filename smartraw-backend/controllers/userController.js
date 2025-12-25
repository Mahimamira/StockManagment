// controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ========================
// 1️⃣ REGISTER USER
// ========================
const registerUser = async (req, res) => {
  try {
    console.log("📝 Register user - Body:", req.body);

    const { name, email, password, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      location: location || { lat: 0, lng: 0 },
      cart: [],
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "user_secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      userId: user._id,
      name: user.name,
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed", details: err.message });
  }
};

// ========================
// 2️⃣ LOGIN USER
// ========================
const login = async (req, res) => {
  try {
    console.log("🔐 Login user");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "user_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      userId: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ========================
// 3️⃣ GET USER PROFILE
// ========================
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ========================
// 4️⃣ GET CART
// ========================
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart || []);
  } catch (err) {
    console.error("❌ Get cart error:", err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// ========================
// 5️⃣ ADD TO CART
// ========================
const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.json({
      success: true,
      message: "Added to cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};

// ========================
// 6️⃣ UPDATE CART ITEM
// ========================
const updateCartItem = async (req, res) => {
  try {
    const { productId, action } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not in cart" });
    }

    if (action === "increment") {
      user.cart[itemIndex].quantity += 1;
    } else if (action === "decrement") {
      if (user.cart[itemIndex].quantity > 1) {
        user.cart[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity becomes 0
        user.cart.splice(itemIndex, 1);
      }
    }

    await user.save();

    res.json({
      success: true,
      cart: user.cart,
    });
  } catch (err) {
    console.error("❌ Update cart error:", err);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

// ========================
// 7️⃣ REMOVE FROM CART
// ========================
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: "Removed from cart",
      cart: user.cart,
    });
  } catch (err) {
    console.error("❌ Remove from cart error:", err);
    res.status(500).json({ error: "Failed to remove item" });
  }
};

// ========================
// 8️⃣ PLACE ORDER
// ========================
const placeOrder = async (req, res) => {
  try {
    console.log("📦 Place order - Body:", req.body);

    const userId = req.user._id;
    const { cartItems } = req.body;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let totalPrice = 0;
    const orderItems = [];
    let sellerId = null;

    // Validate and process items
    for (const item of cartItems) {
      const productId = item.product?._id || item.product;
      const product = await Product.findById(productId).populate("sellerId");

      if (!product) {
        return res.status(404).json({ error: `Product not found: ${productId}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      if (!sellerId) sellerId = product.sellerId._id;

      totalPrice += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      // ✅ Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // ✅ Create order with expected delivery (3 days from now)
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 3);

    const order = new Order({
      user: userId,
      userName: user.name,
      userPhone: user.phone || "N/A",
      userLocation: user.location,
      items: orderItems,
      totalPrice,
      expectedDelivery,
      status: "Placed",
      seller: sellerId,
    });

    await order.save();

    // ✅ Clear user's cart
    user.cart = [];
    await user.save();

    console.log("✅ Order created:", order._id);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        _id: order._id,
        totalPrice: order.totalPrice,
        expectedDelivery: order.expectedDelivery,
        status: order.status,
      },
    });
  } catch (err) {
    console.error("❌ Place order error:", err);
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
};

// ========================
// 9️⃣ GET USER ORDERS
// ========================
const getUserOrders = async (req, res) => {
  try {
    console.log("📋 Get user orders for:", req.user._id);

    // ✅ Query by user ID, not userName
    const orders = await Order.find({ user: req.user._id })
      .populate("seller", "name phone email")
      .populate("items.productId", "name")
      .sort({ orderedAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Get orders error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// ========================
// 🔟 GET ALL PRODUCTS (for user home)
// ========================
const getAllProducts = async (req, res) => {
  try {
    const { search, sort, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let query = { stock: { $gt: 0 } }; // Only show in-stock products

    // Search filter
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case "price_asc":
        sortOption = { price: 1 };
        break;
      case "price_desc":
        sortOption = { price: -1 };
        break;
      case "name_asc":
        sortOption = { name: 1 };
        break;
      case "name_desc":
        sortOption = { name: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .populate("sellerId", "name location")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (err) {
    console.error("❌ Get products error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ========================
// EXPORT ALL FUNCTIONS
// ========================
module.exports = {
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
};
