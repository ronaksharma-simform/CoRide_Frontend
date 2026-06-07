import { TRideFindDataSchema } from "@/features/ride/validations/ride.validations";
import { createSlice } from "@reduxjs/toolkit";
import { findRide } from "./findRide.slice";

export interface TFindRideState {
  loading: boolean;
  error: string | null;
  ride: TRideFindDataSchema[];
  searchParams: TRideFindDataSchema;
}

const initialState: TFindRideState = {
  loading: false,
  error: "",
  ride: [],
  searchParams: {} as TRideFindDataSchema,
};

const findRideSlice = createSlice({
  name: "findRide",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findRide.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findRide.fulfilled, (state, action) => {
        state.loading = false;
        state.ride = action.payload.data;
        state.error = null;
      })
      .addCase(findRide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Fail to find rides";
      });
  },
});
export default findRideSlice.reducer;
