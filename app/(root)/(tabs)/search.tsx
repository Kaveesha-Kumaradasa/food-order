import React, { useState, useEffect } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { FlatList } from '@/components/ui/flat-list';
import { Image } from '@/components/ui/image';
import { Spinner } from '@/components/ui/spinner';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchMenuData } from '@/redux/actions/menuActions';
import { MenuItem } from '@/models/MenuItem';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.menu);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Placeholder image URL
  const PLACEHOLDER_IMAGE = '../../../assets/images/Food1.png';

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchMenuData());
    }
  }, [dispatch, items.length]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout); // Cleanup timeout
  }, [searchQuery, items]);

  const navigateToProductDetails = (item: MenuItem) => {
    router.push({
      pathname: '/subScreens/foodDetail',
      params: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        allergies: JSON.stringify(item.allergies || []),
        availability: item.availability ? 'true' : 'false',
        image: item.image || PLACEHOLDER_IMAGE,
      },
    });
  };

  const navigateToCart = () => {
    router.push('/subScreens/cart');
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <Box
      style={{
        backgroundColor: item.availability ? '#F8F8F8' : '#E0E0E0',
        borderRadius: 12,
        marginBottom: 15,
        padding: 15,
        opacity: item.availability ? 1 : 0.6,
      }}
    >
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => item.availability && navigateToProductDetails(item)}
        disabled={!item.availability}
      >
        <VStack style={{ flex: 1, paddingRight: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333333', marginBottom: 5 }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#666666', marginBottom: 8, lineHeight: 16 }}>
            {item.description}
          </Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333333' }}>
            Rs. {item.price}
          </Text>
          {!item.availability && (
            <Text style={{ fontSize: 12, color: '#FF0000', marginTop: 4 }}>
              Currently Unavailable
            </Text>
          )}
        </VStack>
        <Box
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            overflow: 'hidden',
          }}
        >
          <Image
            source={{ uri: item.image || PLACEHOLDER_IMAGE }}
            style={{ width: '100%', height: '100%', borderRadius: 12 }}
            resizeMode="cover"
            alt={item.name}
            onError={(error) =>
              console.error('Search Item Image Error:', item.name, error.nativeEvent.error, item.image)
            }
          />
        </Box>
      </Pressable>
    </Box>
  );

  const renderEmptyState = () => (
    <Box
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
      }}
    >
      {loading ? (
        <Spinner size="large" color="#A09080" />
      ) : error ? (
        <Text style={{ fontSize: 16, color: '#999999', textAlign: 'center', lineHeight: 24 }}>
          Error loading menu: {error}
        </Text>
      ) : searchQuery.trim() === '' ? (
        <Text style={{ fontSize: 16, color: '#999999', textAlign: 'center', lineHeight: 24 }}>
          Start typing to search for menu items...
        </Text>
      ) : (
        <Text style={{ fontSize: 16, color: '#999999', textAlign: 'center', lineHeight: 24 }}>
          No items found for "{searchQuery}"
        </Text>
      )}
    </Box>
  );

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
        <HStack style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#333333' }}>
            Browse
          </Text>
          <Pressable
            style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
            onPress={navigateToCart}
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
          paddingHorizontal: 20,
          paddingVertical: 15,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F0F0F0',
        }}
      >
        <HStack
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F8F8F8',
            borderRadius: 25,
            paddingHorizontal: 15,
            height: 45,
          }}
        >
          <Input style={{ flex: 1, paddingVertical: 0 }}>
            <InputField
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by item name"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
              style={{ fontSize: 16, color: '#333333' }}
            />
          </Input>
          <Pressable style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../../assets/icons/search-icon.png')}
              style={{ width: 16, height: 16 }}
              resizeMode="contain"
              alt="Search"
            />
          </Pressable>
        </HStack>
      </Box>

      <Box style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
          />
        ) : (
          renderEmptyState()
        )}
      </Box>
    </SafeAreaView>
  );
};

export default SearchScreen;