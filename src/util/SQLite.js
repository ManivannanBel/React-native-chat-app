import * as SQLite from "expo-sqlite";

export const sqlite = SQLite.openDatabase("chat-app.db");

//Create chats table
export const createChatsTable = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS chats (id integer primary key not null, chatItemId integer unique, isGroup boolean, lastUpdated date);"
    );
  });
};

//Insert chat
export const insertChat = chatDetail => {
  sqlite.transaction(tx => {
    try {
      tx.executeSql(
        "insert into chats (chatItemId, isGroup, lastUpdated) values(?,?,?)",
        chatDetail
      );
      //   console.log("------------------------------");
      //   tx.executeSql("select * from chats", [], (_, { rows }) => {
      //     console.log(JSON.stringify(rows));
      //   });
    } catch (err) {
      console.log(err);
    }
  }, null);
};

//get data from chats table
export const selectFromChats = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "select * from chats",
      [],
      (tx, { results }) => {
        //console.log(results, " ---");

        resolve(results);
      },
      error => {
        reject(error);
      }
    );
  });
};

//create users table
export const createUsersTable = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS users (id integer primary key not null, email text unique, username text, photo text, isActive boolean, isBlocked boolean);"
    );
  });
};

//insert user
export const insertUser = userDetail => {
  sqlite.transaction(tx => {
    try {
      tx.executeSql(
        "insert into users (email, username, photo, isActive, isBlocked) values(?,?,?,?,?)",
        userDetail
      );
      //console.log("+++++++++++++++++++++++++");
      tx.executeSql(
        "select * from users where email=?",
        [userDetail[0]],
        (_, { rows }) => {
          //console.log(JSON.stringify(rows));

          const userId = parseInt(rows._array[0].id);

          //inset chat into chats table in sqlite
          insertChat([userId, false, new Date().toISOString()]);
        }
      );
    } catch (err) {
      console.log(err);
    }
  }, null);
};

//create groups table
export const createGroupsTable = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS groups (id integer primary key not null, groupName text, photo text, isActive boolean, isBlocked boolean);"
    );
  });
};

export const detachDB = () => {
  sqlite.transaction(tx => {
    tx.executeSql("drop table chats");
  });
};
