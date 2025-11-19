// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 15000,
});

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If backend returns 401 and this is the FIRST failure: try refreshing
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        // Attempt token refresh (Django's refresh view)
        await api.post("/auth/refresh/");
        return api(original);
      } catch {
        // refresh failed, user is logged out
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
