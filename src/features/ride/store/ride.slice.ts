import { createSlice } from "@reduxjs/toolkit";
import { TRideDataSchema } from "../validations/ride.validations";
import { registerRide } from "./ride.thunk";
export interface TRideState {
  loading: boolean;
  error: string | null;
  ride: TRideDataSchema[];
}

const initialState: TRideState = {
  loading: false,
  error: "",
  ride: [],
};

const vehicleSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride.push(action.payload.data);
        state.error = null;
      })
      .addCase(registerRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ride Registration Failed";
      });
  },
});
export default vehicleSlice.reducer;
