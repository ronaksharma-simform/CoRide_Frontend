import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  RideUpdateSchema,
  TRideDataSchema,
  TRideUpdateSchema,
  TRideUpdateInput,
} from "@/features/ride/validations/ride.validations";
import { useAppDispatch } from "@/hooks/hooks";
import { updateRide } from "@/features/ride/store/ride.thunk";
import RouteSelectorMap from "./Map";

interface RideUpdateProps {
  ride: TRideDataSchema;
  onSuccess: () => void;
}

const RideUpdate = ({ ride, onSuccess }: RideUpdateProps) => {
  const dispatch = useAppDispatch();
  const [showMap, setShowMap] = useState(false);
  const [routeSelected, setRouteSelected] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TRideUpdateInput, unknown, TRideUpdateSchema>({
    defaultValues: {
      sourceLabel: undefined,
      destinationLabel: undefined,
      route: [],
      departureTime: undefined,
      totalSeats: undefined,
      availableSeats: undefined,
      status: "ACTIVE",
    },
    resolver: zodResolver(RideUpdateSchema),
  });
  const source = watch("sourceLabel");
  const destination = watch("destinationLabel");
  const route = watch("route");

  // Prefill form with ride data from props
  useEffect(() => {
    if (ride) {
      reset({
        sourceLabel: ride.sourceLabel,
        destinationLabel: ride.destinationLabel,
        route: ride.route,
        departureTime: new Date(ride.departureTime),
        totalSeats: ride.totalSeats,
        availableSeats: ride.availableSeats,
        status: ride.status,
      });
    }
  }, [ride, reset]);

  const onSubmit = async (data: TRideUpdateSchema) => {
    try {
      const response = await dispatch(
        updateRide({ id: ride.id, data }),
      ).unwrap();

      toast.success(response.message);
      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Ride update failed";
      toast.error(errorMessage);
    }
  };

  return (
    <>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Update Ride</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Departure Time */}
              <div>
                <Label>Departure Time</Label>
                <Controller
                  name="departureTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      value={
                        field.value
                          ? new Date(field.value as Date)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                {errors.departureTime && (
                  <p className="text-red-500 text-sm">
                    {errors.departureTime.message}
                  </p>
                )}
              </div>
              {/* Available Seats */}
              <div>
                <Label>Available Seats</Label>
                <Controller
                  name="availableSeats"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      {...field}
                      value={field.value as number | undefined}
                    />
                  )}
                />
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="w-full border p-2 rounded">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="FULL">FULL</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  )}
                />
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
                    <strong>Source:</strong> {source?.lat.toFixed(6)},{" "}
                    {source?.lng.toFixed(6)}
                  </p>

                  <p>
                    <strong>Destination:</strong> {destination?.lat.toFixed(6)},{" "}
                    {destination?.lng.toFixed(6)}
                  </p>

                  <p>
                    <strong>Route Points:</strong> {route?.length}
                  </p>
                </div>
              )}
              <Button type="submit" className="w-full">
                Update Ride
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RideUpdate;
