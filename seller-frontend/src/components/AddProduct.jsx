// components/AddProduct.jsx
import { useState } from "react";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/add-product", {
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        description: form.description,
      });

      toast.success("Product added successfully!");
      setForm({ name: "", price: "", stock: "", description: "" });
      navigate("/seller/stocks");
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          ➕ Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Product Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-500 outline-none"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Price (₹)</label>
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-500 outline-none"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Stock Quantity</label>
            <input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-500 outline-none"
              placeholder="Enter stock quantity"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-orange-500 outline-none"
              placeholder="Enter product description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
