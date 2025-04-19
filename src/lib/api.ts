import axios from "axios";
import { refreshToken } from "./token-refresh";
import { getValidToken } from "./auth-utils";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    // Get a fresh token
    const token = await getValidToken();

    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Try to refresh the token
      const newToken = await refreshToken();

      if (newToken) {
        // Retry the original request with the new token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } else {
        // If token refresh failed, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
