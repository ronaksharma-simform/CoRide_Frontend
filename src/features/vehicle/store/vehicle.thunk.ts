import { useAppSelector } from "@/hooks/hooks";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { IVehicleResponse, TVehicle } from "../validations/vehicle.validations";

const backendURL = import.meta.env.VITE_BACKEND_URL;
const userData = useAppSelector((state) => state.auth);
export const registerVehicle = createAsyncThunk<
  IVehicleResponse,
  TVehicle,
  {
    rejectValue: {
      success: boolean;
      message: string;
    };
  }
>("vehicle/register", async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${backendURL}/api/vehicle`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.accessToken}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,

        message: error.response?.data?.message || "Vehicle Registration Failed",
      });
    }

    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});
