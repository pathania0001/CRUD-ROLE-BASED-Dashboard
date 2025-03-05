import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/utils/card";
import InputField from "../components/utils/InputFields";
import Buttons from "../components/utils/buttons";
import { signUp } from "../functions/sign-up";
import useGlobal from "../hooks/useGlobal";
import { adminCreateUser } from "../functions/createUser";
import { userCols } from "../components/jsonTableCols/userCols";
import ReUseAbleTable from "../components/utils/reUseAbleTable";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";

export default function UserForm({ type = "Add User" }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { id } = useParams()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { success, error,render } = useGlobal()
  const [users, setUsers] = useState([]);
  const [columns] = useState(userCols);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  
  const fetchUsers = async () => {
    try {
        const roleRef = collection(db, "roles");
        const roleQuery = query(roleRef, where("role", "==", "user"));
        const roleSnapshot = await getDocs(roleQuery);

        if (roleSnapshot.empty) {
            console.log("No users with role 'user' found.");
            setUsers([]); 
            return;
        }

       
        const userList = roleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);

     
        if (id) {
            console.log("Searching for user with ID:", id);
            const selectedUser = userList.find((user) => user.id === id);
            setUser(selectedUser || { email: "", password: "" }); 
        }
        else {
          setUser({ email: "", password: "" });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};


  useEffect(() => {
    fetchUsers();
}, [ id]); 

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user.email ||  !user.password)
    {
      error("Please fill Email and Password!")
      return;
    }
    setLoading(true);
    try {
         
    if(id)
      {
         const userDocRef = doc(db, "roles", id);

           await updateDoc(userDocRef, {
                   email: user.email,
                   creation: user.creation,
                   updatedAt: new Date(), 
                 });
                 success("Task updated successfully!");
                 navigate("/dashboard/user")
      }

     else {  const userCredential = await adminCreateUser(user.email, user.password ,user.creation)
      fetchUsers()
      //console.log(userCredential);
      success("User created successfully")}
    } catch (err) {
      console.error("Error creating user:", err);
      error(err.message || "Failed to create user")
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="container mx-auto space-y-8">
      <Card title={type}>
        <form onSubmit={handleSubmit} className="py-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              type="email"
              id="email"
              value={user?.email}
              handleInputChange={handleChange}
              placeholder="Email"
              label="Email"
              required
            />
            <InputField
              type="password"
              id="password"
              value={user?.password}
              handleInputChange={handleChange}
              placeholder="Password"
              label="Password"
              required
            />
            <InputField
              type="checkbox"
              id="creation"
              checked={user?.creation || false}
              handleInputChange={handleChange}
              label="Task Creation "
              required
            />
          </div>

          <Buttons
            type="submit"
            className="w-full bg-blue-500 text-white py-2"
            disabled={loading}
            spinner={false}
          >
            {loading ? "Processing..." : type === "Add User" ? "Add User" : "Update User"}
          </Buttons>
        </form>
      </Card>
      <Card>

        <ReUseAbleTable cols={columns} data={users} />
      </Card>
      </div>
    </>
  );
}
