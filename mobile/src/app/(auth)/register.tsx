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
import { useAuthStore } from "../../store/authStore";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !passwordConfirm.trim()) {
      Alert.alert("Ошибка", "Заполните все поля");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Ошибка", "Пароль должен быть не менее 6 символов");
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), password);
    } catch (error: any) {
      Alert.alert("Ошибка", error?.message || "Не удалось зарегистрироваться");
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
            <Text style={styles.title}>Регистрация</Text>
            <Text style={styles.subtitle}>Создайте новый аккаунт</Text>
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
                placeholder="Минимум 6 символов"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Повторите пароль</Text>
              <TextInput
                style={styles.input}
                placeholder="Повторите пароль"
                placeholderTextColor="#aaa"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Зарегистрироваться</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.linkText}>
                Уже есть аккаунт? <Text style={styles.linkTextBold}>Войти</Text>
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
