import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
});

export const setAuthHeader = (token) => {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete apiClient.defaults.headers.common["Authorization"];
};
