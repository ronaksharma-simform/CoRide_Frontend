import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Register from "./vehicle/Register";
// import VehicleCard from "./vehicle/VehicleCard";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";

import React, { useEffect } from "react";
import { getAllVehicle } from "@/features/vehicle/store/vehicle.thunk";
import VehicleCard from "./vehicle/VehicleCard";

const Home = () => {
  const navigate = useNavigate();
  const vehicle = useAppSelector((state) => state.vehicle);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getAllVehicle());
  }, [dispatch]);
  console.log(vehicle);
  const handleReq = async () => {
    const data = dispatch(getAllVehicle()).unwrap();
    console.log("clicked");
    console.log(data);
  };

  console.log(vehicle);

  return (
    <div>
      Home
      <Button onClick={() => navigate("/vehicle/register")}>
        Vehicle Register
      </Button>
      <Button onClick={() => navigate("/ride/register")}>Ride Register</Button>
      <Button onClick={handleReq}>Vehicle</Button>
      Vehicle List
      {vehicle.vehicle.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <Register />
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default Home;
