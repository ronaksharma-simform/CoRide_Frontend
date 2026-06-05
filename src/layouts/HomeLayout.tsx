import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CarFront,
  LayoutDashboard,
  Map,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import MyRidesDashboard from "./RideLayout";
import MyVehiclesDashboard from "./VehicleLayout";
import { useAppDispatch } from "@/hooks/hooks";
import { logoutUser } from "@/features/auth/store/auth.thunk";
import { toast } from "sonner";
import FindRide from "@/pages/ride/FindRide";

export default function AppLayout() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof globalThis.window !== "undefined") {
      return localStorage.getItem("coride_active_view") || "home";
    }
    return "home";
  });

  useEffect(() => {
    localStorage.setItem("coride_active_view", activeView);
  }, [activeView]);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("User Logout SuccessFully");
  };

  const renderContent = () => {
    switch (activeView) {
      case "home":
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome Back, Ronak!</h2>
            <p className="text-gray-500 mb-8">
              This is your main overview. Select a dashboard from the menu.
            </p>
            {/* <CoRideHomeLayout /> */}
          </div>
        );
      case "rides":
        return <MyRidesDashboard />;
      case "vehicles":
        return <MyVehiclesDashboard />;
      case "findRide":
        return <FindRide />;
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans overflow-hidden">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col hidden md:flex shrink-0">
        {/* App Branding */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <CarFront className="w-6 h-6" />
            <span>CoRide</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <NavItem
            icon={<LayoutDashboard />}
            label="Overview"
            isActive={activeView === "home"}
            onClick={() => setActiveView("home")}
          />
          <NavItem
            icon={<Map />}
            label="My Rides"
            isActive={activeView === "rides"}
            onClick={() => setActiveView("rides")}
          />
          <NavItem
            icon={<CarFront />}
            label="My Vehicles"
            isActive={activeView === "vehicles"}
            onClick={() => setActiveView("vehicles")}
          />
          <NavItem
            icon={<CarFront />}
            label="Find Ride"
            isActive={activeView === "findRide"}
            onClick={() => setActiveView("findRide")}
          />
        </nav>

        {/* Bottom Profile & Logout Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Ronak Sharma
              </p>
              <p className="text-xs text-muted-foreground truncate">
                ronak@coride.com
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <NavItem
              icon={<Settings />}
              label="Settings"
              isActive={false}
              onClick={() => {}}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="h-16 md:hidden border-b border-gray-200 flex items-center justify-between px-4 shrink-0 bg-white">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <CarFront className="w-5 h-5" />
            <span>CoRide</span>
          </div>
          <Button variant="ghost" size="icon">
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

const NavItem = ({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
        isActive
          ? "bg-primary text-primary-foreground font-medium shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `w-5 h-5 ${isActive ? "text-primary-foreground" : ""}`,
      })}
      <span className="text-sm">{label}</span>
    </button>
  );
};
