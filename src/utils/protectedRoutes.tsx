import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import isAuthenticated from "./isAuthenicated";

const ProtectedRoutes = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
