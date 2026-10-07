import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  IAvailableRidesResponseSchema,
  IBookSeatResponseSchema,
  IRideResponseSchema,
  IRideSeatLayoutResponseSchema,
  IUserRideResponseSchema,
  TRide,
  TRideUpdateData,
} from "../validations/ride.validations";

export const registerRide = createAsyncThunk<
  IRideResponseSchema,
  TRide,
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/register",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/ride", data, {
        headers: { "Content-Type": "application/json" },
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Ride Registration failed",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
export const deleteRide = createAsyncThunk<
  IRideResponseSchema,
  {
    id: string;
  },
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/delete",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/ride/${data.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Ride Deletion failed",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
export const updateRide = createAsyncThunk<
  IRideResponseSchema,
  TRideUpdateData,
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/update",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/ride/${data.id}`, data.data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Ride Updation failed",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
export const getRide = createAsyncThunk<
  IRideResponseSchema,
  {
    id: string;
  },
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/get",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/ride/${data.id}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Failed to load ride data",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
export const getUserRides = createAsyncThunk<
  IUserRideResponseSchema,
  void,
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/getUserRides",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/ride/user/`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Failed to load ride data",
        });
      }
    }
    return rejectWithValue({
      success: false,

      message: "Something went wrong",
    });
  },
);
export const getAvailableRides = createAsyncThunk<
  IAvailableRidesResponseSchema,
  void,
  { rejectValue: { success: boolean; message: string } }
>("ride/getAvailableRides", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/ride/available", {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to load ride data",
      });
    }
    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});
export const getRideSeatLayout = createAsyncThunk<
  IRideSeatLayoutResponseSchema,
  { rideId: string },
  { rejectValue: { success: boolean; message: string } }
>("ride/getSeatLayout", async ({ rideId }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/api/ride/${rideId}/layout`, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to load seat layout",
      });
    }
    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});
export const bookSeat = createAsyncThunk<
  IBookSeatResponseSchema,
  { rideId: string; seatNumber: number },
  { rejectValue: { success: boolean; message: string } }
>("ride/bookSeat", async ({ rideId, seatNumber }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/ride/${rideId}/book-seat`,
      { seatNumber },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Failed to book the seat",
      });
    }
    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});
