import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD3lutZTve_vqBd57coUB84zad2nxnj27o",
  authDomain: "role-based-crud-dashboard.firebaseapp.com",
  projectId: "role-based-crud-dashboard",
  storageBucket: "role-based-crud-dashboard.firebasestorage.app",
  messagingSenderId: "203851871364",
  appId: "1:203851871364:web:c8b4cbbf60c28d17547ed1",
  measurementId: "G-RQSWHKQ721"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;