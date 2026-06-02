import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerVehicle } from "@/features/vehicle/store/vehicle.thunk";
import {
  TVehicle,
  TVehicleForm,
  VehicleRegistrationSchema,
} from "@/features/vehicle/validations/vehicle.validations";
import { useAppDispatch } from "@/hooks/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TVehicleForm>({
    defaultValues: {
      model: "",
      company: "",
      color: "",
      plateNumber: "",
      seatCapacity: 0,
    },
    resolver: zodResolver(VehicleRegistrationSchema),
  });
  const onSubmit = async (data: TVehicle) => {
    try {
      const response = await dispatch(
        registerVehicle({
          model: data.model,
          company: data.company,
          color: data.color,
          seatCapacity: data.seatCapacity,
          plateNumber: data.plateNumber,
        }),
      ).unwrap();

      toast.success(response.message);

      navigate("/home");
    } catch (error) {
      if (
        error instanceof Object &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        toast.error(error.message);
        return;
      }
      toast.error("Vehicle Registration Failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-2xl font-bold">Register</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            method="POST"
            style={{ display: "contents" }}
          >
            <div className="w-full space-y-2">
              <Label>Model</Label>
              <Controller
                name="model"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter your vehicle model"
                    {...field}
                  />
                )}
              />
              {errors.model && (
                <p className="text-red-500 text-sm">{errors.model.message}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label>Company</Label>
              <Controller
                name="company"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter your vehicle company"
                    {...field}
                  />
                )}
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company.message}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label>Color</Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter your vehicle color"
                    {...field}
                  />
                )}
              />
              {errors.color && (
                <p className="text-red-500 text-sm">{errors.color.message}</p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label>Plate Number</Label>
              <Controller
                name="plateNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="Enter your vehicle plate number"
                    {...field}
                  />
                )}
              />
              {errors.plateNumber && (
                <p className="text-red-500 text-sm">
                  {errors.plateNumber.message}
                </p>
              )}
            </div>
            <div className="w-full space-y-2">
              <Label>Seat Capacity</Label>
              <Controller
                name="seatCapacity"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    placeholder="Enter your vehicle seat capacity"
                    {...field}
                  />
                )}
              />
              {errors.seatCapacity && (
                <p className="text-red-500 text-sm">
                  {errors.seatCapacity.message}
                </p>
              )}
            </div>
            <Button className="w-full" type="submit">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
