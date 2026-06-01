import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import {
  IVehicleResponse,
  IVehiclesResponse,
  TVehicle,
} from "../validations/vehicle.validations";
import api from "@/services/api";
// import api from "@/services/api";

const backendURL = import.meta.env.VITE_BACKEND_URL;

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
    const response = await api.post(`${backendURL}/api/vehicle`, data, {
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
export const getAllVehicle = createAsyncThunk<
  IVehiclesResponse,
  "",
  {
    rejectValue: {
      success: boolean;
      message: string;
    };
  }
>("vehicle/getAllVehicle", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `${backendURL}/api/vehicle/vehicles`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue({
        success: false,

        message: error.response?.data?.message || "Error getting the vehicles",
      });
    }

    return rejectWithValue({
      success: false,
      message: "Something went wrong",
    });
  }
});
