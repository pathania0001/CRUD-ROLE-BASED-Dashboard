import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDQaTn9IIC3uU8UablRt3cUhs3nZK5DJcY",
  authDomain: "inlaid-booth-412703.firebaseapp.com",
  projectId: "inlaid-booth-412703",
  storageBucket: "inlaid-booth-412703.firebasestorage.app",
  messagingSenderId: "67486826984",
  appId: "1:67486826984:web:6a0b2974a3c310d6c5a45d",
  measurementId: "G-5MG4QBD1TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;