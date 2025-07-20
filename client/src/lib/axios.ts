// lib/axios.ts
import axios from "axios";
import { store } from "../redux/store";
import { setAccessToken } from "../redux/slices/userSlice";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = store.getState().user.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      error.response.data.message === "Access token invalid or expired"
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;
        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
