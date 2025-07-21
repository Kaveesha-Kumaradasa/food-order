import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";

const RegisterScreen = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", confirmPassword: "" });
  const [registerFailed, setRegisterFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { register, isLoggingIn } = useAuth();
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleRegister = () => {
    let newErrors = { email: "", password: "", confirmPassword: "" };
    let isValid = true;
    setRegisterFailed(false);
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
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      register(
        { email, password },
        (success: boolean, error?: string, errorMessage?: string) => {
          if (success) {
            setRegisterFailed(false);
            setErrorMessage("");
            router.replace("/auth/login");
          } else {
            setRegisterFailed(true);
            setErrorMessage(errorMessage || "Registration failed");
          }
        }
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Box
        style={{
          backgroundColor: "#A09080",
          paddingTop: 20,
          paddingBottom: 40,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
        }}
      >
        <Box
          style={{
            width: 45,
            height: 45,
            borderRadius: 22,
            backgroundColor: "#FFFFFF",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("../../assets/images/Food1.png")}
            style={{ width: 28, height: 28, resizeMode: "contain" }}
            alt="logo"
          />
        </Box>
        <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "500" }}>
          Sign Up
        </Text>
      </Box>

      <VStack style={{ flex: 1, paddingHorizontal: 30, paddingTop: 40 }}>
        <Box style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 16, color: "#333333", marginBottom: 8, fontWeight: "400" }}>
            Email
          </Text>
          <Input
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: errors.email ? "#FF0000" : "#CCCCCC",
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
            }}
          >
            <InputField
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              style={{ paddingHorizontal: 15, fontSize: 16 }}
              autoFocus
            />
          </Input>
          {errors.email ? (
            <Text style={{ color: "#FF0000", fontSize: 12, marginTop: 5 }}>
              {errors.email}
            </Text>
          ) : null}
        </Box>

        <Box style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 16, color: "#333333", marginBottom: 8, fontWeight: "400" }}>
            Password
          </Text>
          <Input
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: errors.password ? "#FF0000" : "#CCCCCC",
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
            }}
          >
            <InputField
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter your password"
              style={{ paddingHorizontal: 15, fontSize: 16 }}
            />
          </Input>
          {errors.password ? (
            <Text style={{ color: "#FF0000", fontSize: 12, marginTop: 5 }}>
              {errors.password}
            </Text>
          ) : null}
        </Box>

        <Box style={{ marginBottom: 25 }}>
          <Text style={{ fontSize: 16, color: "#333333", marginBottom: 8, fontWeight: "400" }}>
            Confirm Password
          </Text>
          <Input
            style={{
              height: 50,
              borderWidth: 1,
              borderColor: errors.confirmPassword ? "#FF0000" : "#CCCCCC",
              borderRadius: 10,
              backgroundColor: "#FFFFFF",
            }}
          >
            <InputField
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Confirm your password"
              style={{ paddingHorizontal: 15, fontSize: 16 }}
            />
          </Input>
          {errors.confirmPassword ? (
            <Text style={{ color: "#FF0000", fontSize: 12, marginTop: 5 }}>
              {errors.confirmPassword}
            </Text>
          ) : null}
        </Box>

        {registerFailed && errorMessage && (
          <Text style={{ color: "#FF0000", fontSize: 12, marginTop: 5 }}>
            {errorMessage}
          </Text>
        )}

        <Button
          style={{
            backgroundColor: isLoggingIn ? "#CCCCCC" : "#A09080",
            height: 50,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 40,
            marginTop: 10,
          }}
          onPress={handleRegister}
          disabled={isLoggingIn}
        >
          <ButtonText style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
            {isLoggingIn ? "Signing up..." : "Sign Up"}
          </ButtonText>
        </Button>

        <HStack style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#666", fontSize: 14 }}>
            Already have an account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/auth/login")}>
            <Text style={{ color: "#A09080", fontSize: 14, fontWeight: "600" }}>
              Login
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </SafeAreaView>
  );
};

export default RegisterScreen;