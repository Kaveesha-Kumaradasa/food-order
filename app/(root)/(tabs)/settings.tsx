import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'expo-router';

const SettingsScreen = () => {
  const { logout, isLoggingIn, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      <View style={styles.content}>
        {user && <Text style={styles.userInfo}>Logout</Text>}
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingIn ? styles.logoutButtonDisabled : null]}
          onPress={handleLogout}
          disabled={isLoggingIn}
        >
          <Text style={styles.logoutButtonText}>
            {isLoggingIn ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: '#ffffffff',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  headerText: { 
    color: '#000000ff',
    fontSize: 20, 
    fontWeight: '500' 
  },
  content: { 
    flex: 1, 
    padding: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  userInfo: { 
    fontSize: 16, 
    color: '#333333', 
    marginBottom: 20 
  },
  logoutButton: {
    backgroundColor: '#A09080',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonDisabled: { 
    backgroundColor: '#CCCCCC' 
  },
  logoutButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '600' },
});

export default SettingsScreen;

/*import { router } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';

const Settings = () => {
  return (
    <View>
      <Text>Register Screen</Text>
            <Button
        title="Go to Welcome"
        onPress={() => router.push("/auth/welcome")}
      />
    </View>
  );
};

export default Settings;*/