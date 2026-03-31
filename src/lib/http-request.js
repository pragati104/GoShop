import axios from "axios";
import { useAuth } from "../zustand/useAuth";

export const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

httpRequest.interceptors.request.use((config) => {
  const token = useAuth.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
