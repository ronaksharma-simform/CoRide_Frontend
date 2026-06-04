import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

import RouteSelectorMap from "../Map";

import {
  RideFormSchema,
  TRideForm,
} from "@/features/ride/validations/ride.validations";
import { registerRide } from "@/features/ride/store/ride.thunk";
import { toast } from "sonner";
import { getAllVehicle } from "@/features/vehicle/store/vehicle.thunk";

const RideRegister = ({ onSuccess }: { onSuccess: () => void }) => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState(false);
  const [routeSelected, setRouteSelected] = useState(false);
  const vehicleState = useAppSelector((state) => state.vehicle);
  const ride = useAppSelector((state) => state.ride);
  console.log(ride);
  useEffect(() => {
    dispatch(getAllVehicle());
  }, [dispatch]);
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<TRideForm>({
    resolver: zodResolver(RideFormSchema),

    defaultValues: {
      vehicleId: vehicleState.vehicle?.[0]?.id ?? "",

      sourceLabel: { lat: 0, lng: 0 },

      destinationLabel: { lat: 0, lng: 0 },

      route: [],

      departureTime: new Date(),

      totalSeats: 1,

      availableSeats: 1,

      status: "ACTIVE",
    },
  });

  const selectedVehicleId = watch("vehicleId");

  const source = watch("sourceLabel");
  const destination = watch("destinationLabel");
  const route = watch("route");

  const selectedVehicle = vehicleState.vehicle.find(
    (vehicle) => vehicle.id === selectedVehicleId,
  );

  const onSubmit = async (data: TRideForm) => {
    try {
      if (selectedVehicle?.seatCapacity) {
        data.totalSeats = selectedVehicle.seatCapacity;
      }
      const response = await dispatch(registerRide(data)).unwrap();
      console.log(response);
      toast.success(response.message);
      onSuccess();
    } catch (error) {
      if (
        error instanceof Object &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        toast.error(error.message);

        return;
      }

      toast.error("Ride Registration failed");
    }
  };

  return (
    <>
      {/* FULL SCREEN MAP */}
      {showMap && (
        <div className="fixed inset-0 z-50 bg-white">
          <RouteSelectorMap
            onRouteSelected={(routeData) => {
              setValue("sourceLabel", routeData.sourceLabel);

              setValue("destinationLabel", routeData.destinationLabel);

              setValue("route", routeData.route);

              setRouteSelected(true);
              setShowMap(false);
            }}
          />
        </div>
      )}

      {/* FORM */}
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl shadow-xl">
          <CardContent className="space-y-6 p-8">
            <div>
              <h1 className="text-3xl font-bold">Create Ride</h1>

              <p className="text-muted-foreground">
                Fill ride details and select a route.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* VEHICLE */}
              <div className="space-y-2">
                <Label>Select Vehicle</Label>

                <Controller
                  name="vehicleId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Vehicle" />
                      </SelectTrigger>

                      <SelectContent>
                        {vehicleState.vehicle.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.company} - {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.vehicleId && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleId.message}
                  </p>
                )}
              </div>

              {/* TOTAL SEATS */}
              <div className="space-y-2">
                <Label>Total Seats</Label>

                <Input disabled value={selectedVehicle?.seatCapacity ?? 0} />
              </div>

              {/* AVAILABLE SEATS */}
              <div className="space-y-2">
                <Label>Available Seats</Label>

                <Controller
                  name="availableSeats"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={1}
                      max={selectedVehicle?.seatCapacity}
                      {...field}
                    />
                  )}
                />

                {errors.availableSeats && (
                  <p className="text-red-500 text-sm">
                    {errors.availableSeats.message}
                  </p>
                )}
              </div>

              {/* DEPARTURE TIME */}
              <div className="space-y-2">
                <Label>Departure Time</Label>

                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                    />
                  )}
                />

                {errors.departureTime && (
                  <p className="text-red-500 text-sm">
                    {errors.departureTime.message}
                  </p>
                )}
              </div>

              {/* ROUTE CARD */}
              <div className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Route Selection</h3>

                    {routeSelected ? (
                      <p className="text-green-600">✓ Route Selected</p>
                    ) : (
                      <p className="text-muted-foreground">No route selected</p>
                    )}
                  </div>

                  <Button type="button" onClick={() => setShowMap(true)}>
                    {routeSelected ? "Edit Route" : "Select Route"}
                  </Button>
                </div>
              </div>

              {/* ROUTE SUMMARY */}
              {routeSelected && (
                <div className="rounded-lg border bg-white p-4 space-y-2">
                  <h3 className="font-semibold">Route Summary</h3>

                  <p>
                    <strong>Source:</strong> {source.lat.toFixed(6)},{" "}
                    {source.lng.toFixed(6)}
                  </p>

                  <p>
                    <strong>Destination:</strong> {destination.lat.toFixed(6)},{" "}
                    {destination.lng.toFixed(6)}
                  </p>

                  <p>
                    <strong>Route Points:</strong> {route.length}
                  </p>
                </div>
              )}

              {/* SUBMIT */}
              <Button
                type="submit"
                className="w-full"
                disabled={!routeSelected}
              >
                Create Ride
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RideRegister;
