import React, { useEffect } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { getCurrentUser } from "./features/auth/store/auth.thunk";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { Toaster } from "sonner";
import { Spinner } from "./components/ui/spinner";

function App() {
  const dispatch = useAppDispatch();
  const { authChecked } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!authChecked) {
      dispatch(getCurrentUser());
    }
  }, [authChecked, dispatch]);

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />;
      <Toaster />
    </>
  );
}

export default App;
