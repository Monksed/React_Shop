import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

export const authService = {
  saveAuth: async (token: string, user_id: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_ID_KEY, user_id);
  },
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),

  getUserId: () => SecureStore.getItemAsync(USER_ID_KEY),

  clearAuth: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
  },

  isAuthenticated: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token !== null;
  },
};
