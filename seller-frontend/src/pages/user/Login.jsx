// pages/user/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosUser from "../../utils/axiosUser";

export default function UserLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosUser.post("/login", form);
      
      // ✅ Store token and user info
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userName", data.name);
      
      navigate("/user/home");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] p-8 rounded-lg w-full max-w-md shadow-lg"
      >
        <h1 className="text-2xl mb-6 font-semibold text-center">User Login</h1>
        
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 text-white outline-none focus:border-orange-500 transition"
        />
        
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 text-white outline-none focus:border-orange-500 transition"
        />
        
        {error && (
          <p className="text-red-400 text-sm mt-2 p-2 bg-red-900/20 rounded">
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded mt-4 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="text-sm mt-4 text-gray-400 text-center">
          New here?{" "}
          <Link to="/user/register" className="text-orange-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
