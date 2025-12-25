const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    stockThreshold: {
      type: Number,
      default: 10,
      min: [0, "Stock threshold must be a positive number"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
