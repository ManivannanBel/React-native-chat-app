import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SentMessage = ({ message }) => {
  return (
    <View>
      <Text style={styles.text}>{message.message}</Text>
    </View>
  );
};

export default SentMessage;

const styles = StyleSheet.create({
  text: {
    marginRight: 10,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: "flex-end",
    backgroundColor: "#f58f14",
    color: "white",
    padding: 10
  }
});
