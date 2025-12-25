import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get('/dashboard');
        setDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div className="text-white p-6">Loading dashboard...</div>;

  if (!dashboard) return <div className="text-red-500 p-6">Failed to load dashboard data.</div>;

  const { totalProducts, totalOrders, totalEarnings, unitsSold, performance } = dashboard;

  const chartData = [
    {
      period: 'Daily',
      Orders: performance?.daily?.count || 0,
      Earnings: performance?.daily?.earnings || 0,
    },
    {
      period: 'Weekly',
      Orders: performance?.weekly?.count || 0,
      Earnings: performance?.weekly?.earnings || 0,
    },
    {
      period: 'Monthly',
      Orders: performance?.monthly?.count || 0,
      Earnings: performance?.monthly?.earnings || 0,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Seller Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-orange-700 text-white p-4 rounded-xl shadow-md">
          <p className="text-sm">Total Products</p>
          <p className="text-2xl font-semibold">{totalProducts}</p>
        </div>
        <div className="bg-orange-700 text-white p-4 rounded-xl shadow-md">
          <p className="text-sm">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
        </div>
        <div className="bg-orange-700 text-white p-4 rounded-xl shadow-md">
          <p className="text-sm">Units Sold</p>
          <p className="text-2xl font-semibold">{unitsSold}</p>
        </div>
        <div className="bg-orange-700 text-white p-4 rounded-xl shadow-md">
          <p className="text-sm">Total Earnings</p>
          <p className="text-2xl font-semibold">₹{totalEarnings}</p>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 text-white p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Daily Performance</p>
          <p>Orders: {performance?.daily?.count || 0}</p>
          <p>Earnings: ₹{performance?.daily?.earnings || 0}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Weekly Performance</p>
          <p>Orders: {performance?.weekly?.count || 0}</p>
          <p>Earnings: ₹{performance?.weekly?.earnings || 0}</p>
        </div>
        <div className="bg-gray-800 text-white p-4 rounded-xl">
          <p className="text-lg font-semibold mb-2">Monthly Performance</p>
          <p>Orders: {performance?.monthly?.count || 0}</p>
          <p>Earnings: ₹{performance?.monthly?.earnings || 0}</p>
        </div>
      </div>

      {/* Line Chart for Performance */}
      <div className="bg-gray-900 text-white p-4 rounded-xl shadow-md">
        <p className="text-lg font-semibold mb-4">Sales & Earnings Trend</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="period" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Orders" stroke="#00BFFF" strokeWidth={2} />
            <Line type="monotone" dataKey="Earnings" stroke="#FFD700" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
