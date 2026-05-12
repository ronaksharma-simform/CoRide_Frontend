import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  // dummy data for user
  const user: string = "23";
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
