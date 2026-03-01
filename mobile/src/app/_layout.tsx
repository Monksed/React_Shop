import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { CartProvider } from '../contexts/CartContext';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}