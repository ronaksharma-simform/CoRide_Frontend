import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Register from "./vehicle/Register";
// import VehicleCard from "./vehicle/VehicleCard";
import { useAppSelector } from "@/hooks/hooks";

const Home = () => {
  const navigate = useNavigate();
  const vehicle = useAppSelector((state) => state.vehicle);
  console.log(vehicle);
  return (
    <div>
      Home
      <Button onClick={() => navigate("/vehicle/register")}>
        Vehicle Register
      </Button>
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <Register />
            {/* <VehicleCard
          /> */}
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
};

export default Home;
