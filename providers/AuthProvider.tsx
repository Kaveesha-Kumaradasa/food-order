import React, { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AppDispatch } from '@/redux/store';
import { getCurrentUser, loginUser, registerUser, logoutUser } from '@/redux/actions/authActions';

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
      const storedTenantCode = await AsyncStorage.getItem('x-tenant-code');
      if (storedTenantCode) {
        setTenantCode(storedTenantCode);
      }
    } catch (error) {
      console.error('Error loading tenant code from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        await loadTenantCode();
        const storedUser = await AsyncStorage.getItem('user');

        if (storedUser) {
          setIsLoggingIn(true);
          dispatch(
            getCurrentUser((response: any, error?: string) => {
              if (response?.data) {
                const userInfo = response.data;
                const updatedUserData: User = {
                  email: userInfo.email || '',
                };
                setUser(updatedUserData);
                setIsLoggingIn(false);
                router.replace('/(root)/(tabs)');
              } else {
                console.error('Failed to fetch user:', error);
                setUser(null);
                setIsLoggingIn(false);
                setErrorMessage(error || 'Session check failed');
              }
            })
          );
        } else {
          setIsLoggingIn(false);
          setIsAuthChecked(true);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setIsLoggingIn(false);
        setIsAuthChecked(true);
        setErrorMessage('Error checking session');
      }
    };

    checkUserSession();
  }, [dispatch]);

  const login: AuthContextProps['login'] = (credentials, callback) => {
    console.log('Starting login process'); // Debug log
    setIsLoggingIn(true);
    setErrorMessage(null);
    dispatch(
      loginUser(credentials, (success: boolean, errorStatus: number, errorMessage: string) => {
        console.log('Login callback triggered, success:', success, 'error:', errorMessage); // Debug log
        if (success) {
          dispatch(
            getCurrentUser((response: any, error?: string) => {
              if (response?.data) {
                const userInfo = response.data;
                const updatedUserData: User = {
                  email: userInfo.email || '',
                };
                loadTenantCode();
                setUser(updatedUserData);
                setIsLoggingIn(false);
                callback(true, undefined, undefined);
                router.replace('/(root)/(tabs)');
              } else {
                setIsLoggingIn(false);
                callback(false, 'FETCH_ERROR', error || 'Failed to fetch user data');
                setErrorMessage(error || 'Login failed');
              }
            })
          );
        } else {
          setIsLoggingIn(false);
          callback(false, errorStatus.toString(), errorMessage);
          setErrorMessage(errorMessage);
        }
      })
    );
  };

  const register: AuthContextProps['register'] = (credentials, callback) => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    dispatch(
      registerUser(credentials, (success: boolean, errorStatus: number, errorMessage: string) => {
        if (success) {
          dispatch(
            getCurrentUser((response: any, error?: string) => {
              if (response?.data) {
                const userInfo = response.data;
                const updatedUserData: User = {
                  email: userInfo.email || '',
                };
                loadTenantCode();
                setUser(updatedUserData);
                setIsLoggingIn(false);
                callback(true, undefined, undefined);
                router.replace('/auth/login');
              } else {
                setIsLoggingIn(false);
                callback(false, 'FETCH_ERROR', error || 'Failed to fetch user data');
                setErrorMessage(error || 'Registration failed');
              }
            })
          );
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
        router.replace('/auth/login'); // Redirect to home after logout
      }));
    } catch (error) {
      console.error('Error during logout:', error);
      setErrorMessage('Error during logout');
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
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};