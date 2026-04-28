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
 container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  keyboard: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
    justifyContent: "center",
  },

  header: {
    marginBottom: 44,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#888888",
    textAlign: "center",
    lineHeight: 21,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 26,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  form: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingLeft: 4,
  },

  input: {
    height: 54,
    backgroundColor: "#F9F9F9",
    borderRadius: 14,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },

  btn: {
    height: 56,
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16.5,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  linkBtn: {
    alignItems: "center",
    marginTop: 26,
  },
  linkText: {
    fontSize: 14.5,
    color: "#999999",
  },
  linkTextBold: {
    color: "#1A1A1A",
    fontWeight: "700",
  },
});
