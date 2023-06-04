
// import react from "react";
// import { StyleSheet, SafeAreaView, View, Text } from "react-native";
// export default function EntertaimentScreen() {
//     return (
//         <SafeAreaView>
//             <Text>Chat</Text>
//         </SafeAreaView>
//     )
// }
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const EntertaimentScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    const newMessage = {
      id: messages.length.toString(),
      text: message,
      isSent: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.isSent ? styles.sentMessage : styles.receivedMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        style={styles.messagesList}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    maxWidth: '70%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2979FF',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  sendButton: {
    marginLeft: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2979FF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EntertaimentScreen;
