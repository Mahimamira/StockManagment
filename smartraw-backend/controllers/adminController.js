// controllers/adminController.js
const Admin = require("../models/Admin");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email, password: hashed });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, "admin_secret", { expiresIn: "1d" });

    res.status(200).json({ token, admin });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};
