import { Platform } from "react-native";
import { authService } from "./authServices";

export const BASE_URL = Platform.select({
  ios: "http://localhost:5023",
  android: "http://10.0.2.2:5023",
});

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await authService.getToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    await authService.clearAuth();
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error(`${endpoint} → ${response.status}:`, errText);
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
