import { AuthState, IUser } from "@/features/auth/auth.interface";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { registerUser, resendVerificationEmail } from "./auth.thunk";

const backendURL = "http://127.0.0.1:3000";

export interface LoginResponse {
  success: boolean;

  message: string;

  data: IUser;

  accessToken: string;
}
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: { sucess: boolean; message: string } }
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
    console.log(error);
    if (error instanceof AxiosError) {
      const errorMsg =
        error.response?.data.message ?? "Error occured while login ";
      return rejectWithValue({ sucess: false, message: errorMsg });
    }
    rejectWithValue({
      sucess: false,
      message: "Error occured while login",
    });
  }
});
const initialState: AuthState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,

  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
        state.error = action.payload?.message || "Login Failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
        console.log(action.payload);
        state.user = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
        state.error = action.payload?.message || "Registration Failed";
      })
      .addCase(resendVerificationEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.accessToken = null;
        state.user = null;
        state.error =
          action.payload?.message || "Resend Verification Email Failed";
      });
  },
});
export default authSlice.reducer;
