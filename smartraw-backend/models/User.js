// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1, min: 1 },
    },
  ],
}, { timestamps: true });

// ❌ REMOVED - pre-save hook was causing double hashing!
// Password is already hashed in userController.js

module.exports = mongoose.model("User", userSchema);
