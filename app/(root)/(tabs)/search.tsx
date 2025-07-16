import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchMenuData } from '@/redux/actions/menuActions';
import { MenuItem } from '@/models/MenuItem';
//import { addToCart } from '@/redux/slices/cartSlice';

/*interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  category: string;
  allergies?: string[];
  availability: boolean;
}*/

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.menu);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Placeholder image URL
  const PLACEHOLDER_IMAGE = '../../../assets/images/Food1.png';

  // Fetch menu data on mount if not already loaded
  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchMenuData());
    }
  }, [dispatch, items.length]);

  // Search functionality with debouncing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // Filter menu items by name only
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(filtered);
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout); // Cleanup timeout
  }, [searchQuery, items]);

  const navigateToProductDetails = (item: MenuItem) => {
    console.log('Navigating to ProductDetails with item:', {
      id: item.id,
      name: item.name,
      image: item.image || 'No image provided',
      price: item.price || 'No price provided',
    });
    router.push({
      pathname: "/subScreens/foodDetail",
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

  /*const handleAddToCart = (item: MenuItem) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price.replace('Rs. ', '') || '0.00',
      quantity: 1,
      image: item.image || PLACEHOLDER_IMAGE,
    }));
  };*/

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={[styles.menuItem, !item.availability && styles.unavailableItem]}>
      <TouchableOpacity
        style={styles.menuItemContent}
        onPress={() => item.availability && navigateToProductDetails(item)}
        disabled={!item.availability}
      >
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>Rs. {item.price}</Text>
          {!item.availability && (
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          )}
        </View>
        <View style={styles.menuItemImageContainer}>
          <Image
            source={{ uri: item.image || PLACEHOLDER_IMAGE }}
            style={styles.menuItemImage}
            resizeMode="cover"
            onError={(error) => console.error('Search Item Image Error:', item.name, error.nativeEvent.error, item.image)}
          />
        </View>
      </TouchableOpacity>
      {/*{item.availability && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}*/}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {loading ? (
        <ActivityIndicator size="large" color="#A09080" />
      ) : error ? (
        <Text style={styles.emptyText}>Error loading menu: {error}</Text>
      ) : searchQuery.trim() === "" ? (
        <Text style={styles.emptyText}>Start typing to search for menu items...</Text>
      ) : (
        <Text style={styles.emptyText}>No items found for "{searchQuery}"</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Browse</Text>
          <TouchableOpacity style={styles.cartIcon} onPress={navigateToCart}>
            <Image source={require("../../../assets/icons/shopping-cart.png")} style={styles.cartIconImage} />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by item name"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Image
              source={require("../../../assets/icons/search-icon.png")}
              style={styles.searchIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.resultsList}
          />
        ) : (
          renderEmptyState()
        )}
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  cartIcon: {
    position: 'relative',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#A09080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0,
  },
  searchIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIconImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  resultsList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  menuItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
  },
  unavailableItem: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 15,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 16,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  unavailableText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  menuItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#A09080',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchScreen;