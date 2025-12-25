// middleware/auth.js
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");

const authSeller = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "seller_secret");
    
    const seller = await Seller.findById(decoded.id).select("-password");

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    req.seller = seller;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ✅ Export as default AND named
module.exports = authSeller;
module.exports.authSeller = authSeller;
