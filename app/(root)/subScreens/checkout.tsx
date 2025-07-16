import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  const [selectedPayment, setSelectedPayment] = useState<string>('1'); // Store payment method ID
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
    setSelectedPayment('1'); // Default to first payment method
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Text style={styles.orderItemName}>{item.name}</Text>
              <Text style={styles.orderItemPrice}>
                Rs. {parseFloat(item.price).toFixed(2)} x {item.quantity}
              </Text>
              <Text style={styles.orderItemTotal}>
                Rs. {(parseFloat(item.price) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Address Title (e.g., Home)"
            value={addressTitle}
            onChangeText={setAddressTitle}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Full Address"
            value={addressDetails}
            onChangeText={setAddressDetails}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                styles.paymentOption,
                selectedPayment === payment.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(payment.id)}
            >

              <Text style={styles.paymentTitle}>{payment.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Summary</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Total Amount</Text>
            <Text style={styles.billValue}>Rs. {getTotalAmount()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={placeOrder}>
          <Text style={styles.checkoutButtonText}>
            Place Order • Rs. {getTotalAmount()}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 10,
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333333',
    marginBottom: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  paymentOptionSelected: {
    backgroundColor: '#A09080',
    borderColor: '#A09080',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 16,
    color: '#666666',
  },
  billValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  checkoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  checkoutButton: {
    backgroundColor: '#A09080',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CheckoutScreen;