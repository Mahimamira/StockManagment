// controllers/productController.js
const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("sellerId", "name location") // include seller's name & location
      .exec();

    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
