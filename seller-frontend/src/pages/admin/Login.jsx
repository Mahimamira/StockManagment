import { useState } from "react";
import adminAxios from "../../utils/adminAxios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminAxios.post("/login", form);
      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] p-6 rounded-lg w-full max-w-md shadow-lg"
      >
        <h1 className="text-2xl mb-4 font-semibold">Admin Login</h1>

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 my-2 bg-transparent border-b border-gray-600 outline-none"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 my-2 bg-transparent border-b border-gray-600 outline-none"
        />

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

        <button type="submit" className="w-full bg-white text-black py-2 rounded mt-2">
          Login
        </button>

        <p className="text-sm mt-3 text-gray-400 text-center">
          New here?{" "}
          <a href="/admin/register" className="text-primary hover:underline">
            Register as Admin
          </a>
        </p>
      </form>
    </div>
  );
}


