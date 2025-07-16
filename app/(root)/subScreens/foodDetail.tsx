import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart as addToCartAction } from '@/redux/slices/cartSlice';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string; // String to match API and CartScreen
  image?: string;
  category: string;
  allergies?: string[];
  availability: boolean;
  modifiers?: any[];
}

interface CartItem {
  id: string;
  name: string;
  price: string; // String to match CartScreen
  quantity: number;
  image?: string;
}

const ProductDetailsScreen = () => {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const PLACEHOLDER_IMAGE = '../../../assets/images/Food1.png';

  const product: Product = {
    id: (params.id as string) || '1',
    name: (params.name as string) || 'Unknown Item',
    description: (params.description as string) || 'No description available',
    price: (params.price as string) || '0.00',
    image: (params.image as string) || undefined,
    category: (params.category as string) || 'Unknown',
    allergies: params.allergies ? JSON.parse(params.allergies as string) : [],
    availability: params.availability === 'true',
    modifiers: params.modifiers ? JSON.parse(params.modifiers as string) : [],
  };

  useEffect(() => {
    console.log('Product Details Params:', params);
    console.log('Product Image URL:', product.image || 'No image provided');
    if (!product.image) {
      console.warn('No image URL provided for product:', product.name);
      setImageError(true);
    }
  }, [product.image, product.name, params]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const navigateToCart = (updatedCart: CartItem[]) => {
    router.push({
      pathname: '/subScreens/cart',
      params: {
        cartData: JSON.stringify(updatedCart),
        totalItems: updatedCart.reduce((total, item) => total + item.quantity, 0).toString(),
        totalAmount: updatedCart
          .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
          .toFixed(2),
      },
    });
  };

  const addToCart = () => {
    if (!product.availability) {
      Alert.alert('Unavailable', 'This item is currently unavailable.');
      return;
    }

    const newCartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image || PLACEHOLDER_IMAGE,
    };

    dispatch(addToCartAction(newCartItem));

    Alert.alert(
      'Added to Cart',
      `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart!`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        {
          text: 'View Cart',
          onPress: () => navigateToCart([...cart, newCartItem]),
        },
      ]
    );

    setQuantity(1);
  };

  const directAddToCart = () => {
    if (!product.availability) {
      Alert.alert('Unavailable', 'This item is currently unavailable.');
      return;
    }

    const newCartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image || PLACEHOLDER_IMAGE,
    };

    dispatch(addToCartAction(newCartItem));
    navigateToCart([...cart, newCartItem]);
    setQuantity(1);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Image source={require('../../../assets/icons/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.imageContainer}>
        <View style={[styles.productImageWrapper, !product.image || imageError ? styles.placeholderWrapper : null]}>
          {product.image && !imageError ? (
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
              onError={(error) => {
                console.error('Image Load Error for', product.name, ':', error.nativeEvent.error, product.image);
                setImageError(true);
              }}
            />
          ) : (
            <Image
              source={{ uri: PLACEHOLDER_IMAGE }}
              style={styles.productImage}
              resizeMode="cover"
            />
          )}
        </View>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>Rs. {product.price}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <Text style={styles.productCategory}>Category: {product.category}</Text>
        {(Array.isArray(product.allergies) && product.allergies.length > 0) && (
          <Text style={styles.productAllergies}>Allergens: {product.allergies.join(', ')}</Text>
        )}
        {!product.availability && (
          <Text style={styles.unavailableText}>Currently Unavailable</Text>
        )}
        {Array.isArray(product.modifiers) && product.modifiers.length > 0 && (
          <Text style={styles.modifiersText}>Customizations available (coming soon)</Text>
        )}
      </View>

      <View style={[styles.quantityContainer, !product.availability && styles.disabledContainer]}>
        <TouchableOpacity
          style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
          onPress={decreaseQuantity}
          disabled={quantity === 1 || !product.availability}
        >
          <Text
            style={[styles.quantityButtonText, quantity === 1 && styles.quantityButtonTextDisabled]}
          >
            -
          </Text>
        </TouchableOpacity>
        <View style={styles.quantityDisplay}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        <TouchableOpacity
          style={[styles.quantityButton, !product.availability && styles.quantityButtonDisabled]}
          onPress={increaseQuantity}
          disabled={!product.availability}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.addToCartButton, !product.availability && styles.disabledButton]}
          onPress={directAddToCart}
          disabled={!product.availability}
        >
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
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
  backIcon: {
    width: 24,
    height: 24,
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
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  productImageWrapper: {
    width: '90%',
    aspectRatio: 3 / 2,
    borderRadius: 12,
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
  placeholderWrapper: {
    backgroundColor: '#E0E0E0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
    marginBottom: 8,
  },
  productAllergies: {
    fontSize: 14,
    color: '#FF4500',
    marginBottom: 8,
  },
  unavailableText: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: '600',
    marginBottom: 8,
  },
  modifiersText: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    backgroundColor: '#55383882',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 8,
  },
  disabledContainer: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
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
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProductDetailsScreen;