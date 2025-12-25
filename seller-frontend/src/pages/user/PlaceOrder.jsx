// pages/user/UserOrders.jsx
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance"; // Update if path differs
import { useParams } from "react-router-dom";

export default function PlaceOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId"); // Or from context

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${userId}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <div className="text-center p-6">Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        <p className="text-xl font-semibold">🛒 No Orders Yet!</p>
        <p className="mt-2 text-sm">Looks like you haven't ordered anything yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🧾 Your Order History</h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white dark:bg-gray-900 shadow rounded-xl p-4 border dark:border-gray-700"
        >
          <div className="mb-3 text-gray-700 dark:text-gray-300">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Seller:</strong> {order.sellerName || "Seller"}</p>
            <p><strong>User:</strong> {order.userName || "You"}</p>
            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
          </div>

          <div className="mt-3">
            <h4 className="font-semibold text-lg text-blue-600 dark:text-blue-400">🛍 Products</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-800 dark:text-gray-300">
              {order.cartItems.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
