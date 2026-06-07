import { TFindRideRequestSchema } from "@/features/ride/validations/ride.validations";
import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { IFindRideResponseSchema } from "../validations/findRide.validations";

export const findRide = createAsyncThunk<
  IFindRideResponseSchema,
  TFindRideRequestSchema,
  { rejectValue: { success: boolean; message: string } }
>(
  "ride/find",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/ride/find`, data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message:
            error.response?.data?.message || "Failed to find matching rides",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
