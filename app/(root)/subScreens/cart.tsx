import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addToCart as addToCartAction } from '@/redux/slices/cartSlice';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { FlatList } from '@/components/ui/flat-list';
import { Image } from '@/components/ui/image';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  category: string;
  allergies?: string[];
  availability: boolean;
  modifiers?: any[];
}

interface CartItem {
  id: string;
  name: string;
  price: string;
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
          <Image
            source={require('../../../assets/icons/back.png')}
            alt="Back"
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
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
          Details
        </Text>
        <Box style={{ width: 40 }} />
      </Box>

      <Box
        style={{
          alignItems: 'center',
          paddingVertical: 20,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box
          style={{
            width: 350,
            minHeight: 350,
            aspectRatio: 1 / 1,
            borderRadius: 12,
            backgroundColor: product.image && !imageError ? '#F8F8F8' : '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: product.image && !imageError ? product.image : PLACEHOLDER_IMAGE }}
            alt={product.name}
            style={{ flex: 1, width: '100%', height: '100%', borderRadius: 12 }}
            resizeMode="cover"
            onError={(error) => {
              console.error(
                'Image Load Error for',
                product.name,
                ':',
                error.nativeEvent.error,
                'URL:',
                product.image || 'No URL provided'
              );
              setImageError(true);
            }}
          />
        </Box>
      </Box>

      <Box
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: '600', color: '#333333', marginBottom: 8 }}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#333333', marginBottom: 12 }}>
          Rs. {product.price}
        </Text>
        <Text style={{ fontSize: 16, color: '#666666', lineHeight: 24, marginBottom: 8 }}>
          {product.description}
        </Text>
        <Text style={{ fontSize: 14, color: '#999999', fontStyle: 'italic', marginBottom: 8 }}>
          Category: {product.category}
        </Text>
        {Array.isArray(product.allergies) && product.allergies.length > 0 && (
          <Text style={{ fontSize: 14, color: '#FF4500', marginBottom: 8 }}>
            Allergens: {product.allergies.join(', ')}
          </Text>
        )}
        {!product.availability && (
          <Text style={{ fontSize: 14, color: '#FF0000', fontWeight: '600', marginBottom: 8 }}>
            Currently Unavailable
          </Text>
        )}
        {Array.isArray(product.modifiers) && product.modifiers.length > 0 && (
          <Text style={{ fontSize: 14, color: '#666666', fontStyle: 'italic' }}>
            Customizations available (coming soon)
          </Text>
        )}
      </Box>

      <HStack
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 30,
          backgroundColor: product.availability ? '#55383882' : '#E0E0E0',
          marginHorizontal: 20,
          borderRadius: 25,
          paddingVertical: 8,
          paddingHorizontal: 10,
          opacity: product.availability ? 1 : 0.6,
        }}
      >
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: quantity === 1 ? '#F8F8F8' : '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
          onPress={decreaseQuantity}
          disabled={quantity === 1 || !product.availability}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: quantity === 1 || !product.availability ? '#CCCCCC' : '#333333',
            }}
          >
            -
          </Text>
        </Pressable>
        <Box style={{ minWidth: 60, alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333' }}>
            {quantity}
          </Text>
        </Box>
        <Pressable
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
          }}
          onPress={increaseQuantity}
          disabled={!product.availability}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: '600',
              color: product.availability ? '#333333' : '#CCCCCC',
            }}
          >
            +
          </Text>
        </Pressable>
      </HStack>

      <Box
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <Pressable
          style={{
            backgroundColor: product.availability ? '#A09080' : '#CCCCCC',
            height: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            opacity: product.availability ? 1 : 0.6,
          }}
          onPress={directAddToCart}
          disabled={!product.availability}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600' }}>
            Add to Cart
          </Text>
        </Pressable>
      </Box>
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;