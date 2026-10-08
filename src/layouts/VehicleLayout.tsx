import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PlusCircle, Search, CarFront } from "lucide-react";
import { Input } from "@/components/ui/input";
import VehicleCard from "@/pages/vehicle/VehicleCard";
import { getAllVehicle } from "@/features/vehicle/store/vehicle.thunk";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import Register from "@/pages/vehicle/Register";

const MyVehiclesDashboard = () => {
  // --- UI State Management for Forms ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const vehicleState = useAppSelector((state) => state.vehicle).vehicle;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllVehicle());
  }, [dispatch]);

  return (
    <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto h-screen">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CarFront className="w-8 h-8 text-primary" />
            My Garage
          </h1>
          <p className="text-muted-foreground mt-1">
            Add and manage the vehicles you use for commuting.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full md:w-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Vehicle
        </Button>
      </div>

      {/* 2. Controls */}
      <div className="flex items-center mb-6 w-full sm:w-72">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by make, model or plate..."
            className="pl-9 bg-white"
          />
        </div>
      </div>

      {/* 3. The Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicleState.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>

      {vehicleState.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 mt-6">
          <CarFront className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No vehicles found.</p>
          <p className="text-sm text-gray-400">
            Add a vehicle to start offering rides.
          </p>
        </div>
      )}

      {/* ========================================= */}
      {/* OVERLAYS: Where you inject your existing forms */}
      {/* ========================================= */}

      {/* CREATE VEHICLE SHEET */}
      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Add New Vehicle</SheetTitle>
            <SheetDescription>
              Register a new vehicle. It may require verification before you can
              offer rides.
            </SheetDescription>
          </SheetHeader>

          {/* ⬇️ DROP YOUR CREATE FORM COMPONENT HERE ⬇️ */}
          <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg text-center text-blue-600 font-medium">
            <Register
              onSuccess={() => {
                setIsCreateOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
      {/* DELETE CONFIRMATION MODAL */}
      <AlertDialog
        open={!!vehicleToDelete}
        onOpenChange={(open) => !open && setVehicleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this vehicle?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this vehicle from your profile. You
              will not be able to offer rides using this vehicle anymore.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            {/* ⬇️ DROP YOUR DELETE LOGIC/BUTTON HERE ⬇️ */}
            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyVehiclesDashboard;
