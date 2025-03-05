import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword, updateCurrentUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const adminCreateUser = async (email, password,creation=false, role = "user") => {
  try {
    const adminUser = auth.currentUser;
    if (!adminUser) {
      throw new Error("Admin is not logged in.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;

    console.log("New User UID:", newUser.uid);

    await setDoc(doc(db, "roles", newUser.uid), {
      user: newUser.uid,
      role: role,
      email: newUser.email,
      creation
    });

    console.log("New user added to Firestore");

    await updateCurrentUser(auth, adminUser);

    console.log("Admin session restored");

    return newUser;
  } catch (error) {
    console.error("User Creation Error:", error.message);
    throw error;
  }
};
