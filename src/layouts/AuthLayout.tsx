import isAuthenticated from "@/utils/isAuthenicated";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
  if (isAuthenticated()) {
    return <Navigate to={"/"} replace />;
  }
  return (
    <div>
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
