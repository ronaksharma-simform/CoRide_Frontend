import ProtectedRoutes from "@/components/guards/protectedRoutes";
import Home from "@/pages/Home";
import LandingPage from "@/pages/LandingPage";
import Map from "@/pages/Map";
import React from "react";
import { RouteObject } from "react-router-dom";

export const homeRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/map",
    element: <Map />,
  },
  {
    element: <ProtectedRoutes />,

    children: [
      {
        path: "/home",

        element: <Home />,
      },
    ],
  },
];
