// src/pages/WaterPage.js
import React from 'react';
import axios from 'axios';

export default function WaterPage() {
  const placeOrder = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/orders/place', {
        userId: '64f89744f9219f20b66e1234',    // Replace with actual user ID from login
        sellerId: '64f89744f9219f20b66e5678',  // Replace with actual seller ID
        totalPrice: 90,
        cartItems: [
          { productId: 'abc123', name: 'Tomato', quantity: 2, price: 30 },
          { productId: 'xyz456', name: 'Onion', quantity: 1, price: 30 },
        ],
      });

      console.log(response.data);
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to place order!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Water Page (Cart Example)</h1>

      {/* This can be your cart UI */}
      <div className="mb-4">
        <p>Tomato x2 - ₹30</p>
        <p>Onion x1 - ₹30</p>
        <p className="mt-2 font-semibold">Total: ₹90</p>
      </div>

      <button
        onClick={placeOrder}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
}
