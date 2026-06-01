import store from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    console.log(store.getState().auth);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
export default api;
