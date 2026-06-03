// import {
//   IResendVerificationEmailResponse,
//   IResendVerificationEmailSchema,
//   ISignupResponse,
//   IUserRegistrationSchema,
//   LoginResponse,
// } from "@/features/auth/validations/auth.validations";
import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { TRide } from "../validations/ride.validations";

export const registerRide = createAsyncThunk<
  ISignupResponse,
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
