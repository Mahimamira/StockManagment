// utils/axiosInstance.js
// utils/axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api-stock-wj40.onrender.com/api/seller",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("sellerToken"); // Key must match login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;





