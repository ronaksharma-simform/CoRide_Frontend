import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TVehicle } from "@/features/vehicle/validations/vehicle.validations";
import React from "react";

interface VehicleCardProps {
  vehicle: TVehicle;
  onEdit?: (vehicle: TVehicle) => void;
  onDelete?: (vehicle: TVehicle) => void;
  onView?: (vehicle: TVehicle) => void;
}

export default function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onView,
}: VehicleCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {vehicle.company} {vehicle.model}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Color</span>
          <span>{vehicle.color}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Plate Number</span>
          <span>{vehicle.plateNumber}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Seat Capacity</span>
          <span>{vehicle.seatCapacity}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => onView?.(vehicle)}>
          View
        </Button>

        <Button variant="secondary" onClick={() => onEdit?.(vehicle)}>
          Edit
        </Button>

        <Button variant="destructive" onClick={() => onDelete?.(vehicle)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
