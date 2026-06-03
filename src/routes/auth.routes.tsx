import AuthLayout from "@/layouts/AuthLayout";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import React from "react";
import { RouteObject } from "react-router-dom";
export const authRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },

      { path: "/verify-email", element: <VerifyEmail /> },
    ],
  },
];
