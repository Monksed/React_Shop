import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../contexts/CartContext";
import { api, BASE_URL } from "../../services/api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIZES = [36, 36.5, 37, 38, 39, 40, 41];

const TIPS = [
  "Как почистить белую подошву",
  "С чем носить эти кроссы",
  "Как отличить оригинал",
  "ТОП-5 похожих моделей",
  "Гайд по размерам",
  "Можно ли стирать",
  "Лайфхаки от реселлеров",
  "История модели",
];

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoad, setIsLoad] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [qaOpen, setQaOpen] = useState({ insurance: false, delivery: false });

  useEffect(() => {
    api
      .get<any>(`/api/Product/One/${id}`)
      .then((data) => setProduct({ ...data, quantity: 1 }))
      .catch((err) => console.error(err))
      .finally(() => setIsLoad(false));
  }, [id]);

  if (isLoad)
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#000" size="large" />
      </View>
    );
  if (!product)
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Товар не найден</Text>
      </View>
    );

  const images: string[] = product.images || [product.image];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Галерея */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const idx = Math.round(
              e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
            );
            setCurrentImageIndex(idx);
          }}
          scrollEventThrottle={16}
        >
          {images.map((img, i) => (
            <Image
              key={i}
              source={{ uri: `${BASE_URL}/images/${img}` }}
              style={styles.slide}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Точки */}
        {images.length > 1 && (
          <View style={styles.dots}>
            {images.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentImageIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}

        <View style={styles.card}>
          {/* Цена */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {product.price.toLocaleString("ru-RU")} ₽
            </Text>
          </View>

          {/* Название */}
          <Text style={styles.title}>{product.name}</Text>

          {/* Размеры */}
          <View style={styles.sizesWrap}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeBtn,
                  selectedSize === size && styles.sizeBtnSelected,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.sizeBtnText,
                    selectedSize === size && styles.sizeBtnTextSelected,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Наличие */}
          <Text
            style={[
              styles.stock,
              product.quantity > 0 ? styles.inStock : styles.outStock,
            ]}
          >
            {product.quantity > 0 ? "В наличии" : "Распродано"}
          </Text>

          {/* Описание */}
          <View style={styles.descBlock}>
            <Text style={styles.descTitle}>Описание</Text>
            <Text style={styles.descText}>{product.description}</Text>
          </View>
        </View>

        {/* Советы */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsTrack}
        >
          {TIPS.map((tip, i) => (
            <View key={i} style={styles.tipCard}>
              <Image
                source={{
                  uri: `https://via.placeholder.com/300x200/0a0a0a/ffffff?text=Совет+${i + 1}`,
                }}
                style={styles.tipImage}
              />
              <Text style={styles.tipTitle}>{tip}</Text>
            </View>
          ))}
        </ScrollView>

        {/* FAQ */}
        <View style={styles.qaSection}>
          {[
            {
              key: "insurance",
              label: "Страховка и безопасность",
              text: "100% оригинал — проверка перед отправкой.\nПодделка = возврат ×3.\nФирменный бокс + все пломбы и бирки.\nВозврат 14 дней.",
            },
            {
              key: "delivery",
              label: "Доставка и оплата",
              text: "СДЭК / Boxberry / Почта — выбирай любой.\nБесплатно от 15 000 ₽.\nМосква-СПб: 1–2 дня · Регионы: 3–7 дней.\nОплата онлайн или при получении.",
            },
          ].map(({ key, label, text }) => (
            <View key={key} style={styles.qaItem}>
              <TouchableOpacity
                style={styles.qaQuestion}
                onPress={() =>
                  setQaOpen((prev) => ({
                    ...prev,
                    [key]: !prev[key as keyof typeof prev],
                  }))
                }
              >
                <Text style={styles.qaLabel}>{label}</Text>
                <Ionicons
                  name={
                    qaOpen[key as keyof typeof qaOpen]
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={28}
                  color="#111"
                />
              </TouchableOpacity>
              {qaOpen[key as keyof typeof qaOpen] && (
                <Text style={styles.qaAnswer}>{text}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Отступ под фиксированную кнопку */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Кнопка купить */}
      <View style={styles.buyWrapper}>
        <TouchableOpacity
          style={[
            styles.buyBtn,
            product.quantity <= 0 && styles.buyBtnDisabled,
          ]}
          disabled={product.quantity <= 0}
          onPress={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image || product.images?.[0],
              selectedSize: selectedSize ?? undefined,
            });
            Alert.alert("Добавлено в корзину!");
          }}
        >
          <Text style={styles.buyBtnText}>
            {product.quantity > 0 ? "В корзину" : "Нет в наличии"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorText: { color: "#333", fontSize: 16 },
  backBtn: {
    position: "absolute",
    top: 52,
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  slide: { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
  dots: {
    position: "absolute",
    top: SCREEN_WIDTH - 28,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: { backgroundColor: "#fff", width: 18 },

  card: { backgroundColor: "#fff" },
  priceRow: { padding: 14, paddingBottom: 8 },
  price: { fontSize: 34, fontWeight: "600", color: "#000" },
  title: {
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    marginBottom: 16,
  },
  sizesWrap: {
    paddingHorizontal: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  sizeBtn: {
    flex: 1,
    minWidth: 60,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sizeBtnSelected: { borderColor: "#000", backgroundColor: "#000" },
  sizeBtnText: { fontSize: 15, fontWeight: "500", color: "#333" },
  sizeBtnTextSelected: { color: "#fff" },
  stock: {
    paddingHorizontal: 18,
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "600",
  },
  inStock: { color: "#00aa00" },
  outStock: { color: "#999" },
  descBlock: {
    padding: 20,
    paddingHorizontal: 18,
    backgroundColor: "#fafafa",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  descText: { fontSize: 15, color: "#555", lineHeight: 24 },

  // Советы
  tipsTrack: { paddingHorizontal: 16, paddingVertical: 20, gap: 11 },
  tipCard: {
    width: 132,
    height: 82,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#000",
  },
  tipImage: { width: "100%", height: "100%" },
  tipTitle: {
    position: "absolute",
    top: 6,
    left: 6,
    right: 6,
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
  },

  // FAQ
  qaSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    borderTopWidth: 12,
    borderTopColor: "#f5f5f5",
  },
  qaItem: { borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  qaQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
  },
  qaLabel: { fontSize: 17, fontWeight: "700", color: "#000", flex: 1 },
  qaAnswer: {
    fontSize: 15,
    lineHeight: 26,
    color: "#222",
    fontWeight: "500",
    paddingBottom: 20,
  },

  // Кнопка
  buyWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    paddingBottom: 32,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  buyBtn: {
    backgroundColor: "#000",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  buyBtnDisabled: { backgroundColor: "#e0e0e0" },
  buyBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
