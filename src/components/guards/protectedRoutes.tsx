import { useAppSelector } from "@/hooks/hooks";
import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  console.log("Yes", isAuthenticated, loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
export default ProtectedRoutes;
