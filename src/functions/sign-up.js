import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

export const signUp = async (email, password, role = "user") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      //console.log("User UID:", user.uid); // Debugging
  
      await setDoc(doc(db, "roles", user.uid), {
        user: user.uid,
        role: role,
        email:user.email
      });
  
      console.log("User successfully added to Firestore");
      return user;
    } catch (error) {
      console.error("Signup Error:", error.message);
      throw error;
    }
  };
  