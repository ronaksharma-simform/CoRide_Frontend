import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { homeRoutes } from "./home.routes";
import NotFoundPage from "@/pages/NotFoundPage";
import React from "react";

export const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  { path: "*", element: <NotFoundPage /> },
]);
