import { firestore } from "../util/firebase";

export const searchUserFromFirestore = async searchQuery => {
  try {
    let userCollection = firestore.collection("Users");
    let querySnapshot = await userCollection
      .where("email", "==", searchQuery.trim())
      .get();

    return {
      querySnapshot
    };
  } catch (error) {
    console.log(error);
  }
};
