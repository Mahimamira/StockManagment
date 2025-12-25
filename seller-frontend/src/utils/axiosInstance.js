// utils/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/seller",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach seller token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sellerToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
