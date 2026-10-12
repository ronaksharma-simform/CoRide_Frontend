import { useAppSelector } from "@/hooks/hooks";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const { isAuthenticated, authChecked } = useAppSelector(
    (state) => state.auth,
  );

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
export default ProtectedRoutes;
