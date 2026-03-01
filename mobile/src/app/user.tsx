import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../contexts/UserContext";
import { api } from "../services/api";

export default function UserPage() {
  const router = useRouter();
  const { user, isLoading, loadUser } = useUser();

  const [fio, setFio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      setFio(user.fio || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [isLoading, user]);

  const saveUser = async () => {
    if (!user || isSaving) return;

    setIsSaving(true);
    setSaveStatus("");

    try {
      await api.post("/api/User/Update", {
        id: user.id,
        fio,
        email,
        phone,
        address,
      });

      setSaveStatus("Сохранено!");
      await loadUser();
    } catch (error: any) {
      setSaveStatus(error?.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 2000);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          color="#007AFF"
          size="large"
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        style={{ backgroundColor: "#f9f9f9" }}
      >
        {/* Аватар */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={48} color="#888" />
          </View>
        </View>

        {/* Форма */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Данные для доставки</Text>
          <Text style={styles.cardDesc}>
            Чтобы не вводить каждый раз после заказа.
          </Text>

          {[
            { label: "ФИО", value: fio, onChange: setFio, keyboard: "default" },
            {
              label: "Email",
              value: email,
              onChange: setEmail,
              keyboard: "email-address",
            },
            {
              label: "Телефон",
              value: phone,
              onChange: setPhone,
              keyboard: "phone-pad",
            },
            {
              label: "Адрес",
              value: address,
              onChange: setAddress,
              keyboard: "default",
            },
          ].map(({ label, value, onChange, keyboard }) => (
            <View key={label} style={styles.field}>
              <Text style={styles.fieldLabel}>{label}</Text>
              <TextInput
                style={styles.fieldInput}
                value={value}
                onChangeText={onChange}
                placeholderTextColor="#555"
                placeholder={label}
                keyboardType={keyboard as any}
                autoCapitalize="none"
              />
            </View>
          ))}

          <TouchableOpacity
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
            onPress={saveUser}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Сохранить изменения</Text>
            )}
          </TouchableOpacity>

          {saveStatus !== "" && (
            <View
              style={[
                styles.statusBanner,
                saveStatus.includes("Ошибка")
                  ? styles.statusError
                  : styles.statusSuccess,
              ]}
            >
              <Text style={styles.statusText}>{saveStatus}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  scroll: { paddingBottom: 48 },
  avatarWrapper: { alignItems: "center", marginBottom: 32, marginTop: 8 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007cff",
    shadowColor: "#00ccff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginHorizontal: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  cardDesc: { fontSize: 15, color: "#666", lineHeight: 22, marginBottom: 24 },
  field: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  fieldInput: {
    height: 52,
    backgroundColor: "#f8f8f8",
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#000",
    borderWidth: 1.8,
    borderColor: "transparent",
  },
  saveBtn: {
    backgroundColor: "#000",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  statusBanner: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  statusSuccess: { backgroundColor: "#e6f4ea" },
  statusError: { backgroundColor: "#fce8e6" },
  statusText: { fontSize: 14, fontWeight: "500", color: "#333" },
});
