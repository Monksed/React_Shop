import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Ошибка", "Введите email и пароль");
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert("Ошибка", "Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Заголовок */}
          <View style={styles.header}>
            <Text style={styles.title}>Вход</Text>
            <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
          </View>

          {/* Форма */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="example@mail.ru"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Пароль</Text>
              <TextInput
                style={styles.input}
                placeholder="Введите пароль"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Войти</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => router.push("/(auth)/register" as any)}
            >
              <Text style={styles.linkText}>
                Нет аккаунта?{" "}
                <Text style={styles.linkTextBold}>Зарегистрироваться</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  keyboard: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  header: { marginBottom: 40 },
  title: { fontSize: 34, fontWeight: "800", color: "#000", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#888" },
  form: { gap: 16 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#333" },
  input: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#000",
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
  },
  btn: {
    height: 56,
    backgroundColor: "#000",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  linkBtn: { alignItems: "center", marginTop: 8 },
  linkText: { fontSize: 15, color: "#888" },
  linkTextBold: { color: "#000", fontWeight: "700" },
});
