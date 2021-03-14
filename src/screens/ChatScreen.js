import React, { useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard
} from "react-native";
import { auth } from "../util/SQLite";
import { Ionicons } from "@expo/vector-icons";
import MessageList from "../components/ChatScreen/MessageList";
import { v4 as uuidv4 } from "uuid";

const ChatScreen = ({ navigation, route }) => {
  const { userDetail } = route.params;

  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "manivannan.belfazt@gmail.com",
      message: "you are receiving this"
    },
    {
      sender: "dummy1@mail.com",
      message: "I send you"
    },
    {
      sender: "manivannan.belfazt@gmail.com",
      message: "you are receiving this"
    },
    {
      sender: "dummy1@mail.com",
      message: "I send you"
    },
    {
      sender: "manivannan.belfazt@gmail.com",
      message: "you are receiving this"
    },
    {
      sender: "dummy1@mail.com",
      message: "I send you"
    },
    {
      sender: "dummy1@mail.com",
      message: "I send you"
    },
    ,
    {
      sender: "manivannan.belfazt@gmail.com",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis"
    },
    {
      sender: "dummy1@mail.com",
      message: "I send you dngndlkn j dfjdb kjfdbk d"
    },
    {
      sender: "dummy1@mail.com",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis"
    },
    {
      sender: "manivannan.belfazt@gmail.com",
      message:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis"
    }
  ]);

  //To send the message
  const sendMessage = () => {
    Keyboard.dismiss();

    const newMessage = {
      id: uuidv4(),
      sender: auth.currentUser.email,
      receiver: userDetail.email,
      message: textInput
    };
    console.log(newMessage);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userDetail.username,
      headerLeft: () => {
        return (
          <Image
            style={styles.headerPhoto}
            source={{ uri: userDetail.photo }}
          />
        );
      }
    });
  }, []);

  return (
    <KeyboardAvoidingView style={styles.contianer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MessageList messages={messages} />
      </ScrollView>
      <View style={styles.textWrapper}>
        <TextInput
          placeholder="Type your message"
          style={styles.textInput}
          multiline
          value={textInput}
          onChangeText={newValue => setTextInput(newValue)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={28} color="#fc9803" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  contianer: {
    padding: 10,
    flex: 1
  },
  chatContainer: {
    flex: 1
  },
  headerPhoto: {
    height: 40,
    width: 40,
    marginLeft: 15
  },
  textWrapper: {
    flexDirection: "row"
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    backgroundColor: "#e3e3e3",
    padding: 10,
    borderColor: "#dbdbdb",
    borderWidth: 1,
    borderRadius: 20,
    maxHeight: 200
  },
  sendButton: {
    justifyContent: "flex-end",
    marginLeft: 5,
    paddingBottom: 10
  }
});
