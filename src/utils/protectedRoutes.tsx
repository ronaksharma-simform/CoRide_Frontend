import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useIsAuthenticated from "./isAuthenticated";

const ProtectedRoutes = () => {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
