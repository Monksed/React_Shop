import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CartProvider } from "../contexts/CartContext";
import { UserProvider } from "../contexts/UserContext";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, authReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!authReady) return;

    const inAuthGroup = (segments[0] as string) === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login" as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, authReady, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserProvider>
          <CartProvider>
            <RootLayoutNav />
          </CartProvider>
        </UserProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
