// import { useEffect, useRef, useState } from 'react';
import useGlobal from '../../hooks/useGlobal';
import { Home, LogOut, Menu, Search, SidebarClose, UserRoundCog, Bot, CalendarCheck, CalendarDays, CalendarPlus, UserPlus, UsersRound, Scroll } from 'lucide-react';
import InputField from '../utils/InputFields';
import { DropdownMenu } from '../utils/dropdown';
import Persona from '../utils/persona';
import { useEffect, useRef, useState } from 'react';
import { logout } from '../../functions/logout';
import { auth } from '../../config/firebase';
import Buttons from '../utils/buttons';
import { Link } from 'react-router-dom';

const searchFields = [
  { label: "Dashboard", path: "/dashboard", icon: <Home /> },
  { label: "Appointments", path: "/dashboard/all-appointment", icon: <CalendarCheck /> },
  { label: "Chat Bot", path: "/dashboard/chat-bot", icon: <Bot /> },
  { label: "Add clinician", path: "/dashboard/add-clinician", icon: <UserPlus /> },
  { label: "Manage clinicians", path: "/dashboard/manage-clinician", icon: <UsersRound /> },
  { label: "Add Patient", path: "/dashboard/add-patient", icon: <UserPlus /> },
  { label: "Manage Patients", path: "/dashboard/manage-patient", icon: <UsersRound /> },
  { label: "Metric Survey", path: "/dashboard/metric-survey", icon: <Scroll className="w-5" /> },
  { label: "Mood Survey", path: "/dashboard/mood-survey", icon: <Scroll className="w-5" /> },
  { label: "New Blog", path: "/dashboard/new-blog", icon: <CalendarPlus className="w-5" /> },
  { label: "All Blogs", path: "/dashboard/all-blogs", icon: <CalendarDays className="w-5" /> },
  { label: "Profile", path: "/dashboard/profile", icon: <UserRoundCog className="w-5" /> },
];

const DashBoardHeader = () => {
  const { sideBarOpen, setSideBarOpen, user, navigate ,role} = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFields, setFilteredFields] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  const dropdownRef = useRef(null);
const ref=useRef(null)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filtered = searchFields.filter(field =>
        field.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFields(filtered);
    } else {
      setFilteredFields([]);
    }
  };

  const handleItemClick = (path) => {
    if (path) {
      setSearchTerm('');
      setFilteredFields([]);
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout()
    navigate("/");
  };

  const dropDownItems = [
    {
      title: <span className='lowercase'>{auth?.currentUser?.email}</span>,
      // path: "/dashboard/profile",
      icon: <UserRoundCog />,
      onClick: () => {
        setDropDown(!dropDown);
      }
    },
    {
      title: "logout",
      icon: <LogOut />,
      onClick: () => {
        handleLogout();
        setDropDown(!dropDown);
      }
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      
      }
      if(ref.current && !ref.current.contains(event.target)){
        setFilteredFields([])
        setSearchTerm("")
      }
    };
    if (dropDown || searchTerm || filteredFields?.length>0) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDown,filteredFields,searchTerm]);
  


  return (
    
    <header className='  px-4 bg-primary  shadow shadow-background nav '>
      <div className=' container mx-auto'>
      <div className='flex items-center justify-between  p-2 md:p-4'>
      <div className='flex gap-4 items-center'>
        <div className={`md:hidden`} onClick={() => { setSideBarOpen(!sideBarOpen) }} >
          {sideBarOpen ? <SidebarClose /> : <Menu />}
        </div>
        {role === "admin" &&
        ( <div className='space-x-4 px-4'> 
        <Link 
        to={"/dashboard/task"}
        className='text-lg text-white underline'>      
          Task
         </Link>
         <Link 
         to={"/dashboard/user"}
         className='text-lg text-white underline'>
          User  
         </Link>
         </div>)}
      </div>
     
      <div ref={dropdownRef}>
        <div className='flex items-center gap-4 mr-4 '>
        
          <h4 className='text-lg font-bold capitalize text-white'>{role}</h4>
          <div className='relative  border-white'>
          <button onClick={() => setDropDown(!dropDown)} className='bg-white rounded-full w-10 h-10 text-2xl '>{auth?.currentUser?.email[0].toUpperCase()}</button>
        <DropdownMenu listItems={dropDownItems} className={`${dropDown ? "opacity-100 visible" : "opacity-0 invisible"} duration-300 font-semibold`} />
          </div>
         </div>
      </div>
      </div>
      </div>
    </header>
  );
};
export default DashBoardHeader
