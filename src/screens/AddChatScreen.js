import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { firestore, auth } from "../util/firebase";
import { executeSql } from "../util/SQLite";
import { searchUserFromFirestore } from "../common/firebaseHelper";
import { connect } from "react-redux";
import { addNewChatRoom } from "../redux/actions/homeScreenActions";

const AddChatScreen = ({ addNewChatRoom }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const searchUserByEmailId = async () => {
    //console.log(searchQuery.trim() === auth.currentUser.email);

    if (searchQuery.trim() === auth.currentUser.email) return;

    try {
      //search and get user details from firestore
      const { querySnapshot } = await searchUserFromFirestore(searchQuery);
      querySnapshot.forEach(document => {
        //add the fetched user detail to local DB and create a chat room
        addNewChatRoom(document.data());
      });
    } catch (err) {
      console.log(err);
    }
    // userCollection
    //   .where("email", "==", searchQuery.trim())
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(async document => {
    //       console.log(document.data());
    //       //call action creator to store data in DB and update redux store
    //       addNewChatRoom(document.data());
    //     });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert(err.message);
    //   });
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

export default connect(null, { addNewChatRoom })(AddChatScreen);
