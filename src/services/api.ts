import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest.url !== "/auth/login"
    ) {
      originalRequest._retry = true;
      await refreshApi.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true },
      );

      return api(originalRequest);
    }

    throw new Error(error);
  },
);
export default api;
