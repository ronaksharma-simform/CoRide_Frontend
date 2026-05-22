import { AuthState, IUser } from "@/features/auth/types/auth.validations";
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, resendVerificationEmail } from "./auth.thunk";
export interface LoginResponse {
  success: boolean;

  message: string;

  data: IUser;

  accessToken: string;
}

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
