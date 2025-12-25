// controllers/orderController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User"); // ✅ make sure file name matches exactly

// =============================
// 📦 Place Order From Cart
// =============================
exports.placeOrderFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    let totalPrice = 0;
    const orderItems = [];
    let sellerId = null;

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id || item.product).populate("sellerId");
      if (!product)
        return res.status(404).json({ error: `Product not found: ${item.product}` });

      if (product.stock < item.quantity)
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}`,
        });

      if (!sellerId) sellerId = product.sellerId._id;

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 3);

    const order = new Order({
      seller: sellerId,
      userName: user.name,
      userPhone: user.phone || "N/A",
      userLocation: user.location,
      items: orderItems,
      totalPrice,
      expectedDelivery,
      status: "Placed",
    });

    await order.save();
    user.cart = [];
    await user.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Order placement error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
};

// =============================
// 📜 Get User Orders
// =============================
exports.getUserOrders = async (req, res) => {
  try {
    const userName = req.user.name;
    const orders = await Order.find({ userName })
      .populate("seller", "name phone email")
      .populate("items.productId", "name")
      .sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
};

// =============================
// 🧾 Get Seller Orders
// =============================
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;
    const orders = await Order.find({ seller: sellerId })
      .populate("items.productId", "name")
      .sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};

// =============================
// 🔄 Update Order Status
// =============================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.seller.toString() !== req.seller.id)
      return res.status(403).json({ error: "Unauthorized" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

// ✅ this must be the final line
module.exports = exports;
