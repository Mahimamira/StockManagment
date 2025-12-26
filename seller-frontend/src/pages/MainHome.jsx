import { useNavigate } from "react-router-dom";

export default function MainHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-3xl text-center p-8">
        <h1 className="text-4xl font-bold mb-6">
          Smart Stock Management System
        </h1>

        <p className="text-gray-300 mb-10 text-lg">
          Manage raw materials, track stock levels, place orders, and analyze
          sales — all in one powerful platform designed for sellers, admins,
          and users.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
          >
            Seller Registration
          </button>

          <button
            onClick={() => navigate("/admin/register")}
            className="px-8 py-3 border border-white rounded hover:bg-white hover:text-black transition"
          >
            Admin Registration
          </button>

          <button
            onClick={() => navigate("/user/register")}
            className="px-8 py-3 border border-gray-400 rounded hover:bg-gray-700 transition"
          >
            User Registration
          </button>
        </div>
      </div>
    </div>
  );
}
