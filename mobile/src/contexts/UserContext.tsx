import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { UserDTO } from "../types";

interface UserContextType {
  user: UserDTO | null;
  isLoading: boolean;
  loadUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  const loadUser = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.get<UserDTO>("/api/user/me");
      setUser(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <UserContext.Provider value={{ user, isLoading, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};
