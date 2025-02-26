import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token"); // Check if token exists

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
