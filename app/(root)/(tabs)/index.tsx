import React from 'react';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useMenu } from '@/providers/menuProvider';
import { RootState } from '@/redux/store';
import { setActiveCategory } from '@/redux/slices/menuSlice';
import { MenuItem, Category } from '@/models/MenuItem';
import { addToCart } from '@/redux/slices/cartSlice';

const MenuScreen = () => {
  const { loading, error, refreshMenu } = useMenu();
  const { items, categories, activeCategory } = useSelector((state: RootState) => state.menu);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const navigateToProductDetails = (item: MenuItem) => {
    router.push({
      pathname: '/subScreens/foodDetail',
      params: {
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price.replace('Rs. ', '') || '0',
        category: item.category || activeCategory || 'Unknown',
        allergies: JSON.stringify(item.allergies || []),
        availability: item.availability ? 'true' : 'false',
        image: item.image || '../../../assets/images/Food1.png',
      },
    });
  };

  const navigateToCart = () => {
    router.push('/subScreens/cart');
  };

  const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price.replace('Rs. ', '') || '0.00',
      quantity: 1,
      image: item.image || '../../../assets/images/Food1.png',
    }));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderMenuItem = (item: MenuItem) => (
    <Box
      key={item.id}
      style={{
        backgroundColor: item.availability ? '#F8F8F8' : '#E0E0E0',
        borderRadius: 12,
        marginBottom: 15,
        padding: 15,
        opacity: item.availability ? 1 : 0.6,
      }}
    >
      <Pressable
        onPress={() => item.availability && navigateToProductDetails(item)}
        disabled={!item.availability}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <VStack style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 5 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#666666', marginBottom: 8, lineHeight: 16 }}>
            {item.description}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333333' }}>
            {item.price}
          </Text>
          {item.allergies && item.allergies.length > 0 && (
            <Text style={{ fontSize: 12, color: '#FF4500', marginTop: 4 }}>
              Allergens: {item.allergies.join(', ')}
            </Text>
          )}
          {!item.availability && (
            <Text style={{ fontSize: 12, color: '#FF0000', marginTop: 4 }}>
              Currently Unavailable
            </Text>
          )}
        </VStack>
        {item.image && (
          <Image
            source={{ uri: item.image }}
            style={{ width: 80, height: 80, borderRadius: 8 }}
            alt={item.name}
            resizeMode="contain"
          />
        )}
      </Pressable>
    </Box>
  );

  const filteredItems = items.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        }}
      >
        <HStack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333' }}>
            YumHub
          </Text>
          <Pressable
            onPress={navigateToCart}
            style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
          >
            <Image
              source={require('../../../assets/icons/shopping-cart.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
              alt="Cart"
            />
            {getTotalItems() > 0 && (
              <Box
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: '#A09080',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                  {getTotalItems()}
                </Text>
              </Box>
            )}
          </Pressable>
        </HStack>
      </Box>

      <Box
        style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15, alignItems: 'center' }}
        >
          {loading ? (
            <Text style={{ textAlign: 'center', color: '#666666' }}>
              Loading...
            </Text>
          ) : error ? (
            <VStack style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FF0000', textAlign: 'center' }}>
                Error: {error}
              </Text>
              <Pressable
                style={{
                  padding: 10,
                  backgroundColor: '#A1CEDC',
                  borderRadius: 8,
                  marginTop: 10,
                }}
                onPress={refreshMenu}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                  Try Again
                </Text>
              </Pressable>
            </VStack>
          ) : categories.length > 0 ? (
            categories.map((category: Category) => (
              <Pressable
                key={category.id}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  marginHorizontal: 6,
                  borderRadius: 25,
                  backgroundColor: activeCategory === category.name ? '#A09080' : '#F8F8F8',
                  minWidth: 80,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => dispatch(setActiveCategory(category.name))}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: activeCategory === category.name ? '#FFFFFF' : '#666666',
                    fontWeight: '500',
                  }}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))
          ) : (
            <Text style={{ textAlign: 'center', paddingHorizontal: 15, color: '#666666' }}>
              No categories available
            </Text>
          )}
          {!loading && !error && categories.length === 1 && categories[0].name === 'Sri Lankan' && (
            <Text style={{ textAlign: 'center', color: '#FFA500', fontStyle: 'italic', marginTop: 10 }}>
              Using mock data due to failed API request. Please check server configuration.
            </Text>
          )}
        </ScrollView>
      </Box>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {loading ? (
          <Text style={{ textAlign: 'center', color: '#666666' }}>
            Loading menu...
          </Text>
        ) : error ? (
          <Text style={{ textAlign: 'center', color: '#FF0000' }}>
            Error loading menu: {error}
          </Text>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(renderMenuItem)
        ) : (
          <Text style={{ textAlign: 'center', color: '#666666' }}>
            No items available for {activeCategory || ''}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MenuScreen;