import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Animated,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../contexts/CartContext";
import api from "../../services/api";
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

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const searchHeight = useRef(new Animated.Value(0)).current;

  const toggleSearch = () => {
    if (searchVisible) {
      Animated.timing(searchHeight, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }).start(() => setSearchVisible(false));
    } else {
      setSearchVisible(true);
      Animated.timing(searchHeight, {
        toValue: 68,
        duration: 250,
        useNativeDriver: false,
      }).start();
    }
  };

  useEffect(() => {
    api
      .get<BrandWithProducts>(`/Brand/${id}/products`)
      .then(({ data }) => setData(data))
      .catch((err) => console.error("Ошибка загрузки бренда:", err))
      .finally(() => setIsLoad(false));
  }, [id]);

  if (isLoad) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color="#000" size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Бренд не найден</Text>
      </SafeAreaView>
    );
  }

  const filteredProducts = data.products.filter((product: ProductDTO) => {
    const matchesSearch =
      !searchQuery ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const productAny = product as any;
    const matchesSize =
      !selectedSize ||
      (productAny.sizes && Array.isArray(productAny.sizes)
        ? productAny.sizes.includes(selectedSize)
        : true);

    return matchesSearch && matchesSize;
  });

  const rows: ProductDTO[][] = [];
  for (let i = 0; i < filteredProducts.length; i += 2) {
    rows.push(filteredProducts.slice(i, i + 2));
  }

  const availableSizes = ["36", "36.5", "37", "37.5", "38", "38.5"];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Назад  */}
            <View style={styles.topBar}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={28} color="#000" />
                <Text style={styles.backText}>Назад</Text>
              </TouchableOpacity>
            </View>

            {/* Название бренда и */}
            <View style={styles.brandSection}>
              <Text style={styles.brandTitle}>{data.brand.title}</Text>

              <View style={styles.rightActions}>
                <TouchableOpacity style={styles.searchBtn} onPress={toggleSearch}>
                  <Ionicons name="search" size={24} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => setFilterModalVisible(true)}
                >
                  <Ionicons name="options-outline" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Поиск */}
            <Animated.View
              style={[
                styles.searchAnimatedContainer,
                { height: searchHeight, overflow: "hidden" },
              ]}
            >
              <View style={styles.searchInputWrapper}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Поиск кроссовок..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={20} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>

            {/* Размеры */}
            <View style={styles.sizeSelector}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sizeScrollContent}
              >
                {availableSizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeChip,
                      selectedSize === size && styles.sizeChipSelected,
                    ]}
                    onPress={() =>
                      setSelectedSize(selectedSize === size ? null : size)
                    }
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === size && styles.sizeTextSelected,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={{ height: 28 }} />
          </>
        }
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((product: ProductDTO) => (
              <View key={product.id} style={styles.cardWrapper}>
                <ProductCard
                  id={product.id}
                  image={product.image ?? ""}
                  name={product.name ?? ""}
                  description={product.description ?? ""}
                  price={product.price ?? 0}
                  quantity={1}
                  bonus={product.bonus ?? 0}
                  onAddToCart={addToCart}
                />
              </View>
            ))}
            {row.length === 1 && <View style={styles.cardWrapper} />}
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Товаров по вашему запросу нет</Text>
          </View>
        }
      />

      {/* Модальное окно фильтров */}
      <Modal visible={filterModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Фильтры</Text>
            <Text style={styles.modalText}>
              Здесь будут дополнительные фильтры (цена, цвет, модель и т.д.)
            </Text>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  list: { paddingBottom: 32 },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },

  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#ffffff",
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#000000",
    flex: 1,
    textAlign: "left",
    paddingLeft: 4,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  searchBtn: { padding: 6 },
  filterBtn: { padding: 6 },

  searchAnimatedContainer: { backgroundColor: "#ffffff" },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 16,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    marginLeft: 8,
  },

  sizeSelector: {
    backgroundColor: "#ffffff",
    paddingTop: 12,
    paddingBottom: 16,
  },
  sizeScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  sizeChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
  },
  sizeChipSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222222",
  },
  sizeTextSelected: {
    color: "#ffffff",
  },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  modalCloseBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});