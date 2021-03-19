import { executeSql } from "../util/SQLite";

export const getUserFromChatRoomId = async chatRoomId => {
  try {
    const { rows } = await executeSql("SELECT * FROM users WHERE id=?", [
      chatRoomId
    ]);

    let user = null;

    if (rows.length > 0) {
      user = rows._array[0];
    }

    return {
      user
    };
  } catch (error) {
    return {
      user: null
    };
  }
};

export const getLatestMessageForUser = async (
  otherUserEmail,
  currentUserEmail
) => {
  try {
    const {
      rows
    } = await executeSql(
      "SELECT message FROM messages WHERE sender=? AND receiver=? OR sender=? AND receiver=? ORDER BY timestamp DESC LIMIT 1",
      [otherUserEmail, currentUserEmail, currentUserEmail, otherUserEmail]
    );

    let latestMessage = "";

    if (rows.length > 0) {
      latestMessage = rows._array[0].message;
    }

    return {
      latestMessage
    };
  } catch (error) {
    return {
      latestMessage: ""
    };
  }

  // executeSql("SELECT * FROM users WHERE id=?", [chatRoomId])
  //   .then(({ rows }) => {
  //     console.log(rows);
  //     if (rows.length > 0) {
  //       let user = rows._array[0];
  //       setUserDetail(user);
  //       executeSql(
  //         "SELECT message FROM messages WHERE sender=? AND receiver=? OR sender=? AND receiver=? ORDER BY timestamp DESC LIMIT 1",
  //         [otherUserEmail, currentUserEmail, currentUserEmail, otherUserEmail]
  //       )
  //         .then(({ rows }) => {
  //           console.log(rows);
  //           if (rows.length > 0) {
  //             setLatestMessage(rows._array[0].message);
  //           }
  //         })
  //         .catch(err => {
  //           console.log("in err ", err);
  //         });
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
};
