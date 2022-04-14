import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUq6YkzJ98lxd5pzZupZl3KtXwImoQGzw",
  authDomain: "react-slack-537d6.firebaseapp.com",
  projectId: "react-slack-537d6",
  storageBucket: "react-slack-537d6.appspot.com",
  messagingSenderId: "941930467597",
  appId: "1:941930467597:web:04eee80f371be457d16044",
  measurementId: "G-7BNN0B1R88",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export { database };
