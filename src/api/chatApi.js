import axios from "axios";

export const sendMessage = async newMessage => {
  try {
    const response = await axios.post("localhost:5000/api/v0/send", message);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
