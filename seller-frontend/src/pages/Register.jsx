// pages/Register.jsx
import { useState } from "react";
import axios from "../utils/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setForm({
            ...form,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error("Location error:", error);
          setError("Could not get location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Build location object for GeoJSON
      const locationData = {
        type: "Point",
        coordinates: [
          parseFloat(form.longitude) || 0,
          parseFloat(form.latitude) || 0,
        ],
      };

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: locationData,
      };

      await axios.post("/register", payload);
      
      // ✅ Navigate to login after successful registration
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed"
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
        <h1 className="text-2xl mb-6 font-semibold text-center">
          Seller Registration
        </h1>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
        />

        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          minLength={6}
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
        />

        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
        />

        {/* Location Fields */}
        <div className="flex gap-2 my-2">
          <input
            name="latitude"
            type="text"
            value={form.latitude}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-1/2 p-3 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
          />
          <input
            name="longitude"
            type="text"
            value={form.longitude}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-1/2 p-3 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
          />
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded mt-2 text-sm transition"
        >
          📍 Use Current Location
        </button>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
