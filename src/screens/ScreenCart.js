import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';

export default function ScreenCart({ route }) {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);
  const [quantity, setQuantity] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    updateTotalPrice();
  }, [cartItems, quantity]);

  const updateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      const itemQuantity = quantity[item._id] || 1;
      total += item.price * itemQuantity;
    });
    setTotalPrice(total);
  };

  const handleDeleteItem = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleBuyItems = () => {
    // Thực hiện hành động mua hàng
    console.log("Mua hàng");
  };

  const handleQuantityChange = (itemId, value) => {
    const item = cartItems.find((item) => item._id === itemId);
    const maxQuantity = item ? item.quantity : 0;

    if (value > maxQuantity) {
      value = maxQuantity; // Giới hạn giá trị nhập vào là số lượng hiện có
    }

    if (value === 0) {
      setQuantity((prevQuantity) => {
        const updatedQuantity = { ...prevQuantity };
        delete updatedQuantity[itemId]; // Xóa khóa itemId nếu giá trị là 0
        return updatedQuantity;
      });
    } else {
      setQuantity((prevQuantity) => ({ ...prevQuantity, [itemId]: value }));
    }
  };

  const renderItem = ({ item }) => {
    const itemQuantity = quantity[item._id] || 0;


    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.itemImage}
            source={{ uri: `http://localhost:3000/${encodeURIComponent(item.image)}` }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.itemInfoContainer}>
          <Text style={styles.itemText}>Name: {item.name}</Text>
          <Text style={styles.itemText}>Price: {item.price} VNĐ</Text>
          <TextInput
            style={styles.quantityInput}
            value={itemQuantity.toString()}
            onChangeText={(value) => handleQuantityChange(item._id, parseInt(value))}
            keyboardType="numeric"
          />

        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <FlatList data={cartItems} keyExtractor={(item) => item._id} renderItem={renderItem} />
          <Text style={styles.totalPriceText}>Tổng số tiền: {totalPrice} VNĐ</Text>
          <TouchableOpacity style={styles.button} onPress={handleBuyItems}>
            <Text style={styles.buttonText}>Mua</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  itemInfoContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
  deleteText: {
    color: 'red',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});
