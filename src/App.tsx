import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./utils/protectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="login" element={<h2>Login</h2>} />
        <Route path="signup" element={<h2>SignUp</h2>} />
        <Route element={<ProtectedRoutes />}>
          <Route path="home" element={<h2>Home</h2>} />
        </Route>
        {/* fallback route */}
        <Route path="*" element={<h1>404 Page Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
