import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Armchair,
  CalendarClock,
  CarFront,
  Gauge,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { bookSeat, getRideSeatLayout } from "@/features/ride/store/ride.thunk";
import type {
  TRideAvailableSchema,
  TRideSeatLayoutSchema,
  TRideSeatSchema,
} from "@/features/ride/validations/ride.validations";

interface SeatLayoutProps {
  rideId: string;
  summary?: TRideAvailableSchema | null;
  onClose: () => void;
  onBooked?: () => void;
}

const chunkSeats = (
  seats: TRideSeatSchema[],
  size: number,
): TRideSeatSchema[][] => {
  const rows: TRideSeatSchema[][] = [];
  for (let i = 0; i < seats.length; i += size) {
    rows.push(seats.slice(i, i + size));
  }
  return rows;
};

function SeatCell({
  seat,
  selected,
  disabled,
  onSelect,
}: {
  seat: TRideSeatSchema;
  selected: boolean;
  disabled: boolean;
  onSelect: (seat: TRideSeatSchema) => void;
}): React.ReactElement {
  const isDriver = seat.kind === "driver";
  const isBooked = seat.status === "booked";

  const baseClasses =
    "flex h-12 w-14 flex-col items-center justify-center gap-1 rounded-lg border-2 text-sm font-semibold transition-all";
  const colorClasses = isDriver
    ? "border-slate-300 bg-slate-200 text-slate-600 cursor-not-allowed"
    : isBooked
      ? "border-rose-300 bg-rose-100 text-rose-500 cursor-not-allowed"
      : selected
        ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
        : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:bg-emerald-50";

  const cell = (
    <button
      type="button"
      aria-label={
        isDriver
          ? "Driver seat"
          : isBooked
            ? `Seat ${seat.seatNumber} booked`
            : `Seat ${seat.seatNumber} available`
      }
      disabled={isDriver || isBooked || disabled}
      onClick={() => onSelect(seat)}
      title={
        isDriver
          ? "Driver seat"
          : isBooked
            ? `Booked by ${seat.bookedBy?.name ?? "another passenger"}`
            : `Select seat ${seat.seatNumber}`
      }
      className={`${baseClasses} ${colorClasses}`}
    >
      {isDriver ? (
        <>
          <Gauge className="size-4" />
          <span className="text-[10px] uppercase tracking-wide">Driver</span>
        </>
      ) : (
        <>
          <Armchair className="size-4" />
          <span>{seat.seatNumber}</span>
        </>
      )}
    </button>
  );

  return cell;
}

