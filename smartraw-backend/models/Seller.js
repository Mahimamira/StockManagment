// models/Seller.js
const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    // ✅ GeoJSON location - Made optional with defaults
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for geolocation queries
sellerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Seller", sellerSchema);
