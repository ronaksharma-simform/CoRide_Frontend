import { createSlice } from "@reduxjs/toolkit";
import { getAllVehicle, registerVehicle } from "./vehicle.thunk";
import { TVehicle } from "../validations/vehicle.validations";
export interface TVehicleState {
  loading: boolean;
  error: string | null;
  vehicle: TVehicle[];
}

const initialState: TVehicleState = {
  loading: false,
  error: "",
  vehicle: [],
};

const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicle.push(action.payload.data);
        state.error = null;
      })
      .addCase(registerVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Vehicle Registration Failed";
      })
      .addCase(getAllVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.vehicle = action.payload.data;
        state.error = null;
      })
      .addCase(getAllVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error getting the vehicles";
      });
  },
});
export default vehicleSlice.reducer;
