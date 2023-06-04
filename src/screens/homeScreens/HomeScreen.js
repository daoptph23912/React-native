
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function ScreenProduct() {
  const URL = `http://localhost:3000/api/products`;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    callApiGetProducts();
  }, []);

  const callApiGetProducts = async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setProducts(data.data);
      setFilteredProducts(data.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const navigation = useNavigation();

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { item });
  };

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem._id !== item._id));
  };

  const handleOpenCart = () => {
    navigation.navigate('ScreenCart', { cartItems });
  };

  const handleSearch = () => {
    const filteredProducts = products.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const renderCartButton = (item) => {
    const isAddedToCart = cartItems.some((cartItem) => cartItem._id === item._id);

    if (isAddedToCart) {
      return (
        <TouchableOpacity style={styles.cartButtonAdded} onPress={() => handleRemoveFromCart(item)}>
          <FontAwesome name="shopping-cart" size={24} color="white" />
          <Text style={styles.cartButtonText}>Hủy</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <Text style={styles.cartButtonText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleProductPress(item)}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: `http://localhost:3000/${encodeURIComponent(item.image)}` }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{item.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{item.price} VNĐ</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{item.quantity}</Text>
        </View>
        {renderCartButton(item)}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên"
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          onSubmitEditing={handleSearch}
        />
      </View>
      <FlatList data={filteredProducts} keyExtractor={(item) => item._id} renderItem={renderItem} />
      <TouchableOpacity style={styles.cartButton} onPress={handleOpenCart}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
        <Text style={styles.cartButtonText}>Giỏ hàng ({cartItems.length})</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  searchInput: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 200,
    height: 200,
  },
  contentContainer: {
    flex: 1,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  cartButton: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cartButtonAdded: {
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cartButtonText: {
    color: 'white',
    marginLeft: 5,
  },
});
