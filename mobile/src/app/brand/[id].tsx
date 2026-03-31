import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../contexts/CartContext";
import { api, BASE_URL } from "../../services/api";
import { BrandDTO, ProductDTO } from "../../types";

interface BrandWithProducts {
  brand: BrandDTO;
  products: ProductDTO[];
}

export default function BrandPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [data, setData] = useState<BrandWithProducts | null>(null);
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    api
      .get<BrandWithProducts>(`/api/Brand/${id}/products`)
      .then((res) => setData(res))
      .catch((err) => console.error("Ошибка загрузки бренда:", err))
      .finally(() => setIsLoad(false));
  }, [id]);

  if (isLoad)
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          color="#000"
          size="large"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );

  if (!data)
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Бренд не найден</Text>
      </SafeAreaView>
    );

  const rows = [];
  for (let i = 0; i < data.products.length; i += 2) {
    rows.push(data.products.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Кнопка назад */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>

            {/* Логотип бренда */}
            <View style={styles.brandHeader}>
              <View style={styles.brandLogoWrapper}>
                <Image
                  source={{ uri: `${BASE_URL}/images/${data.brand.image}` }}
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>{data.brand.title}</Text>
              <Text style={styles.brandCount}>
                {data.products.length} товаров
              </Text>
            </View>
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
                  quantity={1}
                  bonus={product.bonus}
                  onAddToCart={addToCart}
                />
              </View>
            ))}
            {row.length === 1 && <View style={styles.cardWrapper} />}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Товаров пока нет</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  list: { paddingBottom: 32 },
  backBtn: { padding: 16 },
  brandHeader: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  brandLogoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 28,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  brandLogo: { width: "80%", height: "80%" },
  brandTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 4,
  },
  brandCount: { fontSize: 15, color: "#888" },
  row: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 20,
    marginBottom: 20,
  },
  cardWrapper: { flex: 1 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 16, color: "#888" },
  errorText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#333",
  },
});
