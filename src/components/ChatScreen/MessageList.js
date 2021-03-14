import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { auth } from "../../util/firebase";
import SentMessage from "./SentMessage";
import ReceivedMessage from "./ReceivedMessage";

const MessageList = ({ messages }) => {
  return (
    <View>
      {messages.map(message =>
        message.sender === auth.currentUser.email ? (
          <SentMessage key={message.id} message={message} />
        ) : (
          <ReceivedMessage key={message.id} message={message} />
        )
      )}
    </View>
  );
};

export default MessageList;

const styles = StyleSheet.create({});
