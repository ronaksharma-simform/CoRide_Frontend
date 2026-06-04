import ProtectedRoutes from "@/components/guards/protectedRoutes";
import CoRideHomeLayout from "@/layouts/RideLayout";
import LandingPage from "@/pages/LandingPage";
import React from "react";
import { RouteObject } from "react-router-dom";
import VehiclesDashboard from "@/layouts/VehicleLayout";
import CoRideWebDashboard from "@/layouts/HomeLayout";

export const homeRoutes: RouteObject[] = [
  { path: "/", element: <LandingPage /> },

  {
    element: <ProtectedRoutes />,

    children: [
      { path: "/ride", element: <CoRideHomeLayout /> },
      { path: "/vehicle", element: <VehiclesDashboard /> },
      { path: "/home", element: <CoRideWebDashboard /> },
    ],
  },
];
