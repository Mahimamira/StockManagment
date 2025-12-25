// utils/adminAxios.js
import axios from "axios";

const adminInstance = axios.create({
  baseURL: "http://localhost:5000/api/admin",
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
