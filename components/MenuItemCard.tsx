import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MenuItem } from '../models/MenuItem';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>Rs. {item.price}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    width: 150,
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B7355',
  },
});

export default MenuItemCard;