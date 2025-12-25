// components/ProtectedUserRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedUserRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('userToken');
  return isLoggedIn ? children : <Navigate to="/user/login" />;
};

export default ProtectedUserRoute;
