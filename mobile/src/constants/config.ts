import { Platform } from "react-native";

export const BASE_URL = Platform.select({
  ios: "http://localhost:5023",
  android: "http://10.0.2.2:5023",
})!;