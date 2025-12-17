import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const response = await axios.get(`https://localhost:5023/api/User/user/4f915879-f233-419b-af7e-fa8c83c56e8e`);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};
