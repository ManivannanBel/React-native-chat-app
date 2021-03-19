import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { executeSql } from "../../util/SQLite";
import {
  getUserFromChatRoomId,
  getLatestMessageForUser
} from "../../common/chatRoomItemHelper";
import { auth } from "../../util/firebase";

const UserListItem = ({ navigation, roomDetails }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    //Load user detail and latest message from DB
    (async function() {
      const { user } = await getUserFromChatRoomId(roomDetails.chatItemId);
      setUserDetail(user);
      if (user) {
        const { latestMessage } = await getLatestMessageForUser(
          user.email,
          auth.currentUser.email
        );
        setLatestMessage(latestMessage);
      }
    })();
  }, []);

  if (!userDetail) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Chat", { userDetail, roomDetails });
      }}
    >
      <View style={styles.contianer}>
        <Image
          style={styles.avatar}
          source={{
            uri: userDetail.photo
          }}
        />
        <View style={styles.textWrapper}>
          <Text style={styles.userName}>{userDetail.username}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {latestMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    height: 50,
    width: 50,
    margin: 5
  },
  contianer: {
    padding: 5,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#a3a3a3"
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    textAlignVertical: "center",
    flex: 1
  },
  textWrapper: {
    flex: 1,
    alignItems: "flex-start"
  },
  lastMessage: {
    textAlignVertical: "center",
    flex: 1
  }
});

export default UserListItem;
