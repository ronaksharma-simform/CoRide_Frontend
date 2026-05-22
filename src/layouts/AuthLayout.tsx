import isAuthenticated from "@/utils/isAuthenticated";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
  if (isAuthenticated()) {
    return <Navigate to={"/home"} replace />;
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
