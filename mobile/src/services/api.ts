import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "../constants/config";

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 40000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAccessToken(null);
      throw new Error("UNAUTHORIZED");
    }
    throw error;
  },
);

export default api;
