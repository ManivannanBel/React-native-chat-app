import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { firestore, auth } from "../util/firebase";
import { insertUser, insertChat } from "../util/SQLite";

const AddChatScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchUserByEmailId = () => {
    //console.log(auth.currentUser.email);

    if (searchQuery.trim === auth.currentUser.email) return;

    const userCollection = firestore.collection("Users");
    userCollection
      .where("email", "==", searchQuery.trim())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(document => {
          console.log(document.data());

          const {
            email,
            username,
            photo,
            isActive,
            isBlocked
          } = document.data();

          //insert user detail into sqlite
          userId = insertUser([email, username, photo, isActive, isBlocked]);
        });
      })
      .catch(err => {
        console.log(err);
        alert(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Enter the user e-mail</Text>
      <TextInput
        style={styles.input}
        type="email"
        value={searchQuery}
        onChangeText={newValue => setSearchQuery(newValue)}
      />
      <View style={{ marginTop: 10, width: 200, alignSelf: "center" }}>
        <Button title={"Add to chat"} onPress={searchUserByEmailId} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold"
  },
  input: {
    marginTop: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    fontSize: 16,
    height: 40,
    padding: 10
  },
  container: {
    margin: 10
  }
});

export default AddChatScreen;
