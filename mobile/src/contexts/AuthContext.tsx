import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { router } from "expo-router";
import api, { setAccessToken } from "../services/api";
import { authService } from "../services/authServices";

type AuthContextType = {
  isAuthenticated: boolean;
  authReady: boolean;
  userId: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await authService.getToken();
        const storedUserId = await authService.getUserId();
        if (stored) {
          setAccessToken(stored);
          setToken(stored);
          setUserId(storedUserId);
        }
      } catch {
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; userId: string }>(
      "/auth/login",
      { email, password },
    );
    setAccessToken(data.token);
    setToken(data.token);
    setUserId(data.userId);
    await authService.saveAuth(data.token, data.userId);
    router.replace("/");
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; userId: string }>(
      "/auth/register",
      { email, password },
    );
    setAccessToken(data.token);
    setToken(data.token);
    setUserId(data.userId);
    await authService.saveAuth(data.token, data.userId);
    router.replace("/");
  }, []);

  const logout = useCallback(async () => {
    setAccessToken(null);
    setToken(null);
    setUserId(null);
    await authService.clearAuth();
    router.replace("/(auth)/login" as any);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        authReady,
        userId,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
