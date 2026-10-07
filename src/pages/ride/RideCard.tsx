import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  CalendarClock,
  Users,
  CarFront,
  Pencil,
  Trash2,
} from "lucide-react";
import { deleteRide } from "@/features/ride/store/ride.thunk";
import { useAppDispatch } from "@/hooks/hooks";

export type TRideDataSchema = {
  id: string;
  providerId: string;
  vehicleId: string;
  sourceLabel: { lat: number; lng: number };
  destinationLabel: { lat: number; lng: number };
  route: { lat: number; lng: number }[];
  departureTime: Date;
  totalSeats: number;
  availableSeats: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

interface RideCardProps {
  ride: TRideDataSchema;
  onUpdate: (id: string) => void;
}

const RideCard = ({ ride, onUpdate }: RideCardProps) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ride.departureTime));

  // Map status to shadcn Badge variants
  const dispatch = useAppDispatch();
  const onDelete = async () => {
    await dispatch(deleteRide({ id: ride.id }));
  };
  const getStatusVariant = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active" || s === "scheduled") return "default";
    if (s === "cancelled") return "destructive";
    if (s === "completed") return "secondary";
    return "outline";
  };

  return (
    <Card className="w-full max-w-md shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-medium text-muted-foreground">
            Ride #{ride.id.slice(0, 8)}
          </span>
          <div className="flex items-center text-sm font-medium">
            <CarFront className="w-4 h-4 mr-2 text-muted-foreground" />
            {ride.vehicleId}
          </div>
        </div>
        <Badge variant={getStatusVariant(ride.status)} className="capitalize">
          {ride.status}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Route Visualizer */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 bg-blue-100 p-1 rounded-full">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Source Location</p>
              <p className="text-xs text-muted-foreground">
                Lat: {ride.sourceLabel.lat.toFixed(4)}, Lng:{" "}
                {ride.sourceLabel.lng.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="ml-3 pl-3 border-l-2 border-dashed border-muted-foreground/30 h-6"></div>

          <div className="flex items-start space-x-3">
            <div className="mt-0.5 bg-red-100 p-1 rounded-full">
              <MapPin className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Destination Location</p>
              <p className="text-xs text-muted-foreground">
                Lat: {ride.destinationLabel.lat.toFixed(4)}, Lng:{" "}
                {ride.destinationLabel.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarClock className="w-3.5 h-3.5 mr-1" />
              Departure
            </div>
            <p className="text-sm font-medium">{formattedDate}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 mr-1" />
              Seats Available
            </div>
            <p className="text-sm font-medium">
              <span className="text-primary">{ride.availableSeats}</span>
              <span className="text-muted-foreground">
                {" "}
                / {ride.totalSeats}
              </span>
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-2 overflow-clip w-full">
        <Button
          variant="outline"
          className="w-auto"
          onClick={() => onUpdate(ride.id)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Update
        </Button>

        <Button
          variant="destructive"
          className="w-auto"
          onClick={() => onDelete()}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RideCard;
