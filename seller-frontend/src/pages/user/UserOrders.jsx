// pages/user/UserOrders.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosUser from "../../utils/axiosUser";
import UserNavbar from "../../components/user/UserNavbar";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosUser.get("/orders");
      console.log("Orders fetched:", data);
      // ✅ Handle both response formats
      setOrders(data.orders || data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Placed: "bg-blue-500",
      Processing: "bg-yellow-500",
      Shipped: "bg-purple-500",
      Delivered: "bg-green-500",
      Cancelled: "bg-red-500",
      Pending: "bg-orange-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Placed: "📝",
      Processing: "⚙️",
      Shipped: "🚚",
      Delivered: "✅",
      Cancelled: "❌",
      Pending: "⏳",
    };
    return icons[status] || "📦";
  };

  if (loading) {
    return (
      <>
        <UserNavbar setSearch={() => {}} />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <p className="text-xl text-white">Loading orders...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar setSearch={() => {}} />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-orange-600">📦 My Orders</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-6xl mb-4">📦</p>
              <p className="text-xl font-semibold text-gray-500">No Orders Yet!</p>
              <p className="mt-2 text-sm text-gray-400">
                Looks like you haven't ordered anything yet.
              </p>
              <button
                onClick={() => navigate("/user/home")}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-xl p-6 border dark:border-gray-700"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ORDER ID
                      </p>
                      <p className="font-mono text-sm">{order._id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(order.orderedAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold text-white flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  {/* Seller Info */}
                  {order.seller && (
                    <div className="mb-4 p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Seller</p>
                      <p className="font-semibold">{order.seller.name}</p>
                      {order.seller.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📞 {order.seller.phone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-lg text-orange-600 mb-3">
                      🛍️ Items ({order.items?.length || 0})
                    </h4>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm bg-white dark:bg-gray-700 p-3 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="font-semibold text-orange-600">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Expected Delivery
                      </p>
                      <p className="font-semibold text-green-600">
                        {new Date(order.expectedDelivery).toLocaleDateString('en-IN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ₹{order.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
