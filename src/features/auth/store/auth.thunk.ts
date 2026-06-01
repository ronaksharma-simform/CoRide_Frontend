import {
  IResendVerificationEmailResponse,
  IResendVerificationEmailSchema,
  ISignupResponse,
  IUserRegistrationSchema,
  LoginResponse,
} from "@/features/auth/validations/auth.validations";
import api from "@/services/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const registerUser = createAsyncThunk<
  ISignupResponse,
  IUserRegistrationSchema,
  { rejectValue: { success: boolean; message: string } }
>(
  "auth/register",

  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", data, {
        headers: { "Content-Type": "application/json" },
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
    const response = await api.post("/auth/resend-verify-email", data, {
      headers: { "Content-Type": "application/json" },
    });
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
    const response = await api.post(
      "/auth/login",
      { email, password },
      {
        headers: { "Content-Type": "application/json" },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMsg =
        error.response?.data.message ?? "Error occurred while login ";
      return rejectWithValue({ success: false, message: errorMsg });
    }
    return rejectWithValue({
      success: false,
      message: "Error occurred while login",
    });
  }
});
