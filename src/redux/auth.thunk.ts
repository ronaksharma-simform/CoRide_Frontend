import {
  ISignupResponse,
  IUserRegistrationSchema,
} from "@/features/auth/auth.interface";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const backendURL = "http://127.0.0.1:3000";
export const registerUser = createAsyncThunk<
  ISignupResponse,
  IUserRegistrationSchema,
  { rejectValue: { success: boolean; message: string } }
>(
  "auth/register",

  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendURL}/auth/register`, data, {
        headers: { "Content-Type": "application/json" },

        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue({
          success: false,

          message: error.response?.data?.message || "Registration failed",
        });
      }

      return rejectWithValue({
        success: false,

        message: "Something went wrong",
      });
    }
  },
);
