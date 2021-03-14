import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { auth } from "../util/firebase";
import UserListItem from "../components/UserListItem";
import UserList from "../components/UserList";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import Pusher from "pusher-js/react-native";
import { sqlite, selectFromChats, detachDB } from "../util/SQLite";

Pusher.logToConsole = false;

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);

  useLayoutEffect(() => {
    sqlite.transaction(tx => {
      tx.executeSql("select * from chats", [], (_, { rows }) => {
        console.log(JSON.stringify(rows._array));
        setChats(rows._array);
      });
    });
  }, []);

  useEffect(() => {
    var pusher = new Pusher("75b82346f5c0e8bf56da", {
      cluster: "ap2"
    });

    //Subscribe to current user's channel
    let channelName = auth.currentUser.email;
    const channel = pusher.subscribe(channelName);
    channel.bind("message", data => {
      alert(JSON.stringify(data));
    });

    //Subscribe to all the groups of current users
    for (group of groups) {
      let channelName = group.id;
      const channel = pusher.subscribe(channelName);
      channel.bind("message", data => {
        alert(JSON.stringify(data));
      });
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: auth.currentUser.displayName,
      headerLeft: () => {
        return (
          <View style={{ marginLeft: 25 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Add new chat");
              }}
              activeOpacity={0.5}
            >
              <Entypo name="add-user" size={27} color="black" />
            </TouchableOpacity>
          </View>
        );
      }
    });
  }, []);

  const logout = () => {
    auth.signOut();
  };

  const clearDB = () => {
    detachDB();
  };

  return (
    <View syle={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserList chats={chats} navigation={navigation} />
        <Button onPress={logout} title="logout" />
        <Button onPress={clearDB} title="clear db" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white"
  }
});

export default HomeScreen;