const SeatLayout = ({
  rideId,
  summary,
  onClose,
  onBooked,
}: SeatLayoutProps): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { seatLayout, loading } = useAppSelector((state) => state.ride);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (rideId) {
      setSelectedSeat(null);
      dispatch(getRideSeatLayout({ rideId }));
    }
  }, [rideId, dispatch]);

  const layout: TRideSeatLayoutSchema | null = seatLayout;

  const sortedSeats = useMemo(() => {
    if (!layout) return [];
    return [...layout.seats].sort((a, b) => a.seatNumber - b.seatNumber);
  }, [layout]);

  const frontRow = useMemo(
    () => sortedSeats.filter((seat) => seat.seatNumber <= 2),
    [sortedSeats],
  );
  const rearRows = useMemo(
    () =>
      chunkSeats(
        sortedSeats.filter((seat) => seat.seatNumber > 2),
        3,
      ),
    [sortedSeats],
  );

  if (!layout && loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Spinner className="size-8" />
          <p>Loading seat layout…</p>
        </div>
      </div>
    );
  }

  if (!layout) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500">Could not load the seat layout.</p>
          <Button variant="outline" onClick={onClose}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  const canBook =
    layout.ride.status === "ACTIVE" &&
    layout.ride.availableSeats > 0 &&
    layout.myBooking === null;
  const selectedSeatData = layout.seats.find(
    (seat) => seat.seatNumber === selectedSeat,
  );

  const formattedDeparture = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(layout.ride.departureTime));

  const routeSummary = summary
    ? `(${summary.sourceLabel.lat.toFixed(3)}, ${summary.sourceLabel.lng.toFixed(3)}) → (${summary.destinationLabel.lat.toFixed(3)}, ${summary.destinationLabel.lng.toFixed(3)})`
    : "";

  const onConfirmBooking = async () => {
    if (selectedSeat === null) return;
    setSubmitting(true);
    try {
      const response = await dispatch(
        bookSeat({ rideId: layout.ride.id, seatNumber: selectedSeat }),
      ).unwrap();
      toast.success(`${response.message} (Seat ${selectedSeat})`);
      setSelectedSeat(null);
      await dispatch(getRideSeatLayout({ rideId: layout.ride.id }));
      onBooked?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to book the selected seat";
      toast.error(errorMessage);
      // Someone else may have taken this seat meanwhile - refresh to stay in sync
      if (
        typeof errorMessage === "string" &&
        errorMessage.toLowerCase().includes("already")
      ) {
        await dispatch(getRideSeatLayout({ rideId: layout.ride.id }));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">
      <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <CarFront className="size-5 text-primary" />
              <h2 className="text-lg font-bold">
                {layout.vehicle.company} {layout.vehicle.model}
              </h2>
              <Badge variant="outline">{layout.vehicle.plateNumber}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {summary
                ? `${summary.provider.firstName} ${summary.provider.lastName}`
                : "Ride provider"}{" "}
              • {formattedDeparture}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Ride summary strip */}
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-sm sm:grid-cols-3">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
            <span className="text-slate-600">
              {routeSummary ? (
                <>
                  Pickup → Drop:{" "}
                  <span className="text-xs text-slate-400">{routeSummary}</span>
                </>
              ) : (
                "Route selected by provider"
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarClock className="size-4 text-primary" />
            Departs {formattedDeparture}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="size-4 text-primary" />
            <span>
              <span className="font-semibold text-primary">
                {layout.ride.availableSeats}
              </span>{" "}
              / {layout.ride.totalSeats} seats free
            </span>
          </div>
        </div>

        <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 text-center">
            <h3 className="text-base font-semibold text-slate-800">
              Pick your seat
            </h3>
            <p className="text-sm text-slate-500">
              Tap an available seat to select it.
            </p>
          </div>

          {/* Seat map */}
          <div className="mx-auto w-fit rounded-2xl border-2 border-slate-200 bg-slate-50 px-6 py-5">
            {/* Front of the vehicle */}
            <div className="mb-3 text-center">
              <Badge variant="secondary" className="uppercase tracking-widest">
                Front
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-4">
              {frontRow.map((seat) => (
                <SeatCell
                  key={seat.seatNumber}
                  seat={seat}
                  selected={selectedSeat === seat.seatNumber}
                  disabled={!canBook}
                  onSelect={(s) => setSelectedSeat(s.seatNumber)}
                />
              ))}
            </div>

            {/* Aisle divider */}
            <div className="my-4 h-2 rounded bg-slate-200" />

            {/* Rear rows */}
            {rearRows.length > 0 ? (
              <div className="flex flex-col items-center gap-3">
                {rearRows.map((row, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-3"
                  >
                    {row.map((seat) => (
                      <SeatCell
                        key={seat.seatNumber}
                        seat={seat}
                        selected={selectedSeat === seat.seatNumber}
                        disabled={!canBook}
                        onSelect={(s) => setSelectedSeat(s.seatNumber)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400">
                No passenger seats in this vehicle.
              </p>
            )}

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded border-2 border-slate-300 bg-slate-200" />
                Driver
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded border-2 border-slate-300 bg-white" />
                Available
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded border-2 border-rose-300 bg-rose-100" />
                Booked
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded border-2 border-emerald-500 bg-emerald-500" />
                Selected
              </span>
            </div>
          </div>
        </div>

        {/* Footer: selection + CTA */}
        <div className="sticky bottom-0 mt-4 rounded-xl border bg-white p-4 shadow-sm">
          {layout.myBooking !== null ? (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <p className="text-sm text-slate-600">
                You already booked{" "}
                <span className="font-semibold text-emerald-600">
                  seat {layout.myBooking}
                </span>{" "}
                on this ride.
              </p>
              <Button onClick={onClose}>Done</Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-sm text-slate-600">
                {selectedSeatData ? (
                  <>
                    Selected seat{" "}
                    <span className="text-lg font-bold text-primary">
                      {selectedSeatData.seatNumber}
                    </span>
                  </>
                ) : (
                  <span>No seat selected yet</span>
                )}
              </div>
              <div className="flex gap-2">
                {!canBook && layout.ride.status === "ACTIVE" && (
                  <p className="mr-2 self-center text-sm font-medium text-rose-500">
                    {layout.ride.availableSeats === 0
                      ? "This ride is full"
                      : "Ride no longer bookable"}
                  </p>
                )}
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  disabled={selectedSeat === null || !canBook || submitting}
                  onClick={onConfirmBooking}
                >
                  {submitting ? (
                    <>
                      <Spinner className="mr-2" /> Booking…
                    </>
                  ) : (
                    "Confirm seat"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
