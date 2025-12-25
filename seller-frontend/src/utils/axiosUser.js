// src/utils/axiosUser.js
import axios from 'axios';

const axiosUser = axios.create({
  baseURL: 'https://api-stock-wj40.onrender.com/api/user',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach userToken automatically
axiosUser.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken'); // ✅ Consistent key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401 errors (token expired)
axiosUser.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default axiosUser;
