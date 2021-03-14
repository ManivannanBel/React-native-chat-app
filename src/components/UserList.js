import React from "react";
import { View, Text, FlatList } from "react-native";
import UserListItem from "./UserListItem";

const UserList = ({ navigation, chats }) => {
  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <UserListItem roomDetails={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default UserList;
