import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALmr-VGHm3rzXdIQLs-jW8YE17XLytx3E",
  authDomain: "rn-chat-app-8808a.firebaseapp.com",
  projectId: "rn-chat-app-8808a",
  storageBucket: "rn-chat-app-8808a.appspot.com",
  messagingSenderId: "705596596619",
  appId: "1:705596596619:web:9529528e83ac5374010f8e",
  measurementId: "G-N67QHD95ZC"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
export const auth = firebase.auth();
