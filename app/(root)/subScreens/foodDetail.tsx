import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: any; // Use 'any' to accommodate require() paths
  category: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: any; // Use 'any' to accommodate require() paths
}

const ProductDetailsScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get product data from navigation params or use default
  const product: Product = {
    id: params.id as string || "1",
    name: params.name as string || "Burger",
    description: params.description as string || "Chicken patty with sausage",
    price: params.price ? parseInt(params.price as string) : 800,
    image: require("../../../assets/images/Food1.png"), // Use project image
    category: params.category as string || "Burgers"
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const navigateToCart = (updatedCart: CartItem[]) => {
    // Navigate to cart screen with cart data
    router.push({
      pathname: "/subScreens/cart",
      params: {
        cartData: JSON.stringify(updatedCart.map(item => ({
          ...item,
          image: "Food1.png" // Pass image identifier instead of require() path
        }))),
        totalItems: updatedCart.reduce((total, item) => total + item.quantity, 0).toString(),
        totalAmount: updatedCart.reduce((total, item) => total + (item.price * item.quantity), 0).toString()
      }
    });
  };

  const addToCart = () => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart: CartItem[];
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      };
      updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
    }

    // Show success message with updated navigation
    Alert.alert(
      "Added to Cart",
      `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart!`,
      [
        {
          text: "Continue Shopping",
          style: "cancel"
        },
        {
          text: "View Cart",
          onPress: () => {
            navigateToCart(updatedCart);
          }
        }
      ]
    );

    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const directAddToCart = () => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let updatedCart: CartItem[];
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      // Add new item to cart
      const newCartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image
      };
      updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
    }

    // Navigate directly to cart screen
    navigateToCart(updatedCart);
    
    // Reset quantity after adding to cart
    setQuantity(1);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Image source={require("../../../assets/icons/back.png")} style={styles.backButton}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <View style={styles.productImageWrapper}>
          <Image
            source={product.image}
            style={styles.productImage}
          />
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>Rs. {product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productCategory}>Category: {product.category}</Text>
      </View>

      {/* Quantity Controls */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
          onPress={decreaseQuantity}
          disabled={quantity === 1}
        >
          <Text style={[styles.quantityButtonText, quantity === 1 && styles.quantityButtonTextDisabled]}>
            -
          </Text>
        </TouchableOpacity>
        
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={increaseQuantity}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Add to Cart Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addToCartButton} onPress={directAddToCart}>
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* Debug: Show current cart (remove in production) */}
      {cart.length > 0 && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Cart Items: {cart.length}</Text>
          {cart.map((item, index) => (
            <Text key={index} style={styles.debugText}>
              {item.name} x{item.quantity} = Rs. {item.price * item.quantity}
            </Text>
          ))}
        </View>
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
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  productImageWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F8F8F8',
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
  productImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 8,
  },
  productCategory: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 8,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 100,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F8F8F8',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  quantityButtonTextDisabled: {
    color: '#CCCCCC',
  },
  quantityDisplay: {
    minWidth: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  addToCartButton: {
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
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  debugContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default ProductDetailsScreen;