import { useEffect, useState } from 'react'
import useGlobal from '../hooks/useGlobal'
import { Outlet } from 'react-router-dom';
import SideBar from '../components/header-footer/SideBar';
// import DashBoardHeader from '../components/header-footer/dashBoardHeader';
import ChangePass from '../components/auth/ChangePass';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from '../config/firebase';
import { getIdTokenResult, onAuthStateChanged } from 'firebase/auth';
import DashBoardHeader from '../components/header-footer/dashBoardHeader';

const DashboardLayout = () => {
  const context = useGlobal()
  const navigate = useNavigate()
  const { height, sideBarOpen, user, setUser, setCounts, setRole, token, render } = context
  const [initialModal, setInitialModal] = useState(false);
  useEffect(() => {

  }, [])




  const fetchDetails = async () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        //console.log("User:", user);
       // console.log(user.uid, typeof (user.uid))

        // Reference to "users" collection
        const usersRef = collection(db, "roles");

        // Query to find user by UID
        const q = query(usersRef, where("user", "==", user.uid));
        console.log("usersRef :", q);

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first matching document (assuming UID is unique)
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          //console.log("User Data:", userData);

          // ✅ Set user state with fetched data
          setUser({ ...userData, uid: user.uid });
          setRole(userData?.role)
        } else {
          console.log("No user role found!");
          setUser({ uid: user.uid, email: user.email, role: "user" }); // Default role
        }
      } else {
        console.log("No user found");
        setUser(null);
      }
    });
  };

  const automation = async () => {
    // const { data } = await apiHandler.patch("/automation")
  }
  // const fetchCounts = async () => {
  //   try {
  //     const currentYear = new Date().getFullYear();
  //     const { data } = await apiHandler.get(`counts/${currentYear}`);
  //     setCounts(data.data);
  //   } catch (error) {
  //     console.error("Error fetching counts:", error);
  //   }
  // }

  useEffect(() => {
    automation()
  }, [])

  useEffect(() => {
    if (!token) return;
    fetchDetails()

  }, [token, render])

  return (
    <>
      <div className='flex  bg-background'>
  
        <div className={`w-full`} >
          <DashBoardHeader />
        
          <div className={`main p-4 space-y-8 overflow-y-auto ${sideBarOpen && "blur"} duration-500 `} style={{ height: `calc(100vh - ${height}px)` }}>
            <Outlet context={context} />
          </div>
      
        </div>
        
      </div>

    </>
  )
}

export default DashboardLayout