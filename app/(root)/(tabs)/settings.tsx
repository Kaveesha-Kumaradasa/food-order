import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: 20,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <Text style={{ color: '#000000', fontSize: 20, fontWeight: '500' }}>
          Settings
        </Text>
      </Box>

      <Box
        style={{
          flex: 1,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {user && (
          <Text style={{ fontSize: 16, color: '#333333', marginBottom: 20 }}>
            Logout
          </Text>
        )}
        <Pressable
          style={{
            backgroundColor: isLoggingIn ? '#CCCCCC' : '#A09080',
            paddingVertical: 12,
            paddingHorizontal: 30,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleLogout}
          disabled={isLoggingIn}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
            {isLoggingIn ? 'Logging out...' : 'Logout'}
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
};

export default SettingsScreen;