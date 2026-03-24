import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { CartProvider } from "../contexts/CartContext";
import { UserProvider } from "../contexts/UserContext";
import { useAuthStore } from "../store/authStore";

function RootLayoutNav() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    SecureStore.deleteItemAsync("auth.token");
    SecureStore.deleteItemAsync("user.id");
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login" as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <RootLayoutNav />
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
