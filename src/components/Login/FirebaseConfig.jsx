import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzKGa-Kp2PnyleRLV5YKBkwckdyXQH4cA",
  authDomain: "emailpasswordlogin-c8b96.firebaseapp.com",
  projectId: "emailpasswordlogin-c8b96",
  storageBucket: "emailpasswordlogin-c8b96.appspot.com",
  messagingSenderId: "362202109939",
  appId: "1:362202109939:web:154a49be5a977d29a5e486",
};

const app = initializeApp(firebaseConfig);
export const database = getAuth(app);
