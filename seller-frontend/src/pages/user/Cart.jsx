// pages/user/Cart.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosUser from '../../utils/axiosUser';
import UserNavbar from '../../components/user/UserNavbar';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { cartItems, setCartItems, clearCart, fetchCartFromBackend } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderPopup, setOrderPopup] = useState(null); // { success: true/false, message: '', order: {} }
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartFromBackend();
  }, []);

  // Update quantity
  const updateQuantity = async (productId, action) => {
    try {
      await axiosUser.put('/cart/update', { productId, action });
      fetchCartFromBackend();
    } catch (err) {
      showPopup(false, 'Failed to update quantity');
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      await axiosUser.delete(`/cart/${productId}`);
      fetchCartFromBackend();
    } catch (err) {
      showPopup(false, 'Failed to remove item');
    }
  };

  // Place order
  const placeOrder = async () => {
    if (cartItems.length === 0) {
      showPopup(false, 'Cart is empty!');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosUser.post('/orders/place', { cartItems });

      // ✅ Show SUCCESS popup
      showPopup(true, 'Order placed successfully! 🎉', response.data.order);
      
      // Clear cart
      clearCart();
    } catch (err) {
      // ✅ Show FAILURE popup
      showPopup(false, err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  // Show popup
  const showPopup = (success, message, order = null) => {
    setOrderPopup({ success, message, order });
  };

  // Close popup and navigate
  const closePopup = (navigateToOrders = false) => {
    setOrderPopup(null);
    if (navigateToOrders) {
      navigate('/user/orders');
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const qty = item.quantity || 0;
      return sum + (price * qty);
    }, 0);
  };

  return (
    <>
      <UserNavbar setSearch={() => {}} />
      
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-6">
        {/* ✅ ORDER POPUP */}
        {orderPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className={`bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl text-center max-w-md mx-4 ${
              orderPopup.success ? 'border-2 border-green-500' : 'border-2 border-red-500'
            }`}>
              {/* Icon */}
              <div className={`text-6xl mb-4 ${orderPopup.success ? 'text-green-500' : 'text-red-500'}`}>
                {orderPopup.success ? '✅' : '❌'}
              </div>
              
              {/* Title */}
              <h3 className={`text-2xl font-bold mb-2 ${
                orderPopup.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {orderPopup.success ? 'Order Successful!' : 'Order Failed'}
              </h3>
              
              {/* Message */}
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {orderPopup.message}
              </p>
              
              {/* Order Details (if success) */}
              {orderPopup.success && orderPopup.order && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4 text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                  <p className="font-mono text-sm mb-2">{orderPopup.order._id}</p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{orderPopup.order.totalPrice?.toFixed(2)}
                  </p>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Expected Delivery</p>
                  <p className="font-semibold">
                    {new Date(orderPopup.order.expectedDelivery).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
              
              {/* Buttons */}
              <div className="flex gap-3 justify-center">
                {orderPopup.success ? (
                  <>
                    <button
                      onClick={() => closePopup(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      View My Orders
                    </button>
                    <button
                      onClick={() => {
                        closePopup(false);
                        navigate('/user/home');
                      }}
                      className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Continue Shopping
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => closePopup(false)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-orange-600">🛒 Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-6xl mb-4">🛒</p>
              <p className="text-xl text-gray-500">Your cart is empty</p>
              <button
                onClick={() => navigate('/user/home')}
                className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              {cartItems.map((item) => (
                <div
                  key={item.product?._id}
                  className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ₹{item.product?.price} each
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg border">
                      <button
                        onClick={() => updateQuantity(item.product._id, 'decrement')}
                        className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-l-lg text-xl"
                      >
                        −
                      </button>
                      <span className="px-4 font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, 'increment')}
                        className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-lg text-xl"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold w-24 text-right text-orange-600">
                      ₹{(item.product?.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-400 px-3 text-xl"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}

              {/* Bill Summary */}
              <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-orange-600">📋 Bill Summary</h2>
                
                <div className="space-y-2 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.product?._id} className="flex justify-between text-sm">
                      <span>{item.product?.name} × {item.quantity}</span>
                      <span>₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <hr className="border-gray-300 dark:border-gray-600 my-4" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-semibold">Total:</span>
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
                
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      🚀 Place Order Now
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
