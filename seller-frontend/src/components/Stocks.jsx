// components/Stocks.jsx
import { useEffect, useState } from "react";
import axios from "../utils/axios"; // ✅ Use correct axios instance
import { toast } from "react-hot-toast";

export default function Stocks() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formValues, setFormValues] = useState({ stock: 0, price: 0 });

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      // ✅ Handle both response formats
      const productData = res.data.products || res.data;
      setProducts(Array.isArray(productData) ? productData : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormValues({ stock: product.stock, price: product.price });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormValues({ stock: 0, price: 0 });
  };

  const handleChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (productId) => {
    try {
      await axios.put("/update-stock", {
        productId,
        stock: parseInt(formValues.stock),
        price: parseFloat(formValues.price),
      });

      toast.success("Stock updated!");
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, stock: parseInt(formValues.stock), price: parseFloat(formValues.price) }
            : p
        )
      );

      setEditingId(null);
      setFormValues({ stock: 0, price: 0 });
    } catch (err) {
      console.error("Error updating stock:", err);
      toast.error("Failed to update stock");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        📦 Stock Management
      </h2>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No products found.</p>
          <p className="text-gray-500 text-sm mt-2">
            Add products to see them here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-700 text-sm">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="p-3 border border-gray-700">Product</th>
                <th className="p-3 border border-gray-700">Stock</th>
                <th className="p-3 border border-gray-700">Price (₹)</th>
                <th className="p-3 border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {products.map((product) => {
                const isEditing = editingId === product._id;
                return (
                  <tr
                    key={product._id}
                    className="border-b border-gray-700 text-center hover:bg-gray-800"
                  >
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={formValues.stock}
                          onChange={(e) => handleChange("stock", e.target.value)}
                          className="w-20 px-2 py-1 border rounded bg-gray-700 text-white"
                        />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          {product.stock}
                          {product.stock < 5 && (
                            <span className="text-red-400 text-xs">
                              ⚠️ Low
                            </span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={formValues.price}
                          onChange={(e) => handleChange("price", e.target.value)}
                          className="w-24 px-2 py-1 border rounded bg-gray-700 text-white"
                        />
                      ) : (
                        <>₹{product.price}</>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(product._id)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
