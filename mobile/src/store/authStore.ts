import { create } from "zustand";
import { router } from "expo-router";
import { api } from "../services/api";
import { authService } from "@/services/authServices";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await authService.getToken();
      const userId = await authService.getUserId();
      set({
        isAuthenticated: token !== null,
        userId: userId,
        isLoading: false,
      });
    } catch {
      set({ isAuthenticated: false, userId: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const data = await api.post<{ token: string; userId: string }>(
      "/api/auth/login",
      { email, password },
    );
    await authService.saveAuth(data.token, data.userId);
    set({ isAuthenticated: true, userId: data.userId });
    router.replace("/");
  },

  register: async (email, password) => {
    const data = await api.post<{ token: string; userId: string }>(
      "/api/auth/register",
      { email, password },
    );
    await authService.saveAuth(data.token, data.userId);
    set({ isAuthenticated: true, userId: data.userId });
    router.replace("/");
  },

  logout: async () => {
    await authService.clearAuth();
    set({ isAuthenticated: false, userId: null });
    router.replace("/(auth)/login");
  },
}));
