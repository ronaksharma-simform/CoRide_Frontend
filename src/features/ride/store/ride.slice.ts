import { createSlice } from "@reduxjs/toolkit";
import {
  TRideAvailableSchema,
  TRideDataSchema,
  TRideSeatLayoutSchema,
} from "../validations/ride.validations";
import {
  bookSeat,
  deleteRide,
  getAvailableRides,
  getRide,
  getRideSeatLayout,
  getUserRides,
  registerRide,
  updateRide,
} from "./ride.thunk";
export interface TRideState {
  loading: boolean;
  error: string | null;
  ride: TRideDataSchema[];
  availableRides: TRideAvailableSchema[];
  seatLayout: TRideSeatLayoutSchema | null;
}

const initialState: TRideState = {
  loading: false,
  error: "",
  ride: [],
  availableRides: [],
  seatLayout: null,
};

const rideSlice = createSlice({
  name: "ride",
  initialState,
  reducers: {
    clearSeatLayout: (state) => {
      state.seatLayout = null;
      state.error = null;
    },
  },
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
      })
      .addCase(getAvailableRides.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAvailableRides.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.availableRides = action.payload.data;
      })
      .addCase(getAvailableRides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load ride data";
      })
      .addCase(getRideSeatLayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRideSeatLayout.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.seatLayout = action.payload.data;
      })
      .addCase(getRideSeatLayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to load seat layout";
      })
      .addCase(bookSeat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookSeat.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(bookSeat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to book the seat";
      });
  },
});
export const { clearSeatLayout } = rideSlice.actions;
export default rideSlice.reducer;
