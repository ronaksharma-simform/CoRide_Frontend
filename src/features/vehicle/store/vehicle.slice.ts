import { createSlice } from "@reduxjs/toolkit";
import { registerVehicle } from "./vehicle.thunk";
import { TVehicle } from "../validations/vehicle.validations";
export interface TVehicleState {
  loading: boolean;
  error: string | null;
  vehicle: TVehicle | null;
}

const initialState: TVehicleState = {
  loading: false,
  error: "",
  vehicle: null,
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
        state.vehicle = action.payload.data;
        state.error = null;
      })
      .addCase(registerVehicle.rejected, (state, action) => {
        state.loading = false;
        state.vehicle = null;
        state.error = action.payload?.message || "Vehicle Registration Failed";
      });
  },
});
export default vehicleSlice.reducer;
