import React from "react";
import { StyleSheet, Text, View } from "react-native";

const ReceivedMessage = ({ message }) => {
  return (
    <View>
      <Text style={styles.text}>{message.message}</Text>
    </View>
  );
};

export default ReceivedMessage;

const styles = StyleSheet.create({
  text: {
    marginLeft: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "flex-start",
    backgroundColor: "#dedede",
    color: "black",
    padding: 10
  }
});
