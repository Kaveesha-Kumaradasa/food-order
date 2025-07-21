import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button"
import { useRouter } from 'expo-router';

const Welcome = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.title}>YumHub</Text>

        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/Food1.png')}
            style={styles.foodImage}
          />
        </View>


        <Button size="md" variant="solid" action="primary" 
        onPress={() => router.push('/auth/login')}>
          <ButtonText style={{ color: 'white' }}>Login</ButtonText>
        </Button>

        {/* Login Button */}
        {/*<TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>*/}

        {/* Sign Up Link */}
        <TouchableOpacity
          onPress={() => router.push('/auth/signup')}
          style={styles.signUpContainer}
        >
          <Text style={styles.signUpText}>Don't have an account ?</Text>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 34,
  },
  imageContainer: {
    marginVertical: 60,
    alignItems: 'center',
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  /*Button: {
    bg: '#8B7355',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 40,
    minWidth: 200,
    alignItems: 'center',
  },
  ButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },*/
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  signUpLink: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
});

export default Welcome;