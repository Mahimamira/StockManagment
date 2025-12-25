// components/Orders.jsx
import { useEffect, useState } from "react";
import axios from "../utils/axios"; // ✅ Use the axios instance with interceptor

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders");
      // ✅ Handle both response formats
      const orderData = response.data.orders || response.data;
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.error || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6 flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          📦 Customer Orders
        </h2>

        {error && (
          <p className="text-red-400 bg-red-900/20 p-3 rounded-md text-center mb-4">
            {error}
          </p>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No orders available yet.</p>
            <p className="text-gray-500 text-sm mt-2">
              Orders from customers will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-5 border border-gray-700 rounded-lg shadow-md bg-gray-800"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-medium text-lg">
                      👤 {order.userName}
                    </div>
                    <div className="text-sm text-gray-400">
                      📞 {order.userPhone}
                    </div>
                    {order.userLocation && (
                      <div className="text-sm text-gray-400">
                        📍 {order.userLocation.lat?.toFixed(4)},{" "}
                        {order.userLocation.lng?.toFixed(4)}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === "Delivered"
                        ? "bg-green-600"
                        : order.status === "Shipped"
                        ? "bg-blue-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="font-semibold mb-2">🛒 Items:</div>
                  <ul className="ml-4 space-y-1">
                    {order.items.map((item, idx) => (
                      <li
                        key={item._id || idx}
                        className="text-sm text-gray-300"
                      >
                        • {item.name || `Product: ${item.productId}`} × {item.quantity} = ₹
                        {item.price * item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    📅 {new Date(order.orderedAt).toLocaleString()}
                  </div>
                  <div className="font-bold text-lg text-green-400">
                    💰 ₹{order.totalPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
