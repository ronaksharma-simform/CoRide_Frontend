import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TVehicle } from "@/features/vehicle/validations/vehicle.validations";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteVehicle } from "@/features/vehicle/store/vehicle.thunk";

export default function VehicleCard({
  vehicle,
}: {
  readonly vehicle: TVehicle;
}) {
  const dispatch = useAppDispatch();
  const onDeleteClick = async () => {
    await dispatch(
      deleteVehicle({
        id: vehicle.id,
      }),
    );
  };
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
        <Button variant="destructive" onClick={onDeleteClick}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
