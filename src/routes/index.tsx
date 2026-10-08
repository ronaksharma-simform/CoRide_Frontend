import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { homeRoutes } from "./home.routes";
import NotFoundPage from "@/pages/NotFoundPage";
import { vehicleRoutes } from "./vehicle.routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...homeRoutes,
  ...vehicleRoutes,
  { path: "*", element: <NotFoundPage /> },
]);
