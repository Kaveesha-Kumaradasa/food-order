/*import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleLogin = () => {
    let newErrors = { email: "", password: "" };
    let isValid = true;
    setLoginFailed(false);
    setErrorMessage("");

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!reg.test(email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      login(
        { email, password },
        (success: boolean, error?: string, errorMessage?: string) => {
          if (success) {
            setLoginFailed(false);
            setErrorMessage("");
            router.replace("/(root)/(tabs)"); // Navigate to home tab on success
          } else {
            setLoginFailed(true);
            setErrorMessage(errorMessage || "Login failed");
          }
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/Food1.png")} // Adjust path as needed
            style={{ width: 28, height: 28, resizeMode: "contain" }}
            accessibilityLabel="logo"
          />
        </View>
        <Text style={styles.headerText}>Login</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter your email"
            placeholderTextColor="#999"
            autoFocus
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password ? styles.inputError : null]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#999"
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {loginFailed && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.loginButton, isLoggingIn ? styles.loginButtonDisabled : null]}
          onPress={handleLogin}
          disabled={isLoggingIn}
        >
          <Text style={styles.loginButtonText}>{isLoggingIn ? "Logging in..." : "Login"}</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    backgroundColor: "#A09080",
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
  },
  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: { color: "#FFFFFF", fontSize: 20, fontWeight: "500" },
  formContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, color: "#333333", marginBottom: 8, fontWeight: "400" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  inputError: { borderColor: "#FF0000" },
  errorText: { color: "#FF0000", fontSize: 12, marginTop: 5 },
  loginButton: {
    backgroundColor: "#A09080",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  loginButtonDisabled: { backgroundColor: "#CCCCCC" },
  loginButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "600" },
  signUpContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  signUpText: { color: "#666", fontSize: 14 },
  signUpLink: { color: "#A09080", fontSize: 14, fontWeight: "600" },
});

export default LoginScreen;*/

import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Login Screen</Text>
      <Button
        title="Go to register"
        onPress={() => router.push("/auth/signup")}
      />
      <Button
        title="Go to home"
        onPress={() => router.push("/(root)/(tabs)")}
      />
    </View>
  );
}