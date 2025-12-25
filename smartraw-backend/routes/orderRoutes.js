// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // ✅ Add user reference for querying
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    default: "N/A",
  },
  userLocation: {
    lat: Number,
    lng: Number,
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderedAt: {
    type: Date,
    default: Date.now,
  },
  expectedDelivery: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: "Placed",
  },
  chatLink: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
