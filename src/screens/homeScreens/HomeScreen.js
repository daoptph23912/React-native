
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function ScreenProduct() {
  const URL = `http://localhost:3000/api/products`;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  const handleOpenCart = () => {
    navigation.navigate('ScreenCart', { cartItems: cartItems });
  };

  const handleAddToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const handleRemoveFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem._id !== item._id));
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
          <Text style={styles.cartButtonText}>Delete</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
        <FontAwesome name="shopping-cart" size={24} color="black" />
        <Text style={styles.cartButtonText}>Add</Text>
      </TouchableOpacity>
    );
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleBackgroundPress = () => {
    Alert.alert('Thông báo', 'Bạn đã ấn ngoài background', [{ text: 'OK' }]);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handleItemPress(item)}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: `http://localhost:3000/${encodeURIComponent(item.image)}` }} resizeMode="contain" />
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
        <View style={styles.searchInputContainer}>
          <FontAwesome name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>
      <FlatList data={filteredProducts} keyExtractor={(item) => item._id} renderItem={renderItem} />
      <TouchableOpacity style={styles.cartButton} onPress={handleOpenCart}>
        <FontAwesome name="shopping-cart" size={24} color="black" />
        <Text style={styles.cartButtonText}>({cartItems.length})</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
      {selectedItem && (
        <Modal visible={isModalVisible} animationType="fade" transparent>
          <TouchableOpacity style={styles.modalBackground} onPress={handleBackgroundPress}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <ScrollView horizontal>
                <Image style={styles.modalImage} source={{ uri: `http://localhost:3000/${encodeURIComponent(selectedItem.image)}` }} resizeMode="contain" />
                {/* Add other images here */}
              </ScrollView>
              <Text style={styles.modalPrice}>{selectedItem.price} VNĐ</Text>
              <Text style={styles.modalQuantity}>kho hàng: {selectedItem.quantity}</Text>
              <Text style={styles.value}>Nội dung:{selectedItem.content}</Text>
              <TouchableOpacity style={styles.modalCloseButton} onPress={handleModalClose}>
                <FontAwesome name="times" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '',
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
    backgroundColor: 'white',
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
    color: 'black',
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalQuantity: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalCloseButton: {
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
});
