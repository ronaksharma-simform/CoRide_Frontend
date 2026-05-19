import { Toast } from "radix-ui";
import React from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toast />
    </div>
  );
}
