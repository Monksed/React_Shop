import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import api from "../services/api";
import { BASE_URL } from "../constants/config";
import { BrandDTO } from "../types";
import { Image } from "expo-image";

const NEWS = [
  "Travis Scott × Jordan уже здесь",
  "Как почистить белые за 5 минут",
  "ТОП-5 инвестиций января 2025",
  "Редкие пары недели",
  "−70% только 48 часов",
  "Yeezy Restock 2025",
  "Dunk Panda 2.0 в наличии",
  "Новое поступление Off-White",
];

export default function MainPage() {
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoad, setIsLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [brands, setBrands] = useState<BrandDTO[]>([]);
  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) =>
        p.name
          ?.toLowerCase()
          .split(" ")
          .some((w: string) => w.startsWith(q)),
      )
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q);
        const bStarts = b.name.toLowerCase().startsWith(q);
        return aStarts === bStarts ? 0 : aStarts ? -1 : 1;
      });
  }, [products, searchQuery]);

  useEffect(() => {
    api
      .get<any[]>("/Product/All")
      .then(({ data }) => setProducts(data.map((p) => ({ ...p, quantity: 1 }))))
      .catch((err) => console.error("Ошибка загрузки:", err))
      .finally(() => setIsLoad(false));

    api
      .get<BrandDTO[]>("/Brand/All")
      .then(({ data }) => setBrands(data.slice(0, 12)))
      .catch((err) => console.error("Ошибка загрузки брендов:", err));

    api
      .get<any[]>("/Product/Latest?limit=6")
      .then(({ data }) =>
        setLatestProducts(data.map((p) => ({ ...p, quantity: 1 }))),
      )
      .catch((err) => console.error("Ошибка загрузки последних товаров:", err));
  }, []);

  // Разбиваем товары по 2 в строку для grid
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredProducts.length; i += 2) {
      result.push(filteredProducts.slice(i, i + 2));
    }
    return result;
  }, [filteredProducts]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Фиксированные иконки */}
      <View style={styles.fixedIcons}>
        <TouchableOpacity
          onPress={() => router.push("/user")}
          style={styles.iconBtn}
        >
          <Ionicons name="person-outline" size={26} color="#212529" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/cart")}
          style={styles.iconBtn}
        >
          <Ionicons name="cart-outline" size={26} color="#212529" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Новостной слайдер */}
            <View style={styles.newsSlider}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.newsTrack}
              >
                {NEWS.map((text, i) => (
                  <View key={i} style={styles.newsCard}>
                    <Image
                      source={{
                        uri: `https://via.placeholder.com/320x180/0a0a0a/ffffff?text=${i + 1}`,
                      }}
                      style={styles.newsImage}
                      contentFit="cover"
                      transition={200}
                    />
                    <Text style={styles.newsTitle}>{text}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Поиск */}
            <View style={styles.searchSection}>
              <View
                style={[
                  styles.searchBar,
                  (isSearchFocused || searchQuery) && styles.searchBarActive,
                ]}
              >
                <Ionicons name="search" size={16} color="#aaa" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Найти кроссовки..."
                  placeholderTextColor="#aaa"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => setSearchQuery("")}
                  >
                    <Text style={styles.clearBtnText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isLoad && (
              <ActivityIndicator color="#212529" style={{ marginTop: 40 }} />
            )}
            {!isLoad && filteredProducts.length === 0 && (
              <Text style={styles.noResults}>Ничего не найдено</Text>
            )}
          </>
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((product: any) => (
              <View key={product.id} style={styles.cardWrapper}>
                <ProductCard
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  quantity={product.quantity}
                  bonus={product.bonus}
                  onAddToCart={addToCart}
                />
              </View>
            ))}
            {/* Если в строке только 1 товар — пустышка */}
            {row.length === 1 && <View style={styles.cardWrapper} />}
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Бренды */}
            <View style={styles.brandsSection}>
              <Text style={styles.brandsTitle}>Бренды кроссовок</Text>

              <View style={styles.brandsGrid}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand.id}
                    style={styles.brandBtn}
                    activeOpacity={0.7}
                    onPress={() =>
                      router.push({
                        pathname: "/brand/[id]",
                        params: { id: brand.id },
                      })
                    }
                  >
                    <Image
                      source={{ uri: `${BASE_URL}/images/${brand.image}` }}
                      style={styles.brandLogo}
                      contentFit="contain"
                      transition={200}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Выбор покупателей */}
            {latestProducts.length > 0 && (
              <View style={styles.latestSection}>
                <Text style={styles.latestTitle}>Выбор покупателей</Text>
                <View style={styles.latestGrid}>
                  {latestProducts.map((product) => (
                    <View key={product.id} style={styles.latestCardWrapper}>
                      <ProductCard
                        id={product.id}
                        image={product.image}
                        name={product.name}
                        description={product.description}
                        price={product.price}
                        quantity={product.quantity}
                        bonus={product.bonus}
                        onAddToCart={addToCart}
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  fixedIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f5f5f5",
  },
  iconBtn: { padding: 4, position: "relative" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  list: { paddingBottom: 32 },

  // Новости
  newsSlider: { paddingVertical: 20 },
  newsTrack: { paddingHorizontal: 16, gap: 12 },
  newsCard: {
    width: 160,
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#000",
  },
  newsImage: { width: "100%", height: "100%" },
  newsTitle: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
  },

  // Поиск
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 52,
    gap: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchBarActive: { width: "100%", borderRadius: 26 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: "500", color: "#000" },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f2f2f7",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: { fontSize: 18, color: "#666", lineHeight: 22 },
  noResults: { textAlign: "center", color: "#888", fontSize: 18, padding: 40 },

  // Выбор покупателей
  latestSection: { paddingHorizontal: 10, marginBottom: 16 },
  latestTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  latestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 20 },
  latestCardWrapper: { width: "47%" },

  // Grid товаров
  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    marginBottom: 20,
  },
  cardWrapper: { flex: 1 },

  // Бренды
  brandsSection: {
    padding: 16,
    marginTop: 16,
  },

  brandsTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    marginBottom: 24,
    textAlign: "center",
  },

  brandsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },

  brandBtn: {
    width: 110,
    height: 110,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },

  brandLogo: {
    width: "75%",
    height: "75%",
    resizeMode: "contain",
  },
});
