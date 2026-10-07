import React, { useEffect, useState } from "react";
import {
  CalendarClock,
  CarFront,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getAvailableRides } from "@/features/ride/store/ride.thunk";
import type { TRideAvailableSchema } from "@/features/ride/validations/ride.validations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import SeatLayout from "./SeatLayout";

const formatTime = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

function RideCard({
  ride,
  onChooseSeat,
}: {
  ride: TRideAvailableSchema;
  onChooseSeat: (ride: TRideAvailableSchema) => void;
}): React.ReactElement {
  const providerName = `${ride.provider.firstName} ${ride.provider.lastName}`;
  return (
    <Card className="w-full shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="space-y-4 p-5">
        {/* Top row: provider + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {providerName
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{providerName}</p>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {ride.provider.avgRating > 0
                  ? ride.provider.avgRating.toFixed(1)
                  : "New"}
                <span className="text-slate-400">•</span>
                {ride.provider.totalRides} rides
              </p>
            </div>
          </div>
          <Badge variant={ride.status === "ACTIVE" ? "default" : "secondary"}>
            {ride.status}
          </Badge>
        </div>

        {/* Vehicle */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <CarFront className="size-4 text-slate-500" />
            <span className="font-medium text-slate-700">
              {ride.vehicle.company} {ride.vehicle.model}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{ride.vehicle.color}</span>
          </div>
          <span className="font-mono text-xs text-slate-500">
            {ride.vehicle.plateNumber}
          </span>
        </div>

        {/* Route */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <div className="text-slate-600">
              <span className="font-medium">Pickup</span>
              <span className="ml-1 text-xs text-slate-400">
                ({ride.sourceLabel.lat.toFixed(3)},{" "}
                {ride.sourceLabel.lng.toFixed(3)})
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-rose-500" />
            <div className="text-slate-600">
              <span className="font-medium">Destination</span>
              <span className="ml-1 text-xs text-slate-400">
                ({ride.destinationLabel.lat.toFixed(3)},{" "}
                {ride.destinationLabel.lng.toFixed(3)})
              </span>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5">
              <CalendarClock className="size-4 text-primary" />
              {formatTime(ride.departureTime)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              <span className="font-semibold text-primary">
                {ride.availableSeats}
              </span>
              /{ride.totalSeats}
            </span>
          </div>
          <Button
            size="sm"
            disabled={ride.status !== "ACTIVE" || ride.availableSeats <= 0}
            onClick={() => onChooseSeat(ride)}
          >
            {ride.availableSeats > 0 ? "Choose seat" : "Full"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const FindRide = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { availableRides, loading, error } = useAppSelector(
    (state) => state.ride,
  );
  const [search, setSearch] = useState("");
  const [activeRide, setActiveRide] = useState<TRideAvailableSchema | null>(
    null,
  );

  useEffect(() => {
    dispatch(getAvailableRides());
  }, [dispatch]);

  const refreshRides = () => {
    dispatch(getAvailableRides());
  };

  const filteredRides = availableRides.filter((ride) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    const haystack = [
      ride.provider.firstName,
      ride.provider.lastName,
      ride.vehicle.company,
      ride.vehicle.model,
      ride.vehicle.plateNumber,
      ride.vehicle.color,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-8 h-screen overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Find a Ride</h1>
        <p className="mt-1 text-muted-foreground">
          Browse open rides around you and reserve your exact seat.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex w-full items-center sm:w-80">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search driver, make, model or plate…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-white pl-9"
          />
        </div>
      </div>

      {/* Ride grid */}
      {loading && availableRides.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-slate-400">
          <Spinner className="size-6" />
          <p>Loading available rides…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredRides.map((ride) => (
            <RideCard
              key={ride.id}
              ride={ride}
              onChooseSeat={(selected) => setActiveRide(selected)}
            />
          ))}
        </div>
      )}

      {!loading && filteredRides.length === 0 && (
        <div className="rounded-xl border border-dashed bg-white py-20 text-center">
          <CarFront className="mx-auto mb-3 size-12 text-slate-300" />
          <p className="font-medium text-slate-500">
            {error
              ? "Could not load available rides"
              : search
                ? "No rides match your search."
                : "No rides available right now."}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              dispatch(getAvailableRides());
            }}
          >
            Refresh
          </Button>
        </div>
      )}

      {/* Seat picker overlay */}
      {activeRide && (
        <SeatLayout
          rideId={activeRide.id}
          summary={activeRide}
          onClose={() => {
            setActiveRide(null);
            refreshRides();
          }}
          onBooked={refreshRides}
        />
      )}
    </div>
  );
};

export default FindRide;
