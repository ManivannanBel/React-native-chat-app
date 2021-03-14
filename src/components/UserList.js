import React from "react";
import { View, Text, FlatList } from "react-native";
import UserListItem from "./UserListItem";

const UserList = ({ navigation, chats }) => {
  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <UserListItem userItem={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default UserList;
