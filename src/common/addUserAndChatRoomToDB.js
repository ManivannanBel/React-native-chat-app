import { executeSql } from "../util/SQLite";

/**
 * Helper to to store user details and the user's chat room details in local DB and return userId and chatRoomId from the tables
 * @param {Details of user and chat room} newChatRoomDetails
 * @returns {userId, chatRoomId}
 */
export const addNewUserAndChatRoomToDB = async newChatRoomDetails => {
  try {
    // console.log("in action creator new room");
    const { email, username, photo, isActive, isBlocked } = newChatRoomDetails;

    //insert user detail into sqlite
    await executeSql(
      "insert into users (email, username, photo, isActive, isBlocked) values(?,?,?,?,?)",
      [email, username, photo, isActive, isBlocked]
    );

    let res1 = await executeSql("SELECT * FROM users where email=?", [email]);

    //console.log("res1", res1.rows._array[0]);
    const userId = parseInt(res1.rows._array[0].id);
    await executeSql(
      "insert into chats (chatItemId, isGroup, lastUpdated) values(?,?,?)",
      [userId, false, Date.now()]
    );

    const newChatRoomResult = await executeSql(
      "SELECT id FROM chats WHERE chatItemId=?",
      [userId]
    );

    return {
      userId,
      chatRoomId: newChatRoomResult.rows._array[0].id
    };
  } catch (error) {
    console.log(error);
  }
};
