import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface PaymentMethod {
  id: string;
  title: string;
}

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('1');
  const router = useRouter();
  const params = useLocalSearchParams();

  const paymentMethods: PaymentMethod[] = [
    { id: '1', title: 'Cash on Delivery' },
    { id: '2', title: 'Credit/Debit Card' },
  ];

  useEffect(() => {
    if (params.cartData) {
      try {
        const parsedCartData = JSON.parse(params.cartData as string);
        setCartItems(parsedCartData);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
    setSelectedPayment('1');
  }, [params.cartData]);

  const getTotalAmount = () => {
    return cartItems
      .reduce((total: number, item: CartItem) => {
        const price = parseFloat(item.price) || 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const placeOrder = () => {
    if (!addressTitle || !addressDetails || !selectedPayment) {
      Alert.alert('Error', 'Please fill in the delivery address and select a payment method');
      return;
    }
    Alert.alert('Success', 'Order placed successfully!', [
      { text: 'Back to Home', onPress: () => router.push('/(root)/(tabs)') },
    ]);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Box
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        }}
      >
        <Pressable
          style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
          onPress={goBack}
        >
          <Text style={{ fontSize: 24, color: '#333333' }}>←</Text>
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: '#333333',
            textAlign: 'center',
          }}
        >
          Checkout
        </Text>
        <Box style={{ width: 40 }} />
      </Box>

      <ScrollView style={{ flex: 1 }}>
        <Box
          style={{
            backgroundColor: '#F8F8F8',
            marginHorizontal: 20,
            marginVertical: 10,
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333', marginBottom: 10 }}>
            Order Summary
          </Text>
          {cartItems.map((item) => (
            <HStack
              key={item.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#333333', flex: 1 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#666666', marginHorizontal: 10 }}>
                Rs. {parseFloat(item.price).toFixed(2)} x {item.quantity}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
                Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </HStack>
          ))}
        </Box>

        <Box
          style={{
            backgroundColor: '#F8F8F8',
            marginHorizontal: 20,
            marginVertical: 10,
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333', marginBottom: 10 }}>
            Delivery Address
          </Text>
          <Input
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <InputField
              placeholder="Address Title (e.g., Home)"
              value={addressTitle}
              onChangeText={setAddressTitle}
              style={{ fontSize: 16, color: '#333333' }}
            />
          </Input>
          <Input
            style={{
              borderWidth: 1,
              borderColor: '#E0E0E0',
              borderRadius: 8,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <InputField
              placeholder="Full Address"
              value={addressDetails}
              onChangeText={setAddressDetails}
              style={{ fontSize: 16, color: '#333333' }}
            />
          </Input>
        </Box>

        <Box
          style={{
            backgroundColor: '#F8F8F8',
            marginHorizontal: 20,
            marginVertical: 10,
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333', marginBottom: 10 }}>
            Payment Method
          </Text>
          {paymentMethods.map((payment) => (
            <Pressable
              key={payment.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                borderRadius: 8,
                marginBottom: 8,
                backgroundColor: selectedPayment === payment.id ? '#A09080' : '#FFFFFF',
                borderWidth: 1,
                borderColor: selectedPayment === payment.id ? '#A09080' : '#E0E0E0',
              }}
              onPress={() => setSelectedPayment(payment.id)}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#333333' }}>
                {payment.title}
              </Text>
            </Pressable>
          ))}
        </Box>

        <Box
          style={{
            backgroundColor: '#F8F8F8',
            marginHorizontal: 20,
            marginVertical: 10,
            padding: 15,
            borderRadius: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333', marginBottom: 10 }}>
            Bill Summary
          </Text>
          <HStack
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 16, color: '#666666' }}>Total Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333' }}>
              Rs. {getTotalAmount()}
            </Text>
          </HStack>
        </Box>
      </ScrollView>

      <Box
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Pressable
          style={{
            backgroundColor: '#A09080',
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={placeOrder}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
            Place Order • Rs. {getTotalAmount()}
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
};

export default CheckoutScreen;