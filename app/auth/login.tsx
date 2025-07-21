import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";


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
            router.replace("/(root)/(tabs)");
          } else {
            setLoginFailed(true);
            setErrorMessage(errorMessage || "Login failed");
          }
        }
      );
    }
  };

  return (
      <Box className="flex-1 bg-white">
        {/* Header */}
        <Box
          className="bg-[#A09080] pt-5 pb-10 rounded-b-3xl items-center justify-center min-h-[140px]"
        >
          <Box
            className="w-12 h-12 rounded-full bg-white justify-center items-center mb-2"
          >
            <Image
              source={require("../../assets/images/Food1.png")}
              size="xs"
              className="w-7 h-7"
              resizeMode="contain"
              alt="logo"
            />
          </Box>
          <Text className="text-white text-xl font-medium">Login</Text>
        </Box>

        {/* Form */}
        <VStack className="flex-1 px-8 pt-10 space-y-6">
          {/* Email Input */}
          <VStack className="space-y-1">
            <Text className="text-base text-gray-900 font-normal">Email</Text>
            <Input
              className={`h-12 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg`}
            >
              <InputField
                className="px-4 text-base text-gray-900 placeholder:text-gray-500"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                autoFocus
              />
            </Input>
            {errors.email ? (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            ) : null}
          </VStack>

          {/* Password Input */}
          <VStack className="space-y-1">
            <Text className="text-base text-gray-900 font-normal">Password</Text>
            <Input
              className={`h-12 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-lg`}
            >
              <InputField
                className="px-4 text-base text-gray-900 placeholder:text-gray-500"
                value={password}
                onChangeText={setPassword}
                type="password"
                placeholder="Enter your password"
              />
            </Input>
            {errors.password ? (
              <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
            ) : null}
          </VStack>

          {loginFailed && errorMessage && (
            <Text className="text-red-500 text-sm mt-2">{errorMessage}</Text>
          )}

          {/* Login Button */}
          <Button
            className={`h-12 ${isLoggingIn ? "bg-gray-300" : "bg-[#A09080]"} rounded-lg justify-center items-center mt-4`}
            isDisabled={isLoggingIn}
            onPress={handleLogin}
          >
            <ButtonText className="text-white text-lg font-semibold">
              {isLoggingIn ? "Logging in..." : "Login"}
            </ButtonText>
          </Button>

          {/* Sign Up Link */}
          <HStack className="justify-center items-center mt-4">
            <Text className="text-gray-500 text-sm">
              Don't have an account?{" "}
            </Text>
            <Button
              variant="link"
              onPress={() => router.push("/auth/signup")}
              className="p-0"
            >
              <ButtonText className="text-[#A09080] text-sm font-semibold">
                Sign Up
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
  );
};

export default LoginScreen;