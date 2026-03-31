import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../services/api";

interface User {
  id: string;
  fio?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  loadUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};

// TODO: заменить на userId из JWT после добавления авторизации
const USER_ID = "de4ffe00-7418-42c6-ba59-15feaf6db040";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const data = await api.get<User>(`/api/User/user/${USER_ID}`);
      setUser(data);
    } catch (error) {
      console.error("Ошибка загрузки пользователя:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, loadUser }}>
      {children}
    </UserContext.Provider>
  );
};
