import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddChatScreen from "./src/screens/AddChatScreen";
import {
  createChatsTable,
  createUsersTable,
  createMessagesTable
} from "./src/util/SQLite";
import ChatScreen from "./src/screens/ChatScreen";
import store from "./src/redux/store";
import { Provider } from "react-redux";
// import "react-native-get-random-values";

const Stack = createStackNavigator();

//temp
//-------
import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
//-------

export default function App() {
  useEffect(() => {
    createUsersTable();
    createChatsTable();
    createMessagesTable();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Add new chat" component={AddChatScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
