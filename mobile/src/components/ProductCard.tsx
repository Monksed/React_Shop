import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { BASE_URL } from "../services/api";

interface Props {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity?: number;
  bonus?: number;
  onAddToCart: (item: any) => void;
}

export default function ProductCard({
  id,
  image,
  name,
  description,
  price,
  bonus,
  quantity,
  onAddToCart,
}: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/product/[id]", params: { id } })}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: `${BASE_URL}/images/${image}` }}
          style={styles.image}
          resizeMode="cover"
        />
        {bonus && bonus > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>+{bonus} бонусов</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.price}>{price.toLocaleString("ru-RU")} ₽</Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <TouchableOpacity
          style={[styles.addBtn, quantity === 0 && styles.addBtnDisabled]}
          disabled={quantity === 0}
          onPress={() => onAddToCart({ id, name, price, image })}
        >
          <Text style={styles.addBtnText}>
            {quantity === 0 ? "Нет в наличии" : "🛒  В корзину"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    flexDirection: "column",
    minHeight: 320,
  },
  imageContainer: {
    width: "100%",
    height: 170,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  bonusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#e91e63",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bonusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  details: {
    paddingTop: 10,
    flex: 1,
    justifyContent: "space-between",
    gap: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#252b37",
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: "#252b37",
    lineHeight: 20,
  },
  addBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#212529",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    backgroundColor: "#ccc",
  },
  addBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
