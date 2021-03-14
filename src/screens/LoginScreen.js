import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../util/firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log(user);

      if (user != null) {
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  const loginUser = () => {
    if (formDataIsValid(email, password)) {
      auth
        .signInWithEmailAndPassword(email, password)
        .catch(err => alert(err.message));
    }
  };

  const formDataIsValid = (email, password) => {
    if (email.length === 0) {
      alert("enter valid email");
      return false;
    }
    if (password.length === 0) {
      alert("please enter password");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="ios-chatbubble-ellipses-outline"
        size={200}
        color="#f79423"
      />
      <View style={styles.inputs}>
        <TextInput
          placeholder={"Email"}
          type="email"
          style={styles.email}
          value={email}
          onChangeText={newValue => setEmail(newValue)}
        />
        <TextInput
          placeholder={"Password"}
          type="password"
          style={styles.password}
          secureTextEntry
          value={password}
          onChangeText={newValue => setPassword(newValue)}
        />
        <View style={{ marginTop: 10, width: 200, alignSelf: "center" }}>
          <Button color="#f79423" onPress={loginUser} title="login" />
        </View>
        <View style={{ marginTop: 5, width: 200, alignSelf: "center" }}>
          <Button
            color="#f79423"
            onPress={() => navigation.navigate("Register")}
            title="register"
          />
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
  button: {
    width: 200,
    marginBottom: 5,
    backgroundColor: "#f79423"
  }
});

export default LoginScreen;
