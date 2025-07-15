import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Alert, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // Use 'any' to accommodate require() paths
}

const CartScreen = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Map image identifiers to require() paths
  const imageMap: { [key: string]: any } = {
    "Food1.png": require("../../../assets/images/Food1.png"),
    
  };

  useEffect(() => {
    // Get cart data from navigation params
    if (params.cartData) {
      try {
        const parsedCartData = JSON.parse(params.cartData as string);
        // Map image identifiers to require() paths
        const updatedCartData = parsedCartData.map((item: CartItem) => ({
          ...item,
          image: imageMap[item.image as string] || require("../../../assets/images/Food1.png")
        }));
        setCartItems(updatedCartData);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, [params.cartData]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            setCartItems(prev => prev.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const goBack = () => {
    // Option 1: Try to go back in navigation stack
    if (router.canGoBack()) {
      router.back();
    } else {
      // Option 2: Navigate to specific route
      // If you have an item ID from params, you can navigate back to that item
      if (params.itemId) {
        router.push(`./foodDetails/${params.itemId}`);
      } else {
        // Option 3: Navigate to home/main screen
        router.push('/');
      }
    }
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart before proceeding to checkout.");
      return;
    }
    
    // Navigate to checkout screen with cart data
    router.push({
      pathname: './checkout',
      params: {
        cartData: JSON.stringify(cartItems.map(item => ({
          ...item,
          image: "Food1.png" // Pass image identifier
        })))
      }
    });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.itemImageContainer}>
        <Image
          source={item.image}
          style={styles.itemImage}
        />
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs. {item.price}</Text>
      </View>
      
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.itemTotal}>
        <Text style={styles.itemTotalText}>Rs. {item.price * item.quantity}</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeItem(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Image source={require("../../../assets/icons/back.png")} style={styles.backButton}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.continueShoppingButton} onPress={goBack}>
            <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          
          {/* Cart Summary */}
          <View style={styles.cartSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items:</Text>
              <Text style={styles.summaryValue}>{getTotalItems()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryValue}>Rs. {getTotalAmount()}</Text>
            </View>
          </View>
          
          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity style={styles.checkoutButton} onPress={proceedToCheckout}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    fontSize: 20,
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
  cartList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  itemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginHorizontal: 15,
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#A09080',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueShoppingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cartSummary: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666666',
  },
  summaryValue: {
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CartScreen;