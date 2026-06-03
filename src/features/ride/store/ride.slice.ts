import { createSlice } from "@reduxjs/toolkit";
import { TRideDataSchema } from "../validations/ride.validations";
import {
  deleteRide,
  getRide,
  getUserRides,
  registerRide,
  updateRide,
} from "./ride.thunk";
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
      })
      .addCase(deleteRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = state.ride.filter((v) => v.id !== action.payload.data.id);
        state.error = null;
      })
      .addCase(deleteRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ride Deletion Failed";
      })
      .addCase(updateRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = state.ride.filter((v) => v.id !== action.payload.data.id);
        state.ride.push(action.payload.data);
        state.error = null;
      })
      .addCase(updateRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Ride Updation Failed";
      })
      .addCase(getRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRide.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load ride data";
      })
      .addCase(getUserRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserRides.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.ride = action.payload.data;
      })
      .addCase(getUserRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load ride data";
      });
  },
});
export default vehicleSlice.reducer;
