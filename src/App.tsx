import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";
import AuthInitializer from "./components/AuthInitializer";

function App() {
  return (
    <>
      <AuthInitializer />
      {/* <RouterProvider router={router} /> */}
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
