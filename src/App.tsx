import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
