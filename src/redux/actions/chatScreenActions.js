import axios from "axios";
import { executeSql } from "../../util/SQLite";
import { firestore } from "../../util/firebase";
import {
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  ADD_NEW_CHAT_ROOM,
  LOAD_OLD_MESSAGES
} from "./type";
import { addNewUserAndChatRoomToDB } from "../../common/addUserAndChatRoomToDB";
import { saveMessageToDB } from "../../common/saveMessageToDB";

/**
 * Action creator to send message
 * @param {object} message - new message being sent
 * @param {number} roomId  - to update the chat room in redux store
 */
export const sendMessage = (messageData, roomId) => async dispatch => {
  try {
    await axios.post(
      "https://react-native-chat-app-api.herokuapp.com/api/v0/send",
      messageData
    );

    await saveMessageToDB(messageData);

    console.log(messageData);

    dispatch({
      type: SEND_MESSAGE,
      payload: {
        message: messageData,
        roomId
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export const receiveMessage = newMessage => async dispatch => {
  //find senders room id
  const { sender } = newMessage;

  try {
    let userResult = await executeSql("SELECT id FROM users WHERE email=?", [
      sender
    ]);

    await saveMessageToDB(newMessage);

    if (userResult.rows.length === 0) {
      //If you user row not present in local db, fetch from cloud
      firestore
        .collection("Users")
        .where("email", "==", sender)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async document => {
            const { chatRoomId, userId } = await addNewUserAndChatRoomToDB(
              document.data()
            );

            const newChatRoomResult = await executeSql(
              "SELECT * FROM chats WHERE chatItemId=?",
              [userId]
            );

            //add the newly created chat room to redux store
            dispatch({
              type: ADD_NEW_CHAT_ROOM,
              payload: newChatRoomResult.rows._array[0]
            });

            //update the recieved message to store
            dispatch({
              type: RECEIVE_MESSAGE,
              payload: {
                message: newMessage,
                roomId: chatRoomId
              }
            });
          });
        });

      // dispatch(addNewChatRoom(docuemnt.data()));
    } else {
      //If user and chat room is already present in local DB, then continue
      let userId = userResult.rows._array[0].id;

      let chatRoomResult = await executeSql(
        "SELECT id FROM chats WHERE chatItemId=?",
        [userId]
      );

      if (chatRoomResult.rows.length === 0) {
        //If room is not present create it
      }

      dispatch({
        type: RECEIVE_MESSAGE,
        payload: {
          message: newMessage,
          roomId: chatRoomResult.rows._array[0].id
        }
      });
    }
  } catch (error) {
    console.log("error ", error);
  }
};

export const getOldMessages = (sender, receiver) => async dispatch => {
  try {
    const messagesResult = await executeSql(
      "SELECT * FROM messages WHERE sender=? AND receiver=? OR sender=? AND receiver=?",
      [sender, receiver, receiver, sender]
    );

    const userResult = await executeSql("SELECT * FROM users WHERE email=?", [
      receiver
    ]);

    const userId = userResult.rows._array[0].id;
    const chatRoomResult = await executeSql(
      "SELECT * FROM chats WHERE chatItemId=?",
      [userId]
    );

    //console.log(messagesResult.rows._array);

    dispatch({
      type: LOAD_OLD_MESSAGES,
      payload: {
        messages: messagesResult.rows._array,
        roomId: chatRoomResult.rows._array[0].id
      }
    });
  } catch (error) {
    console.log(error);
  }
};
