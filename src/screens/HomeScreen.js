import React, { useLayoutEffect, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { auth } from "../util/firebase";
import UserListItem from "../components/UserListItem";
import UserList from "../components/UserList";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import Pusher from "pusher-js/react-native";
import {
  sqlite,
  selectFromChats,
  detachDB,
  executeSql,
  createMessagesTable
} from "../util/SQLite";
import { getChatHeadsFromDB } from "../redux/actions/homeScreenActions";
import { connect } from "react-redux";
import { receiveMessage } from "../redux/actions/chatScreenActions";

Pusher.logToConsole = true;

const HomeScreen = ({
  navigation,
  getChatHeadsFromDB,
  chatHeads,
  receiveMessage
}) => {
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  //Header styling
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

  useEffect(() => {
    //subscribe to pusher
    subscribeUserToPusher();

    //load chat heads into redux store
    //if (chats.length === 0) {
    getChatHeadsFromDB();
    //}
  }, []);

  useEffect(() => {
    //update the chats in home screen from redux store
    setChats(Object.values(chatHeads));
  }, [chatHeads]);

  const subscribeUserToPusher = () => {
    var pusher = new Pusher("75b82346f5c0e8bf56da", {
      cluster: "ap2"
    });

    //Subscribe to current user's channel
    let channelName = auth.currentUser.email;
    let channel;

    if (!subscribed) {
      const channel = pusher.subscribe(channelName);
      channel.bind("message", data => {
        //console.log("recievedddd-------", JSON.stringify(data));
        receiveMessage(data.message, chatHeads);
      });
      setSubscribed(true);
    }

    //Subscribe to all the groups of current users
    // for (group of groups) {
    //   let channelName = group.id;
    //   const channel = pusher.subscribe(channelName);
    //   channel.bind("message", data => {
    //     alert(JSON.stringify(data));
    //   });
    // }
  };

  const logout = () => {
    auth.signOut();
  };

  const clearDB = async () => {
    //detachDB();
    try {
      await executeSql("DELETE FROM chats");
      await executeSql("DELETE FROM users");
      await executeSql("DELETE FROM messages");
      // await executeSql(
      //   "CREATE TABLE IF NOT EXISTS messages (id integer primary key not null, message text not null, sender text, receiver text, groupName text, timestamp timestamp not null, isActive boolean);"
      // );
    } catch (err) {
      console.log("err", err);
    }
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

const mapStateToProps = state => ({
  chatHeads: state.chatReducer.chatHeads
});

export default connect(mapStateToProps, { getChatHeadsFromDB, receiveMessage })(
  HomeScreen
);
