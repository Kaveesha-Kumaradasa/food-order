import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";

import { ImageSourcePropType } from "react-native";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: ImageSourcePropType; // Use correct type for image
}

const MenuScreen = () => {
  const [activeTab, setActiveTab] = useState("Burgers");
  const router = useRouter();

  // Sample menu items - you can replace images later
  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "Burger",
      description: "Big juicy beef burger with sausage",
      price: "Rs. 800",
      image: require("../../../assets/images/Food1.png"),
    },
    {
      id: "2",
      name: "Burger",
      description: "Big juicy beef burger with sausage",
      price: "Rs. 800",
      image: require("../../../assets/images/Food1.png"),
    },
    {
      id: "3",
      name: "Burger",
      description: "Big juicy beef burger with sausage",
      price: "Rs. 800",
      image: require("../../../assets/images/Food1.png"),
    },
  ];

  const tabs = ["Offers", "Burgers", "Pizza", "Fried Rice", "Noodles", "Sandwiches", "Desserts", "Beverages", "Salads", "Pasta", "Soups", "Snacks"];

  const navigateToProductDetails = (item: MenuItem) => {
    // Navigate to product details screen and pass the item data
    router.push({
      pathname: "/subScreens/foodDetail",
      params: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.replace("Rs. ", ""), // Remove "Rs. " prefix for numeric value
        imageId: "Food1.png", // Pass image identifier
        category: activeTab
      }
    });
  };

  const navigateToCart = () => {
    // Navigate to cart screen
    router.push({
      pathname: "/subScreens/cart",
      params: {
        cartData: JSON.stringify([]), // Empty cart as a fallback
        totalItems: "0",
        totalAmount: "0"
      }
    });
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.menuItem}
      onPress={() => navigateToProductDetails(item)}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemInfo}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>{item.price}</Text>
        </View>
        <View style={styles.menuItemImageContainer}>
          <Image source={item.image} style={styles.menuItemImage} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>YumHub</Text>
          <TouchableOpacity style={styles.cartIcon} onPress={navigateToCart}>
            <Image
              source={require("../../../assets/icons/shopping-cart.png")}
              style={styles.cartIconImage}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
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
    resizeMode: 'contain',
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
  menuItemImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
  },
  menuItemImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
});

export default MenuScreen;