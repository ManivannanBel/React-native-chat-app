import { executeSql, sqlite } from "../../util/SQLite";
import { GET_CHAT_HEADS, ADD_NEW_CHAT_ROOM } from "./type";
import { addNewUserAndChatRoomToDB } from "../../common/addUserAndChatRoomToDB";

export const getChatHeadsFromDB = () => async dispatch => {
  try {
    sqlite.transaction(tx => {
      tx.executeSql("SELECT * FROM chats", [], (tx, { rows }) => {
        // console.log(rows._array);
        dispatch({
          type: GET_CHAT_HEADS,
          payload: rows._array || []
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const addNewChatRoom = newChatRoomDetails => async dispatch => {
  try {
    const { userId, error } = await addNewUserAndChatRoomToDB(
      newChatRoomDetails
    );

    if (error) {
      return;
    }

    const newChatRoomResult = await executeSql(
      "SELECT * FROM chats WHERE chatItemId=?",
      [userId]
    );

    //Update redux state also
    dispatch({
      type: ADD_NEW_CHAT_ROOM,
      payload: newChatRoomResult.rows._array[0]
    });
  } catch (err) {
    console.log(err);
  }
};
