import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  TextInput,
  Alert,
  Modal
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface DeliveryAddress {
  id: string;
  title: string;
  address: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'wallet';
  title: string;
  details: string;
  icon: string;
}

const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const params = useLocalSearchParams();

  // Sample data - in real app, this would come from API/state management
  const deliveryAddresses: DeliveryAddress[] = [
    {
      id: '1',
      title: 'Home',
      address: '123 Main Street, Negombo, Western Province',
      isDefault: true
    },
    {
      id: '2',
      title: 'Office',
      address: '456 Business Avenue, Colombo 03',
      isDefault: false
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'cash',
      title: 'Cash on Delivery',
      details: 'Pay when your order arrives',
      icon: '💵'
    },
    {
      id: '2',
      type: 'card',
      title: 'Credit/Debit Card',
      details: '**** **** **** 1234',
      icon: '💳'
    },
    {
      id: '3',
      type: 'wallet',
      title: 'Digital Wallet',
      details: 'FriMi, eZ Cash, etc.',
      icon: '📱'
    }
  ];

  useEffect(() => {
    // Get cart data from navigation params
    if (params.cartData) {
      try {
        const parsedCartData = JSON.parse(params.cartData as string);
        setCartItems(parsedCartData);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }

    // Set default selections
    setSelectedAddress(deliveryAddresses.find(addr => addr.isDefault) || deliveryAddresses[0]);
    setSelectedPayment(paymentMethods[0]);
  }, [params.cartData]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal > 1500 ? 0 : 150; // Free delivery over Rs. 1500
  };

  const getServiceFee = () => {
    return Math.round(getSubtotal() * 0.05); // 5% service fee
  };

  const getTotalAmount = () => {
    return getSubtotal() + getDeliveryFee() + getServiceFee() - promoDiscount;
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setPromoDiscount(Math.round(getSubtotal() * 0.1)); // 10% discount
      Alert.alert('Promo Applied!', '10% discount applied successfully');
    } else if (promoCode.toLowerCase() === 'freedel') {
      setPromoDiscount(getDeliveryFee());
      Alert.alert('Promo Applied!', 'Free delivery applied successfully');
    } else {
      Alert.alert('Invalid Code', 'Please enter a valid promo code');
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert('Missing Information', 'Please select delivery address and payment method');
      return;
    }

    setIsLoading(true);
    
    // Simulate order placement
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Order Placed Successfully!',
        `Your order has been placed and will be delivered to ${selectedAddress.title} in 25-30 minutes.`,
        [
          {
            text: 'Track Order',
            onPress: () => {
              // Navigate to order tracking
              router.push('./cart');
            }
          },
          {
            text: 'Back to Home',
            onPress: () => {
              router.push('/');
            }
          }
        ]
      );
    }, 2000);
  };

  const goBack = () => {
    router.back();
  };

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      {cartItems.map((item, index) => (
        <View key={index} style={styles.orderItem}>
          <Text style={styles.orderItemEmoji}>{item.image}</Text>
          <View style={styles.orderItemDetails}>
            <Text style={styles.orderItemName}>{item.name}</Text>
            <Text style={styles.orderItemPrice}>Rs. {item.price} x {item.quantity}</Text>
          </View>
          <Text style={styles.orderItemTotal}>Rs. {item.price * item.quantity}</Text>
        </View>
      ))}
    </View>
  );

  const renderDeliveryAddress = () => (
    <TouchableOpacity style={styles.section} onPress={() => setShowAddressModal(true)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text style={styles.changeText}>Change</Text>
      </View>
      {selectedAddress && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressTitle}>📍 {selectedAddress.title}</Text>
          <Text style={styles.addressText}>{selectedAddress.address}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderPaymentMethod = () => (
    <TouchableOpacity style={styles.section} onPress={() => setShowPaymentModal(true)}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <Text style={styles.changeText}>Change</Text>
      </View>
      {selectedPayment && (
        <View style={styles.paymentContainer}>
          <Text style={styles.paymentIcon}>{selectedPayment.icon}</Text>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>{selectedPayment.title}</Text>
            <Text style={styles.paymentSubtitle}>{selectedPayment.details}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDeliveryInstructions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Delivery Instructions (Optional)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Add delivery instructions..."
        value={deliveryInstructions}
        onChangeText={setDeliveryInstructions}
        multiline
        numberOfLines={3}
      />
    </View>
  );

  const renderPromoCode = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Promo Code</Text>
      <View style={styles.promoContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
        />
        <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBillSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bill Summary</Text>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Subtotal ({cartItems.length} items)</Text>
        <Text style={styles.billValue}>Rs. {getSubtotal()}</Text>
      </View>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Delivery Fee</Text>
        <Text style={styles.billValue}>
          {getDeliveryFee() === 0 ? 'FREE' : `Rs. ${getDeliveryFee()}`}
        </Text>
      </View>
      <View style={styles.billRow}>
        <Text style={styles.billLabel}>Service Fee</Text>
        <Text style={styles.billValue}>Rs. {getServiceFee()}</Text>
      </View>
      {promoDiscount > 0 && (
        <View style={styles.billRow}>
          <Text style={[styles.billLabel, { color: '#4CAF50' }]}>Promo Discount</Text>
          <Text style={[styles.billValue, { color: '#4CAF50' }]}>-Rs. {promoDiscount}</Text>
        </View>
      )}
      <View style={styles.billDivider} />
      <View style={styles.billRow}>
        <Text style={styles.billTotal}>Total Amount</Text>
        <Text style={styles.billTotal}>Rs. {getTotalAmount()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderOrderSummary()}
        {renderDeliveryAddress()}
        {renderPaymentMethod()}
        {renderDeliveryInstructions()}
        {renderPromoCode()}
        {renderBillSummary()}
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, isLoading && styles.placeOrderButtonDisabled]} 
          onPress={placeOrder}
          disabled={isLoading}
        >
          <Text style={styles.placeOrderButtonText}>
            {isLoading ? 'Placing Order...' : `Place Order • Rs. ${getTotalAmount()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            {deliveryAddresses.map((address) => (
              <TouchableOpacity
                key={address.id}
                style={[
                  styles.modalOption,
                  selectedAddress?.id === address.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedAddress(address);
                  setShowAddressModal(false);
                }}
              >
                <Text style={styles.modalOptionTitle}>{address.title}</Text>
                <Text style={styles.modalOptionText}>{address.address}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowAddressModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Method Selection Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            {paymentMethods.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={[
                  styles.modalOption,
                  selectedPayment?.id === payment.id && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setSelectedPayment(payment);
                  setShowPaymentModal(false);
                }}
              >
                <Text style={styles.modalOptionEmoji}>{payment.icon}</Text>
                <View style={styles.modalOptionDetails}>
                  <Text style={styles.modalOptionTitle}>{payment.title}</Text>
                  <Text style={styles.modalOptionText}>{payment.details}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: '400',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginRight: 40,
  },
  headerSpacer: {
    width: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeText: {
    fontSize: 14,
    color: '#A09080',
    fontWeight: '500',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  orderItemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  addressContainer: {
    paddingVertical: 8,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    textAlignVertical: 'top',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    marginRight: 12,
  },
  applyButton: {
    backgroundColor: '#A09080',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
    color: '#333333',
    fontWeight: '500',
  },
  billDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  billTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  placeOrderButton: {
    backgroundColor: '#A09080',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  placeOrderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F8F8',
  },
  modalOptionSelected: {
    backgroundColor: '#A09080',
  },
  modalOptionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modalOptionDetails: {
    flex: 1,
  },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  modalOptionText: {
    fontSize: 14,
    color: '#666666',
  },
  modalCloseButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  modalCloseButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
});

export default CheckoutScreen;