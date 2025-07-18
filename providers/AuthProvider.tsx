import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { AppDispatch } from "@/redux/store";
import { loginUser, registerUser, logoutUser } from "@/redux/actions/authActions";

type User = {
  email: string;
};

interface AuthContextProps {
  user: User | null;
  tenantCode: string | null;
  login: (
    credentials: { email: string; password: string },
    callback: (success: boolean, error?: string, errorMessage?: string) => void
  ) => void;
  register: (
    credentials: { email: string; password: string },
    callback: (success: boolean, error?: string, errorMessage?: string) => void
  ) => void;
  logout: () => void;
  isLoggingIn: boolean;
  isAuthChecked: boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);  
  const [tenantCode, setTenantCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const loadTenantCode = async () => {
    try {
      const storedTenantCode = await AsyncStorage.getItem("x-tenant-code");
      if (storedTenantCode) {
        setTenantCode(storedTenantCode);
      }
    } catch (error) {
      console.error("Error loading tenant code from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        console.log("call tenant");
        await loadTenantCode();
        const storedUser = await AsyncStorage.getItem("user");
        console.log(storedUser, "storedUser");

        if (storedUser) {
          setIsLoggingIn(true);
          const userData = JSON.parse(storedUser);
          const updatedUserData: User = {
            email: userData.email || "", // Assuming email is available in stored user data
          };
          setUser(updatedUserData);
          setIsLoggingIn(false);
        }
        setIsAuthChecked(true);
      } catch (error) {
        console.error("Error checking user session:", error);
        setIsLoggingIn(false);
        setIsAuthChecked(true);
        setErrorMessage("Error checking session");
      }
    };

    checkUserSession();
  }, []);

  

  const login: AuthContextProps["login"] = (credentials, callback) => {
    console.log("Starting login process"); // Debug log
    setIsLoggingIn(true);
    setErrorMessage(null);
    dispatch(
      loginUser(credentials, (success: boolean, errorStatus: number, errorMessage: string) => {
        console.log("Login callback triggered, success:", success, "error:", errorMessage); // Debug log
        if (success) {
          AsyncStorage.getItem("user").then((storedUser) => {
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              const updatedUserData: User = {
                email: userData.email || "", 
              };
              loadTenantCode();
              setUser(updatedUserData);
              setIsLoggingIn(false);
              callback(true, undefined, undefined);
              router.push("/(root)/(tabs)"); 
            } else {
              setIsLoggingIn(false);
              callback(false, "FETCH_ERROR", "No user data stored after login");
              setErrorMessage("Login failed: No user data");
            }
          });
        } else {
          setIsLoggingIn(false);
          callback(false, errorStatus.toString(), errorMessage);
          setErrorMessage(errorMessage);
        }
      })
    );
  };

  const register: AuthContextProps["register"] = (credentials, callback) => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    dispatch(
      registerUser(credentials, (success: boolean, errorStatus: number, errorMessage: string) => {
        if (success) {
          AsyncStorage.getItem("user").then((storedUser) => {
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              const updatedUserData: User = {
                email: userData.email || "", // Extract email from stored user data
              };
              loadTenantCode();
              setUser(updatedUserData);
              setIsLoggingIn(false);
              callback(true, undefined, undefined);
              router.push("/auth/login"); // Navigate to login screen after registration
            } else {
              setIsLoggingIn(false);
              callback(false, "FETCH_ERROR", "No user data stored after registration");
              setErrorMessage("Registration failed: No user data");
            }
          });
        } else {
          setIsLoggingIn(false);
          callback(false, errorStatus.toString(), errorMessage);
          setErrorMessage(errorMessage);
        }
      })
    );
  };

  const logout = async () => {
    try {
      setIsLoggingIn(true);
      await dispatch(logoutUser(() => {
        setUser(null);
        setTenantCode(null);
        setErrorMessage(null);
        setIsLoggingIn(false);
        router.replace("/auth/welcome"); 
      }));
    } catch (error) {
      console.error("Error during logout:", error);
      setErrorMessage("Error during logout");
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tenantCode,
        login,
        register,
        logout,
        isLoggingIn,
        isAuthChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};