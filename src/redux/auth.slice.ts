import { AuthState, IUser } from "@/features/auth/auth.interface";
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendURL = "http://127.0.0.1:5000";

export interface LoginResponse {
  success: boolean;

  message: string;

  data: IUser;

  accessToken: string;
}
export const registerUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(
      `${backendURL}/auth/register`,
      { email, password },
      config,
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    rejectWithValue("Error occured while login");
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.data;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login Failed";
      });
  },
});
export default authSlice.reducer;
