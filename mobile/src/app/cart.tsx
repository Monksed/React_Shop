import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../contexts/CartContext";
import { BASE_URL } from "../constants/config";
import api from "@/services/api";
import { CreateOrderDTO, OrderDTO } from "@/types";
import { useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    const dto: CreateOrderDTO = {
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        selectedSize: item.selectedSize ? String(item.selectedSize) : null,
        image: item.image,
      })),
    };

    try {
      setIsLoading(true);
      setError(null);
      const { data } = await api.post<OrderDTO>("/order/create", dto);
      clearCart();
      router.replace({
        pathname: "/order",
        params: { orderId: data.id },
      });
    } catch (e) {
      console.log(e);
      setError("Не удалось оформить заказ. Попробуйте ещё раз.");
    } finally {
      setIsLoading(false);
    }
  };
  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#212529" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Корзина</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Корзина пуста</Text>
          <Text style={styles.emptySub}>
            Добавьте товары, чтобы оформить заказ
          </Text>
          <TouchableOpacity
            style={styles.backToShopBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backToShopText}>Вернуться к покупкам</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Корзина</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: `${BASE_URL}/images/${item.image}` }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.selectedSize && (
                <Text style={styles.itemDesc}>Размер: {item.selectedSize}</Text>
              )}
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qty}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.itemPrice}>
                {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Итого:</Text>
              <Text style={styles.totalPrice}>
                {totalPrice.toLocaleString("ru-RU")} ₽
              </Text>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
              style={[styles.checkoutBtn, isLoading && { opacity: 0.6 }]}
              onPress={handleCheckout}
              disabled={isLoading}
            >
              <Text style={styles.checkoutText}>
                {isLoading ? "Оформляем..." : "Оформить заказ"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#000" },
  list: { padding: 16, paddingBottom: 32 },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    gap: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: { width: 90, height: 90, borderRadius: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 4 },
  itemDesc: { fontSize: 13, color: "#666", marginBottom: 12 },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 8,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { fontSize: 20, color: "#333" },
  qty: { fontSize: 18, minWidth: 24, textAlign: "center", color: "#000" },
  itemPrice: { fontSize: 18, fontWeight: "700", color: "#000" },
  removeBtn: { padding: 8 },
  removeBtnText: { fontSize: 28, color: "#ff3b30", lineHeight: 32 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: { fontSize: 80, marginBottom: 24, opacity: 0.6 },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
  },
  emptySub: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    maxWidth: 280,
  },
  backToShopBtn: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: "#007aff",
    borderRadius: 16,
    minWidth: 240,
    alignItems: "center",
    shadowColor: "#007aff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  backToShopText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: { fontSize: 20, color: "#333" },
  totalPrice: { fontSize: 20, fontWeight: "700", color: "#000" },
  checkoutBtn: {
    backgroundColor: "#007aff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
});
