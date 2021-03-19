import * as SQLite from "expo-sqlite";

export const sqlite = SQLite.openDatabase("chat-app.db");

//Create chats table
export const createChatsTable = () => {
  executeSql(
    "CREATE TABLE IF NOT EXISTS chats (id integer primary key not null, chatItemId integer, isGroup boolean, lastUpdated date);"
  )
    .then(() => {})
    .catch((tx, error) => {
      console.log(error);
    });
};

//Create messages table
export const createMessagesTable = () => {
  executeSql(
    "CREATE TABLE IF NOT EXISTS messages (id text primary key not null, message text not null, sender text not null, receiver text not null, groupName text, timestamp timestamp not null, isActive boolean);"
  )
    .then(() => {})
    .catch((tx, error) => {
      console.log(error);
    });
};

//get data from chats table
export const selectFromChats = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "select * from chats",
      [],
      (tx, { results }) => {
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
  executeSql(
    "CREATE TABLE IF NOT EXISTS users (id integer primary key not null, email text unique, username text, photo text, isActive boolean, isBlocked boolean);"
  )
    .then(() => {})
    .catch((tx, error) => {
      console.log(error);
    });
};

//create groups table
export const createGroupsTable = () => {
  sqlite.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS groups (id integer primary key not null, groupName text, photo text, isActive boolean, isBlocked boolean);"
    );
  });
};

// export const detachDB = () => {
//   sqlite.transaction(tx => {
//     tx.executeSql("drop table chats");
//   });
//   sqlite.transaction(tx => {
//     tx.executeSql("drop table users");
//   });
// };

// export const deleteDB = () => {
//   sqlite.transaction(tx => {
//     tx.executeSql("delete table chats");
//   });
//   sqlite.transaction(tx => {
//     tx.executeSql("delete table users");
//   });
// };

export const executeSql = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    sqlite.transaction(tx => {
      tx.executeSql(
        sql,
        params,
        (tx, results) => {
          //console.log("db", db);
          resolve(results);
        },
        (tx, error) => {
          reject(error);
        }
      );
    });
  });
};
