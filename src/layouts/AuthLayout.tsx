import useIsAuthenticated from "@/hooks/isAuthenticated";
import { useAppSelector } from "@/hooks/hooks";
import { Navigate, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function AuthLayout() {
  const isAuthenticated = useIsAuthenticated();
  const authChecked = useAppSelector((state) => state.auth.authChecked);

  if (!authChecked) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={"/home"} replace />;
  }
  return (
    <div>
      <main>
        <Outlet />
        <Toaster />
      </main>
    </div>
  );
}
