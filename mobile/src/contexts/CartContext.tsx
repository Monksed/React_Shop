import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "cart_items";
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  selectedSize?: string | number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY)
      .then((data) => {
        if (data) setCartItems(JSON.parse(data));
      })
      .catch(console.error)
      .finally(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems)).catch(
      console.error,
    );
  }, [cartItems, isReady]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
