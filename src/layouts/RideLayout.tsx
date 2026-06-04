import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PlusCircle, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

import { TRideDataSchema } from "@/features/ride/validations/ride.validations";
import RideCard from "../pages/ride/RideCard";
import RideRegister from "../pages/ride/Register";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import RideUpdate from "../pages/ride/Update";
import { getUserRides } from "@/features/ride/store/ride.thunk";

const MyRidesDashboard = () => {
  // --- UI State Management for Forms ---
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getUserRides());
  }, [dispatch]);
  // Mock data - replace with your actual API fetch
  const rideState: TRideDataSchema[] = useAppSelector(
    (state) => state.ride,
  ).ride;
  const [rideToUpdate, setRideToUpdate] = useState<TRideDataSchema | null>(
    null,
  );
  const handleOpenUpdate = (id: string) => {
    const selectedRide = rideState.find((ride) => ride.id === id);
    if (selectedRide) {
      setRideToUpdate(selectedRide);
    }
  };
  return (
    <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto  h-screen">
      {/* 1. Header & Primary Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Rides</h1>
          <p className="text-muted-foreground mt-1">
            Create, update, and track your commuting schedules.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="w-full md:w-auto shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Offer a New Ride
        </Button>
      </div>

      {/* 2. Tabs & Filters */}
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="upcoming">Upcoming Rides</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search routes..." className="pl-9 bg-white" />
            </div>
            <Button variant="outline" size="icon" className="bg-white">
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* 3. The Data Grid */}
        <TabsContent value="upcoming" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rideState.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onUpdate={handleOpenUpdate}
                // onDelete={handleOpenDelete}
              />
            ))}
          </div>
          {rideState.length === 0 && (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No upcoming rides found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Render history rides here */}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[90vw] h-full overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Offer a New Ride</SheetTitle>
            <SheetDescription>
              Fill out the details below to publish a new commute route.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4 border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg text-center text-blue-600 font-medium">
            <RideRegister onSuccess={() => setIsCreateOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      {/* UPDATE RIDE SHEET */}
      <Sheet
        open={!!rideToUpdate}
        onOpenChange={(open) => !open && setRideToUpdate(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl overflow-y-auto"
        >
          <SheetHeader className="mb-6">
            <SheetTitle>Update Ride</SheetTitle>
            <SheetDescription>
              Modify the details for ride #{rideToUpdate?.id.slice(0, 8)}.
            </SheetDescription>
          </SheetHeader>

          {/* 3. CHANGED: Pass the rideToUpdate object directly into your form as a prop */}
          {rideToUpdate && (
            <div className="p-4 border-2 border-dashed border-orange-200 bg-orange-50 rounded-lg text-center text-orange-600 font-medium">
              <RideUpdate
                ride={rideToUpdate}
                onSuccess={() => setRideToUpdate(null)}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MyRidesDashboard;
