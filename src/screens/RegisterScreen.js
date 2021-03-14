import React, { useState } from "react";
import { View, TextInput, StyleSheet, Button, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, firestore } from "../util/firebase";

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");

  //Register user
  const registerUser = () => {
    if (formDataIsValid(username, email, password, confirmationPassword)) {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
          if (userCredentials.user) {
            createUser(userCredentials);
          }
        })
        .catch(err => alert(err.message));
    }
  };

  const createUser = userCredentials => {
    //store user details in firestore
    addUserDetailsToFirestore();

    //update user credentials
    userCredentials.user
      .updateProfile({
        displayName: username
      })
      .then(() => {});
  };

  //To store the user details in firestore
  const addUserDetailsToFirestore = () => {
    const usersCollection = firestore.collection("Users");
    usersCollection
      .add({
        username,
        email,
        photo:
          "https://firebasestorage.googleapis.com/v0/b/rn-chat-app-8808a.appspot.com/o/profile.png?alt=media&token=d84a725e-1c8f-4541-95d4-3aabec349cee",
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isBlocked: false,
        groups: []
      })
      .then(() => {
        console.log("user details added");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const formDataIsValid = () => {
    if (username.length < 5) {
      alert("username length should be at least 5");
      return false;
    }
    if (email.length === 0) {
      alert("enter valid email");
      return false;
    }
    if (password.length < 8) {
      alert("password length should be at least 8");
      return false;
    }
    if (password !== confirmationPassword) {
      alert("confirmation password mismatch");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create your account</Text>
      <Ionicons
        name="ios-chatbubble-ellipses-outline"
        size={200}
        color="#f79423"
      />
      <View style={styles.inputs}>
        <TextInput
          placeholder={"Username"}
          type="text"
          style={styles.email}
          value={username}
          onChangeText={newValue => setUsername(newValue.trim())}
        />
        <TextInput
          placeholder={"Email"}
          type="email"
          style={styles.email}
          value={email}
          onChangeText={newValue =>
            setEmail(newValue.trim().toLocaleLowerCase())
          }
        />
        <TextInput
          placeholder={"Password"}
          type="password"
          style={styles.password}
          secureTextEntry
          value={password}
          onChangeText={newValue => setPassword(newValue)}
        />
        <TextInput
          placeholder={"Confirm password"}
          type="password"
          style={styles.password}
          secureTextEntry
          value={confirmationPassword}
          onChangeText={newValue => setConfirmationPassword(newValue)}
        />
        <View style={{ marginTop: 5, width: 200, alignSelf: "center" }}>
          <Button color="#f79423" title="Register" onPress={registerUser} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 5,
    backgroundColor: "white"
  },
  inputs: {
    width: 300
  },
  email: {
    fontSize: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    height: 50
  },
  password: {
    fontSize: 16,
    marginBottom: 5,
    borderBottomWidth: 1,
    height: 50
  },
  text: {
    fontSize: 25,
    marginBottom: 20
  }
});

export default RegisterScreen;
