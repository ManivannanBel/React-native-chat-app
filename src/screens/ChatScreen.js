import React, { useLayoutEffect, useState, useEffect } from "react";
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
import { auth } from "../util/firebase";
import { Ionicons } from "@expo/vector-icons";
import MessageList from "../components/ChatScreen/MessageList";
import * as Random from "expo-random";
import { connect } from "react-redux";
import {
  sendMessage,
  getOldMessages
} from "../redux/actions/chatScreenActions";
// import { v4 as uuidv4 } from "uuid";

/**
 *
 * @param {object} param0 - Props
 * navigation
 * route -> {userDetails, roomDetails} //from user list item
 * sendMessage -> action creator
 *  messagesInCurrentRoom -> from redux store
 */
const ChatScreen = ({
  navigation,
  route,
  sendMessage,
  chats,
  getOldMessages
}) => {
  const { userDetail, roomDetails } = route.params;

  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);

  //load old messages from local DB initially
  useEffect(() => {
    getOldMessages(auth.currentUser.email, userDetail.email);
  }, []);

  //update every messages
  useEffect(() => {
    let messagesInCurrentRoom = chats[roomDetails.id];
    console.log(messagesInCurrentRoom);

    if (messagesInCurrentRoom) {
      setMessages([...messagesInCurrentRoom]);
    } else {
      setMessages([]);
    }
  }, [chats]);

  //To send the message
  const onSendMessage = () => {
    if (textInput.trim().length === 0) return;

    Keyboard.dismiss();

    const newMessage = {
      id: Random.getRandomBytes(16).toString(),
      sender: auth.currentUser.email,
      receiver: userDetail.email,
      message: textInput,
      timestamp: Date.now(),
      groupName: null,
      isActive: true
    };
    sendMessage(newMessage, roomDetails.id);
    setTextInput("");
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
        <TouchableOpacity style={styles.sendButton} onPress={onSendMessage}>
          <Ionicons name="send" size={28} color="#fc9803" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => ({
  //get only chats from current room id
  chats: state.chatReducer.chats
});

export default connect(mapStateToProps, { sendMessage, getOldMessages })(
  ChatScreen
);

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
