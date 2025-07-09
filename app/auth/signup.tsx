import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

const RegisterScreen = () => {
  const [email, setEmail] = useState(`test+${new Date().getTime()}@example.com`);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [registerFailed, setRegisterFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { register, isLoggingIn } = useAuth();
  const reg = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleRegister = () => {
    let newErrors = { email: '', password: '', confirmPassword: '' };
    let isValid = true;
    setRegisterFailed(false);
    setErrorMessage('');

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!reg.test(email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      register(
        { email, password },
        (success: boolean, error?: string, errorMessage?: string) => {
          if (!success) {
            setRegisterFailed(true);
            setErrorMessage(errorMessage || 'Registration failed');
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
            source={require('../../assets/images/Food1.png')}
            style={{ width: 28, height: 28, resizeMode: 'contain' }}
            accessibilityLabel="logo"
          />
        </View>
        <Text style={styles.headerText}>Sign Up</Text>
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
            autoFocus // Ensure focus starts here
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm your password"
            placeholderTextColor="#999"
          />
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
        </View>

        {registerFailed && errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <TouchableOpacity
          style={[styles.registerButton, isLoggingIn ? styles.registerButtonDisabled : null]}
          onPress={handleRegister}
          disabled={isLoggingIn}
        >
          <Text style={styles.registerButtonText}>{isLoggingIn ? 'Signing up...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#A09080',
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
  },
  logoContainer: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: { color: '#FFFFFF', fontSize: 20, fontWeight: '500' },
  formContainer: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
  inputGroup: { marginBottom: 25 },
  label: { fontSize: 16, color: '#333333', marginBottom: 8, fontWeight: '400' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#FF0000' },
  errorText: { color: '#FF0000', fontSize: 12, marginTop: 5 },
  registerButton: {
    backgroundColor: '#A09080',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  registerButtonDisabled: { backgroundColor: '#CCCCCC' },
  registerButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#666', fontSize: 14 },
  loginLink: { color: '#A09080', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;