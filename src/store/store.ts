import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/auth.slice";
import vehicleReducer from "@/features/vehicle/store/vehicle.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    vehicle: vehicleReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
