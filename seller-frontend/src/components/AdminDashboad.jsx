import { useEffect, useState } from "react";
import axios from "../utils/adminAxios";
import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  const fetchSellers = async () => {
    try {
      const res = await axios.get("/ranked-sellers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSellers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching sellers", err);
    }
  };

  const verifySeller = async (id) => {
    try {
      const res = await axios.put(
        `/verify-seller/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedSeller = res.data.seller;
      setSellers((prev) =>
        prev.map((s) =>
          s._id === updatedSeller._id ? { ...s, verified: true } : s
        )
      );
    } catch (err) {
      console.error("Verify failed", err);
    }
  };

  const removeSeller = async (id) => {
    try {
      await axios.delete(`/remove-seller/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSellers();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const pieData = {
    labels: sellers.map((s) => s.name),
    datasets: [
      {
        label: "Weekly Orders",
        data: sellers.map((s) => s.totalOrders || 0),
        backgroundColor: ["#FFA500", "#36A2EB", "#ffffff", "#FF6384"],
        borderColor: "#1e3a8a",
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: sellers.map((s) => s.name),
    datasets: [
      {
        label: "Monthly Orders",
        data: sellers.map((s) => (s.totalOrders || 0) + 10),
        backgroundColor: "#60a5fa",
        borderColor: "#1e40af",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#000" },
      },
      title: {
        display: true,
        text: "Performance of Sellers",
        color: "#1e3a8a",
        font: { size: 18 },
      },
    },
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-3xl font-semibold text-center text-blue-800 dark:text-blue-400 mb-6">
        📊 Performance of Sellers
      </h2>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 mb-10">
        <div className="w-full max-w-md border-2 border-blue-500 p-4 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-center mb-2 font-semibold text-blue-700">
            Weekly Orders
          </h3>
          <Pie data={pieData} options={chartOptions} />
        </div>

        <div className="w-full max-w-md border-2 border-blue-500 p-4 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-center mb-2 font-semibold text-blue-700">
            Monthly Orders
          </h3>
          <Bar data={barData} options={chartOptions} />
        </div>
      </div>

      {/* Seller Table */}
      <div className="overflow-x-auto border border-blue-400 rounded-lg p-4 bg-white dark:bg-gray-800">
        <h3 className="text-xl font-bold mb-4 text-blue-700 text-center">
          Seller List
        </h3>
        {loading ? (
          <p>Loading sellers...</p>
        ) : (
          <table className="min-w-full border-collapse text-center">
            <thead>
              <tr className="bg-blue-100 dark:bg-blue-900 text-black dark:text-white">
                <th className="border px-4 py-2">Rank</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Orders</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller, idx) => (
                <tr key={seller._id} className="text-center">
                  <td className="border px-4 py-2">{idx + 1}</td>
                  <td className="border px-4 py-2">{seller.name}</td>
                  <td className="border px-4 py-2">{seller.email}</td>
                  <td className="border px-4 py-2">{seller.totalOrders || 0}</td>
                  <td className="border px-4 py-2">
                    {seller.verified ? (
                      <span className="text-green-600 font-semibold flex items-center justify-center gap-1">
                        <FaCheckCircle /> Verified
                      </span>
                    ) : (
                      <span className="text-red-600">Not Verified</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {!seller.verified && (
                      <button
                        onClick={() => verifySeller(seller._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => removeSeller(seller._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
