const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  chatLink: String,
  
  userName: {
    type: String,
     ref: "User",
  },
  userPhone: {
    type: String,
  
  },
  userLocation: {
    type: {
      lat: Number,
      lng: Number,
    },
    
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
    default: "Pending",
  },
});

module.exports = mongoose.model('Order', orderSchema);
