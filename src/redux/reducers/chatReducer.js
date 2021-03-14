import {
  SEND_MESSAGE,
  GET_CHAT_HEADS,
  RECEIVE_MESSAGE,
  CHANGE_CHAT_ROOM,
  ADD_NEW_CHAT_ROOM,
  LOAD_OLD_MESSAGES
} from "../actions/type";

//store the chats in all the chats items
const initialState = {
  /* format
    chats : {
        chatId : {[messages]}
    }
     */
  chats: {},
  chatHeads: {}
};

export default (state = initialState, actions) => {
  switch (actions.type) {
    case GET_CHAT_HEADS:
      return {
        ...state,
        chatHeads: getChatHeadsHelper(actions.payload)
      };
    case ADD_NEW_CHAT_ROOM:
      return {
        ...state,
        chatHeads: addNewChatRoomHelper(state.chatHeads, actions.payload)
      };
    case SEND_MESSAGE:
      return {
        ...state,
        chats: sendMessageHelper(state.chats, actions.payload)
      };
    case RECEIVE_MESSAGE:
      return {
        ...state,
        chats: recieveMessageHelper(state.chats, actions.payload)
      };
    case LOAD_OLD_MESSAGES:
      return {
        ...state,
        chats: loadOldMessagesHelper(state.chats, actions.payload)
      };
    default:
      return state;
  }
};

//To initial load chat heads/ rooms from DB
const getChatHeadsHelper = payload => {
  const newChatHeads = payload.reduce(
    (acc, chatHead) => ((acc[chatHead.id] = chatHead), acc),
    {}
  );
  return newChatHeads;
};

//If you sent the message, then the reciever should be updated
const sendMessageHelper = (chats, payload) => {
  const { message, roomId } = payload;
  const messageInCurrentRoom = chats[roomId];

  //chat is already present in store
  if (messageInCurrentRoom) {
    return { ...chats, [roomId]: [...messageInCurrentRoom, message] };
  } else {
    //if chat is undefined
    return { ...chats, [roomId]: [message] };
  }
};

//Helper function for revieved messages
const recieveMessageHelper = (chats, payload) => {
  const { message, roomId } = payload;

  const messageInCurrentRoom = chats[roomId];

  //chat is already present in store
  if (messageInCurrentRoom) {
    return { ...chats, [roomId]: [...messageInCurrentRoom, message] };
  } else {
    //if chat is undefined
    return { ...chats, [roomId]: [message] };
  }
};

//Helper function to add new chat room / user
const addNewChatRoomHelper = (chatHeads, newChatRoom) => {
  return { ...chatHeads, [newChatRoom.id]: newChatRoom };
};

const loadOldMessagesHelper = (chats, payload) => {
  const { messages, roomId } = payload;
  return { ...chats, [roomId]: messages };
};
