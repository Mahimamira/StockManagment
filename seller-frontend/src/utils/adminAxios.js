// utils/adminAxios.js
import axios from "axios";

const adminInstance = axios.create({
  baseURL: "https://api-stock-wj40.onrender.com/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

adminInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken"); // Use adminToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminInstance;
