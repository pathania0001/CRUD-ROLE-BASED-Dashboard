import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { collection, getDocs, query, where, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import Card from "../components/utils/card";
import InputField from "../components/utils/InputFields";
import Buttons from "../components/utils/buttons";
import MultiSelect from "../components/utils/multiSelect";
import useGlobal from "../hooks/useGlobal";
import ReUseAbleTable from "../components/utils/reUseAbleTable";
import { taskCols } from "../components/jsonTableCols/taskCols";

export default function TaskForm({ type = "Create Task" }) {
  const [loading, setLoading] = useState(false);
  
  const [task, setTask] = useState({
    title: "",
    desc: "",
    status: "Pending",
    location:""
  });
  const { id } = useParams()
  const [orginalTasks,setOriginalTasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [originalTask, setOriginalTask] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [columns ,setColumns] = useState(taskCols);
  const { error, success, user, role, render,setRender ,actionPermission, setActionPermission} = useGlobal()
   


  const navigate
    = useNavigate()
  useEffect(() => {
    if (!role) return
    fetchUsers();
    getTasks()
  }, [role, render, id]);

  const unioncolumns = ['actions','title']
  
  useEffect(()=>{
    
    if(id){
      const foundTask = orginalTasks.find(task => task.id === id);
      const modifiedTask = tasks.find((task)=>{
        return task.id === id
      })
      setTask(modifiedTask)
      setOriginalTask(foundTask);
    }
  },[id,orginalTasks])


  const fetchUsers = async () => {
    
    try {
      const roleRef = collection(db, "roles");

      // Query to get all user IDs where role is "user"
      const roleQuery = query(roleRef, where("role", "==", "user"));
      const roleSnapshot = await getDocs(roleQuery);

      if (roleSnapshot.empty) {
        console.log("No users with role 'user' found.");
        return;
      }

      // Extract user details from role documents
      const userList = roleSnapshot.docs.map((doc) => ({
        id: doc.data().email, // Firestore document ID (User ID)
        name: doc.data().email, // User email
      }));

     
      setUsers(userList);

    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if(id){

      setOriginalTask((prevTask)=>{
        let prev = {...prevTask, [name]:value}
       // console.log("prevoriginal task:", prev)
        return prev;
      })
    }
    setTask({ ...task, [name]: value });
  };

  // console.log("tasking me:",task)

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("checking task",task)
    // console.log("original ok task",originalTask)
    if(!task?.title){
      error("Task title is required")
      return;
    }
    try {
      const tasksRef = collection(db, "tasks");

      if (id) {
        
        const taskDocRef = doc(db, "tasks", id);
        await updateDoc(taskDocRef, {
          title: `${role==="user"?originalTask?.title:task?.title}`,
          desc: `${role==="user"?originalTask?.desc:task?.desc}`,
          status: `${role==="user"?originalTask?.status:task?.status}`,
          location: `${role==="user"?originalTask?.location:task?.location}`,
          permissions: selectedUsers || [], 
          updatedAt: new Date(),
        });

        console.log("Task updated successfully!");
        success("Task updated successfully!");
        navigate("/dashboard/task")
      } else {
       
        
        await addDoc(tasksRef, {
          ...task,
          permissions: selectedUsers, 
          createdAt: new Date(), 
        });
        
        console.log("Task added successfully!");
        success("Task added successfully!");
      }
      
      // Reset form
      setTask({ title: "", desc: "", status: "Pending",location:"",permissions:[] });
      
      setSelectedUsers([]);
      
      setRender(!render)
    } catch (err) {
      error("Error processing task:");
      console.error("Error processing task:", err);
    }
  };


  const getTasks = async () => {
    try {
      
      let tasksRef = collection(db, "tasks"); // Firestore collection reference
      let taskQuery = query(tasksRef); // Base query
      const taskSnapshot = await getDocs(taskQuery);
      let taskList = taskSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
       console.log("All Tasks before :",taskList)
 
       setOriginalTasks(taskList)
       
      if (role !== "admin") {
        
        let updatedTaskLists = [];
        taskList?.map((task)=>{
         // console.log("taskk",task)
          task?.permissions.map((perm)=>{
            if(perm?.id === user?.email){
              updatedTaskLists.push(task)
            }
          })
        })
        taskList = updatedTaskLists;
      }
      let updatedTaskData = {};
      // console.log("All Tasks after :",taskList)
      handleTasksData(taskList)
       
      // setTasks(taskList);
      
      if (id) {
        const data = taskList.find((q) => q.id === id);
        setTask(data)
        setSelectedUsers(data?.permissions)
      }
      else{
        setTask({ title: "", desc: "", status: "Pending",location:""});
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  console.log("checking columns :",unioncolumns) 

   const handleTasksData = (taskData) =>{
    //console.log("taskData in handle",taskData)
    if(role ==="admin"){
      setTasks(taskData)
      return;
    }
    
    let updatedTaskData = structuredClone(taskData);
    updatedTaskData.map((task) =>{
        
      task?.permissions.map((perm)=>{  
        if(perm?.id !== user?.email)
          return;
       ["location", "status","desc"].forEach((type) => {
       // console.log("Permission in description:", type, perm?.desc, task?.desc);

         if (task?.[type] && !perm?.[type]) {
            task[type] = "";
        }
    });

      })
      
    })
    // console.log("updated refrence",taskData)
     //console.log("updated tasks",updatedTaskData)
     
      makeEffectiveColumns(updatedTaskData)
   
     setTasks(updatedTaskData);
    
    
   }
    

   const makeEffectiveColumns = (temptasks) => {
    //  console.log("makeEffectiveColumns",temptasks)
    if (temptasks.length > 0) {
      const allPermissions = [];
      temptasks?.map((task)=>{
        task?.permissions?.map((perm)=>{
          if(perm?.id === user.email)
          {
            allPermissions.push(perm);
            return
          }
        })
      })
      // console.log("allPermissions", allPermissions);
      allPermissions?.map((permission)=>{
        ["desc","location","status"].map((perm)=>{
          // console.log("checking condition :",unioncolumns,permission[perm],perm)
          if(permission[perm] && !unioncolumns.includes(perm))
          {
            unioncolumns.push(perm);
            // console.log("checking ongoing columns :",unioncolumns,perm)
          }
        })
        
      })
      // console.log("checking after updation :",unioncolumns) 

      setColumns((prev) =>{
        const updatedCols = [];
         prev.map((column) => {
        
          
        // console.log("checking cols-col :",column.name.toLowerCase()) 
            if(column.name === "actions"){
              updatedCols.push(column);
            }
            else if(unioncolumns?.includes(column?.accessor))
            {  
              // console.log("checking going :",column?.name.toLowerCase()) 
              updatedCols.push(column);
              // console.log("checking updated :",updatedCols)
            }
         })
        //  console.log("checking columns :",updatedCols)
         return updatedCols;
      })
      
    
      const userViewPermissions = {};
      
      temptasks.map((task)=>{
        task.permissions.map((perm) => {
          if(perm?.id === user?.email) 
          {
            userViewPermissions[task?.id] = perm
          }
        })
        
      })
     
       setActionPermission(userViewPermissions)
  
    }
    return []
   }
   //console.log("   permissionss :",actionPermission)
  //  console.log("Selected Users:", selectedUsers);
  //  console.log("Users:", users);

  
  // if(id){
  //   console.log("task to be edited",originalTask);
  // }
  
  // console.log("updated task",task)
  // console.log("updated task",tasks)




  return (
    <>
     <div className=" container mx-auto space-y-8">

      {
        (role === "admin" || user?.creation || actionPermission[id]?.edit) && <Card title={type}>
          <form onSubmit={handleSubmit} className="py-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                type="text"
                id="title"
                value={task?.title}
                handleInputChange={handleChange}
                placeholder="Task Title"
                label="Title"
                required
              />

              <InputField
                id="desc"
                name="desc"
                value={task?.desc}
                handleInputChange={handleChange}
                placeholder="Task Description"
                label="Description"           
                required
                isDisable={role==="user" && id && !task?.desc}
              />

              <InputField
                id="status"
                name="status"
                value={task?.status}
                handleInputChange={handleChange}
                label="Status"
                type="select"
                isDisable={role==="user" && id && !task?.status}
                required
                options={[
                  { value: "Pending", name: "Pending" },
                  { value: "In Progress", name: "In Progress" },
                  { value: "Completed", name: "Completed" },
                ]}
              />
              <InputField
                id="location"
                name="location"
                value={task?.location}
                handleInputChange={handleChange}
                label="Location"
                isDisable={role==="user" && id && !task?.location}
                
              />

             <div className="space-y-2 col-span-2">
                <MultiSelect
                  label="Assign Users & Permissions"
                  users={users}
                  selectedUsers={selectedUsers}
                  handleUserSelection={setSelectedUsers}
                  isDisable={role==="user" &&  id &&  task?.permissions?.length}
                />
              </div>
            
               
               </div>
            <Buttons type="submit" className="w-full bg-blue-500 text-white py-2" spinner={false}>
              {!id ? "Create Task" : "Update Task"}
            </Buttons>
          </form>
        </Card>
      }
      <Card title={"Tasks"}>
        <div className="mt-5">
          <ReUseAbleTable cols={columns} data={tasks} />
        </div>
      </Card>
     </div>

    </>
  );
}
