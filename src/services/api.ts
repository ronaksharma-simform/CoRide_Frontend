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
    console.log(originalRequest.url);
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest.url !== "/auth/login"
    ) {
      originalRequest._retry = true;
      const response = await refreshApi.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true },
      );
      console.log(response);

      return api(originalRequest);
    }

    return Promise.reject(error);
  },
);
export default api;
