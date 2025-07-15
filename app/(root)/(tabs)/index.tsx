// src/screens/MenuScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { useMenu } from '@/providers/menuProvider';
import { RootState } from '@/redux/store';
import { setActiveCategory } from '@/redux/slices/menuSlice';
import { MenuItem, Category } from '@/models/MenuItem';

const MenuScreen = () => {
  const { loading, error, refreshMenu } = useMenu();
  const { items, categories, activeCategory } = useSelector((state: RootState) => state.menu);
  const dispatch = useDispatch();
  const router = useRouter();

const navigateToProductDetails = (item: MenuItem) => {
  console.log('Navigating to ProductDetails with item:', {
    id: item.id,
    name: item.name,
    image: item.image || 'No image provided',
  }); // Debug navigation
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
      image: item.image || '../../../assets/images/Food1.png', // Fallback image
    },
  });
};

  const navigateToCart = () => {
    // Placeholder: Fetch actual cart data from Redux or AsyncStorage if implemented
    router.push({
      pathname: '/subScreens/cart',
      params: {
        cartData: JSON.stringify([]), // Replace with actual cart data if available
        totalItems: '',
        totalAmount: '0',
      },
    });
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, !item.availability && styles.unavailableItem]}
      onPress={() => item.availability && navigateToProductDetails(item)}
      disabled={!item.availability}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>{item.price}</Text>
          {item.allergies && item.allergies.length > 0 && (
            <Text style={styles.menuItemAllergies}>Allergens: {item.allergies.join(', ')}</Text>
          )}
          {!item.availability && (
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          )}
        </View>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.menuItemImage} resizeMode="contain" />
        )}
      </View>
    </TouchableOpacity>
  );

  const filteredItems = items.filter((item) => item.category === activeCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>YumHub</Text>
          <TouchableOpacity style={[styles.cartIcon, { pointerEvents: 'auto' }]} onPress={navigateToCart}>
            <Image
              source={require('../../../assets/icons/shopping-cart.png')}
              style={styles.cartIconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
          {loading ? (
            <Text style={styles.loading}>Loading...</Text>
          ) : error ? (
            <>
              <Text style={styles.error}>Error: {error}</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={refreshMenu}>
                <Text style={styles.refreshText}>Try Again</Text>
              </TouchableOpacity>
            </>
          ) : categories.length > 0 ? (
            categories.map((category: Category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.tab, activeCategory === category.name && styles.activeTab]}
                onPress={() => dispatch(setActiveCategory(category.name))}
              >
                <Text style={[styles.tabText, activeCategory === category.name && styles.activeTabText]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noCategories}>No categories available</Text>
          )}
          {!loading && !error && categories.length === 1 && categories[0].name === 'Sri Lankan' && (
            <Text style={styles.warning}>
              Using mock data due to failed API request. Please check server configuration.
            </Text>
          )}
        </ScrollView>
      </View>

      <ScrollView style={styles.menuContainer}>
        {loading ? (
          <Text style={styles.loading}>Loading menu...</Text>
        ) : error ? (
          <Text style={styles.error}>Error loading menu: {error}</Text>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(renderMenuItem)
        ) : (
          <Text style={styles.noItems}>No items available for {activeCategory || ''}</Text>
        )}
      </ScrollView>
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
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconImage: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tabScrollContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 25,
    backgroundColor: '#F8F8F8',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#A09080',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
  menuItemAllergies: {
    fontSize: 12,
    color: '#FF4500',
    marginTop: 4,
  },
  unavailableText: {
    fontSize: 12,
    color: '#FF0000',
    marginTop: 4,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginLeft: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: '#FF0000',
  },
  refreshButton: {
    padding: 10,
    backgroundColor: '#A1CEDC',
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  refreshText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noItems: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666666',
  },
  noCategories: {
    textAlign: 'center',
    paddingHorizontal: 15,
    color: '#666666',
  },
  warning: {
    textAlign: 'center',
    marginTop: 20,
    color: '#FFA500',
    fontStyle: 'italic',
  },
});

export default MenuScreen;