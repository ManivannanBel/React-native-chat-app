import { executeSql } from "../util/SQLite";

//Helper function to store messages in local DB
export const saveMessageToDB = async messageData => {
  const {
    id,
    message,
    sender,
    receiver,
    timestamp,
    group,
    isActive
  } = messageData;

  //(id integer primary key not null, message text not null, sender text not null, receiver text not null, group text, timestamp timestamp not null, isActive boolean);
  await executeSql(
    "insert into messages (id, message, sender, receiver, groupName, timestamp, isActive) values(?,?,?,?,?,?,?)",
    [id, message, sender, receiver, group, timestamp, isActive]
  );
};
