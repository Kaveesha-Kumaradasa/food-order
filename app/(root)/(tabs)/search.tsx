import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image } from "react-native";
import { useRouter } from "expo-router";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: any; 
  category: string;
}

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();


  const allMenuItems: MenuItem[] = [
    {
      id: "1",
      name: "Burger",
      description: "Big juicy beef burger with sausage",
      price: "Rs. 800",
      image: require("../../../assets/images/Food1.png"), 
      category: "Burgers"
    },
    {
      id: "2",
      name: "Cheese Burger",
      description: "Delicious cheese burger with beef patty",
      price: "Rs. 900",
      image: require("../../../assets/images/Food1.png"), 
      category: "Burgers"
    },
    {
      id: "3",
      name: "Chicken Burger",
      description: "Grilled chicken burger with fresh lettuce",
      price: "Rs. 750",
      image: require("../../../assets/images/Food1.png"), 
      category: "Burgers"
    },
    {
      id: "4",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato sauce and mozzarella",
      price: "Rs. 1200",
      image: require("../../../assets/images/Food1.png"), 
      category: "Pizza"
    },
    {
      id: "5",
      name: "Pepperoni Pizza",
      description: "Pizza topped with pepperoni and cheese",
      price: "Rs. 1400",
      image: require("../../../assets/images/Food1.png"), 
      category: "Pizza"
    },
  ];

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Filter menu items based on search query
    const filtered = allMenuItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filtered);
  }, [searchQuery]);

  const navigateToProductDetails = (item: MenuItem) => {
    // Navigate to product details screen and pass the item data
    router.push({
      pathname: "/subScreens/foodDetail",
      params: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price.replace("Rs. ", ""), // Remove "Rs. " prefix for numeric value
        // image: item.image, // Commented out as require() paths can't be serialized
        category: item.category
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

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity 
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
          <Image
            source={item.image}
            style={styles.menuItemImage}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {searchQuery.trim() === "" ? (
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
            <Image source={require("../../../assets/icons/shopping-cart.png")} style={styles.cartIconImage}/>
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
            placeholder="Search"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchIcon}>
            <Image
              source={require("../../../assets/icons/search-icon.png")} // Adjust path as needed
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
    cartIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIconImage: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
    resizeMode: 'contain', // Ensure the image scales properly
  },
});

export default SearchScreen;