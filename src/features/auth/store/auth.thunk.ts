import {
  IResendVerificationEmailResponse,
  IResendVerificationEmailSchema,
  ISignupResponse,
  IUserRegistrationSchema,
  LoginResponse,
} from "@/features/auth/types/auth.validations";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;
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
export const resendVerificationEmail = createAsyncThunk<
  IResendVerificationEmailResponse,
  IResendVerificationEmailSchema,
  { rejectValue: { success: boolean; message: string } }
>("auth/resend-verify-email", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${backendURL}/auth/resend-verify-email`,
      data,
      {
        headers: { "Content-Type": "application/json" },

        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || "Resend Email Failed",
      });
    }
    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: { success: boolean; message: string } }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      `${backendURL}/auth/login`,
      { email, password },
      config,
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg =
        error.response?.data.message ?? "Error occurred while login ";
      return rejectWithValue({ success: false, message: errorMsg });
    }
    rejectWithValue({
      success: false,
      message: "Error occurred while login",
    });
  }
});
