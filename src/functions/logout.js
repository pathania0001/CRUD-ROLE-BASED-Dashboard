import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

export const logout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    }
  };