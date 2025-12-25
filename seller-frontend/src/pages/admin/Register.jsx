import { useState } from "react";
import adminAxios from "../../utils/adminAxios";
import { useNavigate } from "react-router-dom";

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await adminAxios.post("/register", form);
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] p-6 rounded-lg w-full max-w-md shadow-lg"
      >
        <h1 className="text-2xl mb-4 font-semibold">Admin Registration</h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 my-2 bg-transparent border-b border-gray-600 outline-none"
        />

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

        <input
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          className="w-full p-2 my-2 bg-transparent border-b border-gray-600 outline-none"
        />

        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}

        <button type="submit" className="w-full bg-white text-black py-2 rounded mt-2">
          Register
        </button>

        <p className="text-sm mt-3 text-gray-400">
          Already registered?{" "}
          <a href="/admin/login" className="text-primary">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
