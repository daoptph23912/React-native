
import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Image, Animated, Dimensions, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Grid, Col } from 'react-native-easy-grid';

export default function ScreenProduct() {
  const URL = `http://localhost:3000/api/products`;
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const categories = ['Điện thoại', 'Airpod', 'Dây sạc', 'Ốp lưng'];


  // const handleSelectCategory = (category) => {
  //   setSelectedCategory(category);
  //   const filteredProducts = products.filter((item) => item.category === category);
  //   setFilteredProducts(filteredProducts);
  // };
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsDropdownOpen(false);
    // Cập nhật danh sách sản phẩm theo danh mục đã chọn
    // implement code ở đây
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const images = [
    require('../../images/111_banner.jpg'),
    require('../../images/222_banner.jpg'),
    require('../../images/333_banner.png'),
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    callApiGetProducts();
  }, []);

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
          <Text style={styles.cartButtonText}></Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.cartButton} onPress={() => handleAddToCart(item)}>
        <FontAwesome name="shopping-cart" size={24} color="black" />
        <Text style={styles.cartButtonText}></Text>
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
    <TouchableOpacity style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: `http://localhost:3000/${encodeURIComponent(item.image)}` }} resizeMode="contain" />
        </View>
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.gia}>{item.price.toLocaleString()} VNĐ</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.soluong}>{item.quantity}</Text>
        </View>
        {renderCartButton(item)}
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image style={{ width: '100%', height: 200, marginTop: 1 }} source={images[currentImageIndex]} />

        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleSelectCategory(category)}
            >
              <Text style={styles.categoryButtonText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.header}>
          <View style={styles.searchInputContainer}>
            <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              onSubmitEditing={handleSearch}
            />
          </View>
        </View>
        <FlatList data={filteredProducts} keyExtractor={(item) => item._id} renderItem={renderItem} />
        <StatusBar style="auto" />
        {selectedItem && (
          <Modal visible={isModalVisible} animationType="fade" transparent>
            <View style={styles.modalBackground} >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <ScrollView horizontal>
                  <Image
                    style={styles.modalImage}
                    source={{ uri: `http://localhost:3000/${encodeURIComponent(selectedItem.image)}` }}
                    resizeMode="contain"
                  />
                  {/* Add other images here */}
                </ScrollView>
                {/* <Text style={styles.label1}>Giá: {selectedItem.price.toLocaleString()} VNĐ</Text> */}
                {/* <Text style={styles.label1}>Quantity: {selectedItem.quantity}</Text> */}
                <Text style={styles.label1}>Thông tin sản phẩm: </Text>
                <Text style={styles.label2}>{selectedItem.content}</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={handleModalClose}>
                  <FontAwesome name="times" size={20} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.cartButton1} onPress={handleOpenCart}>
        <FontAwesome name="shopping-cart" size={24} color="black" />
        <Text style={styles.cartButtonText1}>{cartItems.length}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
   
  },
  gia: {
    color: 'red',
    
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  categoryButton: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: 'gray',
  },
  categoryButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    height: 30,
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
  label1: {
    fontWeight: 'bold',
    marginRight: 10,
    marginTop: 10,
  },
  label2: {
    marginRight: 10,
    marginTop: 10,
    
  },
  value: {
    flex: 1,
  },
  cartButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    fontSize: 5,
    borderWidth:1,
    width:50
  },
  cartButtonAdded: {
    backgroundColor: 'gray',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    borderWidth:1,
    fontSize:5,
    width:50

  },
  cartButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  cartButtonText1: {
    color: 'white',
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
  modalCloseButton: {
    color: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cartButton1: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'grey',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownButton: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  dropdownButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    zIndex: 2,
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectedDropdownItem: {
    backgroundColor: 'gray',
  },
  dropdownItemText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
