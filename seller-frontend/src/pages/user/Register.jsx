// pages/user/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosUser from "../../utils/axiosUser";

export default function UserRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    lat: null,
    lng: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("Getting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));
        setLocationStatus("📍 Location captured successfully!");
        setError("");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError("Permission to access location was denied.");
        } else {
          setError("Failed to retrieve your location.");
        }
        setLocationStatus("");
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.lat || !form.lng) {
      setError("Please activate your location before registering.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
        },
      };

      await axiosUser.post("/register", payload);
      
      // ✅ Navigate to login after successful registration
      navigate("/user/login");
    } catch (err) {
      console.error("Registration error:", err);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1c1c1c] p-8 rounded-lg w-full max-w-md shadow-lg"
      >
        <h1 className="text-2xl mb-6 font-semibold text-center">
          User Registration
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
          placeholder="Phone Number (Optional)"
          className="w-full p-3 my-2 bg-transparent border-b border-gray-600 outline-none focus:border-orange-500 transition"
        />

        <button
          type="button"
          onClick={getLocation}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded mt-4 transition"
        >
          📍 Activate Location
        </button>

        {locationStatus && (
          <p className="text-sm text-green-400 mt-2">{locationStatus}</p>
        )}

        {form.lat && form.lng && (
          <p className="text-sm mt-1 text-orange-400">
            Coordinates: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm mt-2 p-2 bg-red-900/20 rounded">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !form.lat || !form.lng}
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-3 rounded mt-4 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/user/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
