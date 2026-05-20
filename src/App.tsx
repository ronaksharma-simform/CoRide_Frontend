import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./utils/protectedRoutes";
import LoginPage from "./pages/Login";
import { Toaster } from "sonner";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="home" element={<h2>Home</h2>} />
        </Route>
        {/* fallback route */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
